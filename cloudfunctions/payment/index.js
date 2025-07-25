// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 微信支付配置
const paymentConfig = {
  // 微信支付商户号，需要在实际部署时替换
  mchId: 'YOUR_MCH_ID',
  
  // 微信支付API密钥，用于签名验证，需要在实际部署时替换
  apiKey: 'YOUR_API_KEY',
  
  // 回调通知地址，需要在实际部署时替换
  notifyUrl: 'YOUR_NOTIFY_URL'
}

/**
 * 生成微信支付所需的签名
 * @param {Object} params 签名参数
 * @returns {String} 签名结果
 */
function generateSign(params) {
  // 1. 参数按字典序排序
  const sortedKeys = Object.keys(params).sort()
  
  // 2. 拼接键值对
  let stringA = ''
  sortedKeys.forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      stringA += `${key}=${params[key]}&`
    }
  })
  
  // 3. 拼接API密钥
  const stringSignTemp = stringA + `key=${paymentConfig.apiKey}`
  
  // 4. MD5加密并转为大写
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase()
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 检查是否是HTTP触发器调用
  if (event.httpMethod) {
    try {
      // 从HTTP请求体中解析参数
      const params = event.body ? JSON.parse(event.body) : {}
      // 合并参数
      event = {
        ...event,
        ...params
      }
      
      // 如果是OPTIONS请求（预检请求），直接返回成功
      if (event.httpMethod === 'OPTIONS') {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          },
          body: JSON.stringify({
            code: 0,
            message: 'Success'
          })
        }
      }
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          code: 1,
          message: '请求参数解析失败',
          error: error.message
        })
      }
    }
  }

  const { action, orderData, outTradeNo, refundData } = event
  const wxContext = cloud.getWXContext()
  
  if (!wxContext.OPENID) {
    const result = {
      code: 401,
      message: '未获取到用户身份'
    }
    
    // 如果是HTTP触发器调用，返回HTTP格式的响应
    if (event.httpMethod) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      }
    }
    
    return result
  }
  
  try {
    switch (action) {
      case 'create':
        // 创建支付订单
        try {
          if (!orderData || !orderData.out_trade_no || !orderData.total_fee) {
            const result = {
              code: 400,
              message: '订单参数不完整'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          // 检查订单是否已存在
          const orderCheck = await db.collection('payment').where({
            out_trade_no: orderData.out_trade_no,
            _openid: wxContext.OPENID
          }).get()
          
          if (orderCheck.data && orderCheck.data.length > 0) {
            const result = {
              code: 400,
              message: '订单已存在'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          // 保存订单信息
          await db.collection('payment').add({
            data: {
              _openid: wxContext.OPENID,
              out_trade_no: orderData.out_trade_no,
              body: orderData.body || 'POS机押金',
              total_fee: orderData.total_fee,
              deposit_type: orderData.deposit_type || '1',
              created_at: db.serverDate(),
              status: 0 // 0-待支付
            }
          })
          
          // 调用微信支付统一下单API（实际项目中需要通过HTTPS请求微信支付API）
          // 这里为了示例，直接返回模拟数据
          const prepayId = 'wx' + Date.now() + Math.random().toString().substr(2, 10)
          
          // 生成支付参数
          const timeStamp = Math.floor(Date.now() / 1000).toString()
          const nonceStr = Math.random().toString(36).substr(2, 15)
          const package = `prepay_id=${prepayId}`
          const signType = 'MD5'
          
          // 生成支付签名
          const paySign = generateSign({
            appId: wxContext.APPID,
            timeStamp,
            nonceStr,
            package,
            signType
          })
          
          const result = {
            code: 0,
            message: '创建支付订单成功',
            data: {
              timeStamp,
              nonceStr,
              package,
              signType,
              paySign,
              out_trade_no: orderData.out_trade_no
            }
          }
          
          // 如果是HTTP触发器调用，返回HTTP格式的响应
          if (event.httpMethod) {
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(result)
            }
          }
          
          return result
        } catch (error) {
          console.error('创建支付订单失败:', error)
          const result = {
            code: 500,
            message: '创建支付订单失败',
            error: error.message
          }
          
          // 如果是HTTP触发器调用，返回HTTP格式的响应
          if (event.httpMethod) {
            return {
              statusCode: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(result)
            }
          }
          
          return result
        }
      
      case 'query':
        // 查询支付结果
        try {
          if (!outTradeNo) {
            const result = {
              code: 400,
              message: '订单号不能为空'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          // 查询支付记录
          const paymentQuery = await db.collection('payment').where({
            out_trade_no: outTradeNo,
            _openid: wxContext.OPENID
          }).get()
          
          if (!paymentQuery.data || paymentQuery.data.length === 0) {
            const result = {
              code: 404,
              message: '订单不存在'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 404,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          const paymentInfo = paymentQuery.data[0]
          
          // 实际项目中需要调用微信支付查询API
          // 这里为了示例，直接返回数据库中的支付状态
          const result = {
            code: 0,
            message: '查询支付结果成功',
            data: {
              out_trade_no: paymentInfo.out_trade_no,
              total_fee: paymentInfo.total_fee,
              status: paymentInfo.status,
              status_text: paymentInfo.status === 1 ? '支付成功' : (paymentInfo.status === 2 ? '已退款' : '待支付'),
              paid_time: paymentInfo.paid_time || null
            }
          }
          
          // 如果是HTTP触发器调用，返回HTTP格式的响应
          if (event.httpMethod) {
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(result)
            }
          }
          
          return result
        } catch (error) {
          console.error('查询支付结果失败:', error)
          const result = {
            code: 500,
            message: '查询支付结果失败',
            error: error.message
          }
          
          // 如果是HTTP触发器调用，返回HTTP格式的响应
          if (event.httpMethod) {
            return {
              statusCode: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(result)
            }
          }
          
          return result
        }
      
      case 'refund':
        // 申请退款
        try {
          if (!refundData || !refundData.out_trade_no || !refundData.out_refund_no || !refundData.total_fee || !refundData.refund_fee) {
            const result = {
              code: 400,
              message: '退款参数不完整'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          // 查询支付记录
          const paymentQuery = await db.collection('payment').where({
            out_trade_no: refundData.out_trade_no,
            _openid: wxContext.OPENID
          }).get()
          
          if (!paymentQuery.data || paymentQuery.data.length === 0) {
            const result = {
              code: 404,
              message: '订单不存在'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 404,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          const paymentInfo = paymentQuery.data[0]
          
          // 检查支付状态
          if (paymentInfo.status !== 1) {
            const result = {
              code: 400,
              message: '只有支付成功的订单才能退款'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          // 检查退款金额
          if (refundData.refund_fee > paymentInfo.total_fee) {
            const result = {
              code: 400,
              message: '退款金额不能大于支付金额'
            }
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              }
            }
            
            return result
          }
          
          // 更新支付记录
          await db.collection('payment').doc(paymentInfo._id).update({
            data: {
              status: 2, // 已退款
              refund_info: {
                out_refund_no: refundData.out_refund_no,
                refund_fee: refundData.refund_fee,
                refund_time: db.serverDate()
              }
            }
          })
          
          // 实际项目中需要调用微信支付退款API
          // 这里为了示例，直接返回成功
          const result = {
            code: 0,
            message: '申请退款成功',
            data: {
              out_trade_no: refundData.out_trade_no,
              out_refund_no: refundData.out_refund_no,
              refund_fee: refundData.refund_fee
            }
          }
          
          // 如果是HTTP触发器调用，返回HTTP格式的响应
          if (event.httpMethod) {
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(result)
            }
          }
          
          return result
        } catch (error) {
          console.error('申请退款失败:', error)
          const result = {
            code: 500,
            message: '申请退款失败',
            error: error.message
          }
          
          // 如果是HTTP触发器调用，返回HTTP格式的响应
          if (event.httpMethod) {
            return {
              statusCode: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(result)
            }
          }
          
          return result
        }
      
      default:
        const result = {
          code: 400,
          message: '不支持的操作类型'
        }
        
        // 如果是HTTP触发器调用，返回HTTP格式的响应
        if (event.httpMethod) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
          }
        }
        
        return result
    }
  } catch (error) {
    console.error('操作失败:', error)
    const result = {
      code: 500,
      message: '服务器错误',
      error: error.message
    }
    
    // 如果是HTTP触发器调用，返回HTTP格式的响应
    if (event.httpMethod) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      }
    }
    
    return result
  }
} 