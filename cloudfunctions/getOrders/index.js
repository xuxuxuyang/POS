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
  const { user_id, status, page = 1, pageSize = 10, order_id } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 如果指定了订单ID，直接查询单个订单
    if (order_id) {
      const orderResult = await db.collection('order').doc(order_id).get()
      
      if (!orderResult.data) {
        return {
          code: 404,
          message: '订单不存在'
        }
      }
      
      // 验证权限（只能查询自己的订单，或者是管理员）
      const isAdmin = await checkIsAdmin(wxContext.OPENID)
      if (orderResult.data.user_openid !== wxContext.OPENID && !isAdmin) {
        return {
          code: 403,
          message: '没有权限查看该订单'
        }
      }
      
      // 查询产品信息
      const productResult = await db.collection('product').doc(orderResult.data.product_id).get()
      
      // 返回订单详情
      return {
        code: 0,
        data: {
          order: orderResult.data,
          product: productResult.data || null
        },
        message: '获取订单成功'
      }
    }
    
    // 构建查询条件
    const query = {}
    
    // 指定用户的订单
    if (user_id) {
      // 验证权限
      const userResult = await db.collection('user').doc(user_id).get()
      
      if (!userResult.data) {
        return {
          code: 404,
          message: '用户不存在'
        }
      }
      
      // 只能查询自己的订单，或者是管理员
      const isAdmin = await checkIsAdmin(wxContext.OPENID)
      if (userResult.data._openid !== wxContext.OPENID && !isAdmin) {
        return {
          code: 403,
          message: '没有权限查看该用户的订单'
        }
      }
      
      query.user_id = user_id
    } else {
      // 如果没有指定用户ID，则只能查询自己的订单
      const isAdmin = await checkIsAdmin(wxContext.OPENID)
      
      // 管理员可以查看所有订单，普通用户只能查看自己的
      if (!isAdmin) {
        query.user_openid = wxContext.OPENID
      }
    }
    
    // 按状态筛选
    if (status !== undefined) {
      query.order_status = status
    }
    
    // 计算总数
    const countResult = await db.collection('order').where(query).count()
    const total = countResult.total
    
    // 分页查询订单列表
    const ordersResult = await db.collection('order')
      .where(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
      .get()
    
    // 获取关联的产品信息
    const orders = ordersResult.data
    const productIds = [...new Set(orders.map(order => order.product_id))]
    
    // 批量查询产品
    const productResults = await db.collection('product').where({
      _id: _.in(productIds)
    }).get()
    
    // 构建产品ID到产品的映射
    const productMap = {}
    productResults.data.forEach(product => {
      productMap[product._id] = product
    })
    
    // 将产品信息关联到订单
    const ordersWithProduct = orders.map(order => {
      return {
        ...order,
        product: productMap[order.product_id] || null
      }
    })
    
    // 返回结果
    return {
      code: 0,
      data: {
        list: ordersWithProduct,
        pagination: {
          total,
          current: page,
          pageSize,
          pages: Math.ceil(total / pageSize)
        }
      },
      message: '获取订单列表成功'
    }
  } catch (error) {
    console.error('获取订单失败:', error)
    return {
      code: 500,
      message: '获取订单失败',
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