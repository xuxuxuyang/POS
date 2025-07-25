// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, startDate, endDate } = event
  const wxContext = cloud.getWXContext()
  
  // 检查权限
  try {
    // 权限检查（仅管理员可访问）
    const isAdmin = await checkIsAdmin(wxContext.OPENID)
    if (!isAdmin) {
      return {
        code: 403,
        message: '权限不足'
      }
    }
    
    // 根据操作类型执行不同的统计操作
    switch (action) {
      case 'getOrderStats':
        // 获取订单统计数据
        try {
          // 转换日期字符串为时间对象
          const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30))
          const end = endDate ? new Date(endDate) : new Date()
  
          // 按日期分组统计订单数量
          const dailyOrdersResult = await db.collection('order')
            .aggregate()
            .match({
              created_at: _.gte(start).and(_.lte(end))
            })
            .addFields({
              dateStr: $.dateToString({
                date: '$created_at',
                format: '%Y-%m-%d'
              })
            })
            .group({
              _id: '$dateStr',
              count: $.sum(1)
            })
            .sort({
              _id: 1
            })
            .end()
  
          // 按状态分组统计订单数量
          const orderStatusResult = await db.collection('order')
            .aggregate()
            .match({
              created_at: _.gte(start).and(_.lte(end))
            })
            .group({
              _id: '$order_status',
              count: $.sum(1)
            })
            .end()
  
          // 转换成需要的格式
          const dailyOrders = dailyOrdersResult.list.map(item => ({
            date: item._id,
            count: item.count
          }))
  
          const orderStatusCounts = {}
          orderStatusResult.list.forEach(item => {
            orderStatusCounts[item._id] = item.count
          })
  
          // 统计总订单数
          const totalOrdersResult = await db.collection('order')
            .count()
  
          // 统计产品销量TOP5
          const topProductsResult = await db.collection('order')
            .aggregate()
            .match({
              created_at: _.gte(start).and(_.lte(end))
            })
            .group({
              _id: '$product_id',
              count: $.sum(1)
            })
            .sort({
              count: -1
            })
            .limit(5)
            .lookup({
              from: 'product',
              localField: '_id',
              foreignField: '_id',
              as: 'product_info'
            })
            .end()
  
          const topProducts = topProductsResult.list.map(item => ({
            product_id: item._id,
            product_name: item.product_info[0]?.name || '未知产品',
            sales: item.count
          }))
  
          return {
            code: 0,
            data: {
              dailyOrders,
              orderStatusCounts,
              totalOrders: totalOrdersResult.total,
              topProducts
            },
            message: '获取订单统计成功'
          }
        } catch (error) {
          console.error('获取订单统计失败:', error)
          return {
            code: 500,
            message: '获取订单统计失败',
            error: error.message
          }
        }
  
      case 'getUserStats':
        // 获取用户统计数据
        try {
          // 转换日期字符串为时间对象
          const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30))
          const end = endDate ? new Date(endDate) : new Date()
  
          // 按日期分组统计新增用户数
          const dailyUsersResult = await db.collection('user')
            .aggregate()
            .match({
              created_at: _.gte(start).and(_.lte(end))
            })
            .addFields({
              dateStr: $.dateToString({
                date: '$created_at',
                format: '%Y-%m-%d'
              })
            })
            .group({
              _id: '$dateStr',
              count: $.sum(1)
            })
            .sort({
              _id: 1
            })
            .end()
  
          // 转换成需要的格式
          const dailyUsers = dailyUsersResult.list.map(item => ({
            date: item._id,
            count: item.count
          }))
  
          // 统计总用户数
          const totalUsersResult = await db.collection('user')
            .count()
  
          // 统计认证用户数
          const verifiedUsersResult = await db.collection('user')
            .where({
              status: 1
            })
            .count()
  
          // 统计活跃用户数（有订单的用户）
          const activeUsersResult = await db.collection('order')
            .aggregate()
            .group({
              _id: '$user_id'
            })
            .count('activeUsers')
            .end()
  
          return {
            code: 0,
            data: {
              dailyUsers,
              totalUsers: totalUsersResult.total,
              verifiedUsers: verifiedUsersResult.total,
              activeUsers: activeUsersResult.list[0]?.activeUsers || 0
            },
            message: '获取用户统计成功'
          }
        } catch (error) {
          console.error('获取用户统计失败:', error)
          return {
            code: 500,
            message: '获取用户统计失败',
            error: error.message
          }
        }
  
      case 'getRegionStats':
        // 获取地区分布数据
        try {
          // 按地区分组统计用户数量
          const regionResult = await db.collection('user')
            .aggregate()
            .match({
              address: _.exists(true)
            })
            .group({
              _id: '$address.province',
              count: $.sum(1)
            })
            .sort({
              count: -1
            })
            .end()
  
          // 转换成需要的格式
          const regionData = regionResult.list.map(item => ({
            region: item._id || '未知',
            count: item.count
          }))
  
          return {
            code: 0,
            data: regionData,
            message: '获取地区分布成功'
          }
        } catch (error) {
          console.error('获取地区分布失败:', error)
          return {
            code: 500,
            message: '获取地区分布失败',
            error: error.message
          }
        }
  
      case 'getProductPreferenceStats':
        // 获取产品偏好数据
        try {
          // 按产品分组统计订单数量
          const productResult = await db.collection('order')
            .aggregate()
            .group({
              _id: '$product_id',
              count: $.sum(1)
            })
            .sort({
              count: -1
            })
            .lookup({
              from: 'product',
              localField: '_id',
              foreignField: '_id',
              as: 'product_info'
            })
            .end()
  
          // 按产品类别分组
          const categoryData = {}
          productResult.list.forEach(item => {
            const category = item.product_info[0]?.category || '其他'
            if (!categoryData[category]) {
              categoryData[category] = 0
            }
            categoryData[category] += item.count
          })
  
          // 转换成需要的格式
          const preferenceData = Object.keys(categoryData).map(key => ({
            category: key,
            count: categoryData[key]
          }))
  
          return {
            code: 0,
            data: preferenceData,
            message: '获取产品偏好成功'
          }
        } catch (error) {
          console.error('获取产品偏好失败:', error)
          return {
            code: 500,
            message: '获取产品偏好失败',
            error: error.message
          }
        }
      
      case 'getDashboardData':
        // 获取仪表盘数据（汇总各项关键指标）
        try {
          // 今日日期
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          // 本月第一天
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
          
          // 上月第一天
          const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          
          // 本月最后一天
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
          
          // 上月最后一天
          const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)
          
          // 统计总订单数
          const totalOrdersResult = await db.collection('order').count()
          
          // 统计今日订单数
          const todayOrdersResult = await db.collection('order')
            .where({
              created_at: _.gte(today)
            })
            .count()
            
          // 统计本月订单数
          const monthOrdersResult = await db.collection('order')
            .where({
              created_at: _.gte(firstDayOfMonth).and(_.lte(lastDayOfMonth))
            })
            .count()
            
          // 统计上月订单数
          const lastMonthOrdersResult = await db.collection('order')
            .where({
              created_at: _.gte(firstDayOfLastMonth).and(_.lte(lastDayOfLastMonth))
            })
            .count()
            
          // 计算环比增长率
          const orderGrowthRate = lastMonthOrdersResult.total === 0 ? 100 : 
            (monthOrdersResult.total - lastMonthOrdersResult.total) / lastMonthOrdersResult.total * 100
          
          // 统计总用户数
          const totalUsersResult = await db.collection('user').count()
          
          // 统计今日新增用户
          const todayUsersResult = await db.collection('user')
            .where({
              created_at: _.gte(today)
            })
            .count()
            
          // 统计产品总数
          const totalProductsResult = await db.collection('product').count()
          
          // 统计库存不足产品数
          const lowStockProductsResult = await db.collection('product')
            .where({
              stock: _.lte(10)
            })
            .count()
            
          // 统计申请转化率（假设创建了申请表单浏览记录）
          const conversionRate = 0
          
          return {
            code: 0,
            data: {
              orders: {
                total: totalOrdersResult.total,
                today: todayOrdersResult.total,
                month: monthOrdersResult.total,
                growthRate: orderGrowthRate.toFixed(2)
              },
              users: {
                total: totalUsersResult.total,
                newToday: todayUsersResult.total
              },
              products: {
                total: totalProductsResult.total,
                lowStock: lowStockProductsResult.total
              },
              conversion: {
                rate: conversionRate
              }
            },
            message: '获取仪表盘数据成功'
          }
          
        } catch (error) {
          console.error('获取仪表盘数据失败:', error)
          return {
            code: 500,
            message: '获取仪表盘数据失败',
            error: error.message
          }
        }
  
      default:
        return {
          code: 400,
          message: '不支持的操作类型'
        }
    }
  } catch (error) {
    console.error('统计操作失败:', error)
    return {
      code: 500,
      message: '服务器错误',
      error: error.message
    }
  }
}

// 检查用户是否为管理员
async function checkIsAdmin(openid) {
  // 查询角色记录
  const result = await db.collection('role').where({
    openid: db.command.in([openid]),
    role_name: db.command.in(['admin', 'super_admin'])
  }).get()
  
  return result.data.length > 0
} 