// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-9grox8bwd6dbce0c'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 处理OPTIONS请求（CORS预检）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      },
      body: JSON.stringify({
        code: 0,
        message: 'Success'
      })
    }
  }

  // 处理POST请求
  if (event.httpMethod === 'POST') {
    try {
      // 解析请求体
      const params = event.body ? JSON.parse(event.body) : {}
      
      // 合并参数
      const action = params.action || event.action
      
      // 根据操作类型分发处理
      let result = null
      switch (action) {
        case 'getOrderList':
          result = await getOrderList(params)
          break
        case 'getOrderDetail':
          result = await getOrderDetail(params.orderId)
          break
        case 'updateOrderStatus':
          result = await updateOrderStatus(params.orderId, params.status, params.remarks)
          break
        case 'updateLogisticsInfo':
          result = await updateLogisticsInfo(params.orderId, params.logisticsInfo)
          break
        case 'getProductList':
          result = await getProductList(params)
          break
        case 'getUserList':
          result = await getUserList(params)
          break
        default:
          result = {
            code: 1,
            message: '未知的操作类型'
          }
      }
      
      // 返回HTTP格式的响应
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify(result)
      }
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          code: 1,
          message: '请求处理失败',
          error: error.message
        })
      }
    }
  }

  // 非HTTP请求，直接处理
  const { action, ...params } = event
  switch (action) {
    case 'getOrderList':
      return getOrderList(params)
    case 'getOrderDetail':
      return getOrderDetail(params.orderId)
    case 'updateOrderStatus':
      return updateOrderStatus(params.orderId, params.status, params.remarks)
    case 'updateLogisticsInfo':
      return updateLogisticsInfo(params.orderId, params.logisticsInfo)
    case 'getProductList':
      return getProductList(params)
    case 'getUserList':
      return getUserList(params)
    default:
      return {
        code: 1,
        message: '未知的操作类型'
      }
  }
}

/**
 * 获取订单列表
 */
async function getOrderList(params = {}) {
  try {
    const { query = {}, page = 1, pageSize = 10 } = params
    
    // 构建查询条件
    const dbQuery = {}
    
    // 处理状态条件
    if (query.order_status !== undefined && query.order_status !== '') {
      dbQuery.order_status = Number(query.order_status)
    }
    
    // 处理关键词搜索
    if (query.$or) {
      dbQuery.$or = query.$or
    }
    
    // 处理日期范围
    if (query.created_at) {
      dbQuery.created_at = query.created_at
    }
    
    // 计算总数
    const countResult = await db.collection('order').where(dbQuery).count()
    const total = countResult.total
    
    // 查询数据
    const result = await db.collection('order')
      .where(dbQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
      .get()
    
    // 获取关联的产品信息
    const orders = result.data
    const productIds = [...new Set(orders.filter(o => o.product_id).map(o => o.product_id))]
    
    let productMap = {}
    if (productIds.length > 0) {
      const productResult = await db.collection('product').where({
        _id: _.in(productIds)
      }).get()
      
      productMap = productResult.data.reduce((map, product) => {
        map[product._id] = product
        return map
      }, {})
    }
    
    // 关联产品信息
    const ordersWithProduct = orders.map(order => {
      // 获取产品信息
      const product = order.product_id ? productMap[order.product_id] : null
      const product_name = product ? product.name : '未知产品'
      
      return {
        ...order,
        product_name
      }
    })
    
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
    console.error('获取订单列表失败:', error)
    return {
      code: 1,
      message: '获取订单列表失败',
      error: error.message
    }
  }
}

/**
 * 获取订单详情
 */
async function getOrderDetail(orderId) {
  try {
    if (!orderId) {
      return {
        code: 1,
        message: '订单ID不能为空'
      }
    }
    
    // 查询订单
    const orderResult = await db.collection('order').doc(orderId).get()
    
    if (!orderResult.data) {
      return {
        code: 404,
        message: '订单不存在'
      }
    }
    
    // 查询关联产品
    let product = null
    if (orderResult.data.product_id) {
      const productResult = await db.collection('product').doc(orderResult.data.product_id).get()
      product = productResult.data
    }
    
    return {
      code: 0,
      data: {
        order: orderResult.data,
        product
      },
      message: '获取订单详情成功'
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return {
      code: 1,
      message: '获取订单详情失败',
      error: error.message
    }
  }
}

/**
 * 更新订单状态
 */
async function updateOrderStatus(orderId, status, remarks = '') {
  try {
    if (!orderId) {
      return {
        code: 1,
        message: '订单ID不能为空'
      }
    }
    
    if (status === undefined) {
      return {
        code: 1,
        message: '订单状态不能为空'
      }
    }
    
    // 更新数据
    await db.collection('order').doc(orderId).update({
      data: {
        order_status: Number(status),
        remarks,
        updated_at: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '更新订单状态成功'
    }
  } catch (error) {
    console.error('更新订单状态失败:', error)
    return {
      code: 1,
      message: '更新订单状态失败',
      error: error.message
    }
  }
}

/**
 * 更新物流信息
 */
async function updateLogisticsInfo(orderId, logisticsInfo) {
  try {
    if (!orderId) {
      return {
        code: 1,
        message: '订单ID不能为空'
      }
    }
    
    if (!logisticsInfo) {
      return {
        code: 1,
        message: '物流信息不能为空'
      }
    }
    
    // 更新数据
    await db.collection('order').doc(orderId).update({
      data: {
        logistics_info: logisticsInfo,
        updated_at: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '更新物流信息成功'
    }
  } catch (error) {
    console.error('更新物流信息失败:', error)
    return {
      code: 1,
      message: '更新物流信息失败',
      error: error.message
    }
  }
}

/**
 * 获取产品列表
 */
async function getProductList(params = {}) {
  try {
    const { query = {}, page = 1, pageSize = 10 } = params
    
    // 构建查询条件
    const dbQuery = {}
    
    // 处理状态条件
    if (query.status !== undefined && query.status !== '') {
      dbQuery.status = Number(query.status)
    }
    
    // 计算总数
    const countResult = await db.collection('product').where(dbQuery).count()
    const total = countResult.total
    
    // 查询数据
    const result = await db.collection('product')
      .where(dbQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
      .get()
    
    return {
      code: 0,
      data: {
        list: result.data,
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

/**
 * 获取用户列表
 */
async function getUserList(params = {}) {
  try {
    const { query = {}, page = 1, pageSize = 10 } = params
    
    // 构建查询条件
    const dbQuery = {}
    
    // 处理状态条件
    if (query.status !== undefined && query.status !== '') {
      dbQuery.status = Number(query.status)
    }
    
    // 计算总数
    const countResult = await db.collection('user').where(dbQuery).count()
    const total = countResult.total
    
    // 查询数据
    const result = await db.collection('user')
      .where(dbQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('created_at', 'desc')
      .get()
    
    return {
      code: 0,
      data: {
        list: result.data,
        pagination: {
          total,
          current: page,
          pageSize,
          pages: Math.ceil(total / pageSize)
        }
      },
      message: '获取用户列表成功'
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      code: 1,
      message: '获取用户列表失败',
      error: error.message
    }
  }
} 