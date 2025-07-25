// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 物流查询API配置
const logisticsConfig = {
  // API提供方，这里以示例API为例，实际项目中需要替换为真实API
  provider: 'EXPRESS_PROVIDER',
  
  // API密钥，需要替换为实际申请的密钥
  appKey: 'YOUR_EXPRESS_APP_KEY',
  
  // API请求地址，需要替换为实际API地址
  apiUrl: 'https://api.example.com/express/query',
  
  // 请求超时时间（毫秒）
  timeout: 5000
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

  const { expressCompany, expressNo } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 验证参数
    if (!expressCompany || !expressNo) {
      const result = {
        code: 400,
        message: '快递公司编码和快递单号不能为空'
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
    
    // 检查是否已有缓存数据
    const now = new Date()
    const cacheTime = new Date(now.getTime() - 30 * 60 * 1000) // 30分钟内的数据视为有效
    
    const cacheResult = await db.collection('logistics_cache').where({
      express_company: expressCompany,
      express_no: expressNo,
      update_time: db.command.gt(cacheTime)
    }).get()
    
    if (cacheResult.data && cacheResult.data.length > 0) {
      // 使用缓存数据
      const result = {
        code: 0,
        message: '获取物流信息成功（缓存）',
        data: cacheResult.data[0].logistics_info
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
    }
    
    // 查询第三方物流API
    // 实际项目中请使用对应物流API的查询方式
    try {
      // 发起API请求
      const response = await axios({
        method: 'get',
        url: logisticsConfig.apiUrl,
        params: {
          type: expressCompany,
          number: expressNo,
          key: logisticsConfig.appKey
        },
        timeout: logisticsConfig.timeout
      })
      
      // 模拟API返回数据（实际项目中应根据具体API返回格式处理）
      // 这里仅作示例，实际项目中需要根据具体API进行适配
      const apiResponse = response.data || {
        status: '0', // 模拟成功状态
        message: 'success',
        data: {
          status: '2', // 模拟运输中状态
          company: expressCompany,
          number: expressNo,
          list: [
            {
              time: now.toISOString(),
              context: '物流信息查询成功，包裹运输中'
            }
          ]
        }
      }
      
      // 转换为标准格式
      const logisticsInfo = {
        status: apiResponse.data.status,
        status_text: getStatusText(apiResponse.data.status),
        express_company: expressCompany,
        express_no: expressNo,
        traces: apiResponse.data.list || [],
        update_time: now
      }
      
      // 缓存物流信息
      await db.collection('logistics_cache').add({
        data: {
          express_company: expressCompany,
          express_no: expressNo,
          logistics_info: logisticsInfo,
          update_time: db.serverDate(),
          _openid: wxContext.OPENID || ''
        }
      })
      
      const result = {
        code: 0,
        message: '获取物流信息成功',
        data: logisticsInfo
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
      
    } catch (apiError) {
      console.error('查询物流API失败:', apiError)
      const result = {
        code: 500,
        message: '查询物流信息失败',
        error: apiError.message || '查询物流API出错'
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
    
  } catch (error) {
    console.error('获取物流信息失败:', error)
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

// 获取物流状态文本
function getStatusText(statusCode) {
  switch (statusCode) {
    case '0':
      return '待发货'
    case '1':
      return '已发货'
    case '2':
      return '运输中'
    case '3':
      return '已签收'
    case '4':
      return '异常'
    case '5':
      return '退回中'
    case '6':
      return '已退回'
    default:
      return '未知状态'
  }
} 
} 
} 