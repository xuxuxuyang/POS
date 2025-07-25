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
  const { page = 1, pageSize = 10, category, status, keyword } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 构建查询条件
    const query = {}
    
    // 如果指定了分类，添加分类过滤
    if (category) {
      query.category = category
    }
    
    // 如果指定了状态（上架/下架），添加状态过滤
    if (status !== undefined) {
      query.status = status
    } else {
      // 默认只查询上架的产品
      query.status = 1
    }
    
    // 如果有关键字搜索
    if (keyword) {
      // 关键字搜索（匹配产品名称或描述）
      query.$or = [
        {
          name: db.RegExp({
            regexp: keyword,
            options: 'i' // 不区分大小写
          })
        },
        {
          description: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        },
        {
          model: db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        }
      ]
    }
    
    // 计算总数
    const countResult = await db.collection('product').where(query).count()
    const total = countResult.total
    
    // 查询产品列表
    let productsQuery = db.collection('product')
      .where(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
    
    // 默认按热度排序（销量降序）
    productsQuery = productsQuery.orderBy('sales', 'desc')
    
    const products = await productsQuery.get()
    
    // 返回结果
    return {
      code: 0,
      data: {
        list: products.data,
        pagination: {
          total,
          current: page,
          pageSize,
          pages: Math.ceil(total / pageSize)
        }
      },
      message: '获取产品列表成功'
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return {
      code: 1,
      message: '获取产品列表失败',
      error: error.message
    }
  }
} 