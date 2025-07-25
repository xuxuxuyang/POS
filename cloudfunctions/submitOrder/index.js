// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { 
    user_id, 
    product_id, 
    quantity = 1, 
    delivery_type,
    delivery_address,
    appointment_time,
    merchant_info,
    bank_info,
    remarks
  } = event
  const wxContext = cloud.getWXContext()
  
  // 事务操作
  const transaction = await db.startTransaction()
  
  try {
    // 获取用户信息
    const userRes = await transaction.collection('user').doc(user_id).get()
    if (!userRes.data) {
      await transaction.rollback()
      return {
        code: 404,
        message: '用户不存在'
      }
    }
    
    // 验证用户openid与当前调用者是否一致
    if (userRes.data._openid !== wxContext.OPENID) {
      await transaction.rollback()
      return {
        code: 403,
        message: '权限不足'
      }
    }
    
    // 获取产品信息
    const productRes = await transaction.collection('product').doc(product_id).get()
    if (!productRes.data) {
      await transaction.rollback()
      return {
        code: 404,
        message: '产品不存在'
      }
    }
    
    const product = productRes.data
    
    // 检查产品是否上架
    if (product.status !== 1) {
      await transaction.rollback()
      return {
        code: 400,
        message: '产品已下架'
      }
    }
    
    // 检查库存
    if (product.stock < quantity) {
      await transaction.rollback()
      return {
        code: 400,
        message: '产品库存不足'
      }
    }
    
    // 创建订单
    const orderData = {
      user_id,
      user_openid: wxContext.OPENID,
      product_id,
      quantity,
      total_amount: product.price ? product.price * quantity : 0,
      deposit_amount: product.deposit * quantity,
      deposit_status: 0, // 未支付
      delivery_type,
      delivery_address,
      appointment_time: appointment_time ? new Date(appointment_time) : null,
      order_status: 0, // 待审核
      merchant_info,
      bank_info,
      remarks,
      _openid: wxContext.OPENID,
      created_at: db.serverDate(),
      updated_at: db.serverDate()
    }
    
    // 插入订单
    const orderRes = await transaction.collection('order').add({
      data: orderData
    })
    
    // 更新产品销量和库存
    await transaction.collection('product').doc(product_id).update({
      data: {
        stock: db.command.inc(-quantity),
        sales: db.command.inc(quantity),
        updated_at: db.serverDate()
      }
    })
    
    // 插入客户跟进记录
    await transaction.collection('follow_up').add({
      data: {
        user_id,
        admin_id: null, // 系统自动跟进，无管理员
        content: `用户提交了${product.name}的订单申请`,
        contact_type: -1, // 系统记录
        follow_up_time: db.serverDate(),
        next_follow_up_time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24小时后跟进
        _openid: wxContext.OPENID,
        created_at: db.serverDate(),
        updated_at: db.serverDate()
      }
    })
    
    // 提交事务
    await transaction.commit()
    
    // 发送订阅消息
    try {
      // 获取订阅消息模板ID
      const configRes = await db.collection('config').where({
        key: 'subscribe_template_ids'
      }).get()
      
      let templateId = ''
      if (configRes.data && configRes.data.length > 0) {
        templateId = configRes.data[0].value.orderSubmit || ''
      }
      
      if (templateId) {
        await cloud.openapi.subscribeMessage.send({
          touser: wxContext.OPENID,
          templateId: templateId,
          page: `pages/order/detail?id=${orderRes._id}`,
          data: {
            thing1: {
              value: product.name.length > 20 ? product.name.substring(0, 17) + '...' : product.name
            },
            character_string2: {
              value: orderRes._id
            },
            phrase3: {
              value: '待审核'
            },
            date4: {
              value: new Date().toLocaleDateString().replace(/\//g, '-')
            },
            thing5: {
              value: '感谢您的申请，我们将尽快处理'
            }
          }
        })
      }
    } catch (err) {
      console.error('发送订阅消息失败', err)
      // 不影响主流程，忽略错误
    }
    
    return {
      code: 0,
      data: {
        order_id: orderRes._id,
        deposit_amount: product.deposit * quantity
      },
      message: '订单提交成功'
    }
  } catch (error) {
    // 发生错误时回滚事务
    try {
      await transaction.rollback()
    } catch (rollbackError) {
      console.error('回滚事务失败:', rollbackError)
    }
    
    console.error('提交订单失败:', error)
    return {
      code: 500,
      message: '提交订单失败',
      error: error.message
    }
  }
} 