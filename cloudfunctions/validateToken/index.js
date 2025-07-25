// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 检查是否是HTTP触发器调用
  if (event.httpMethod) {
    try {
      // 从HTTP请求体中解析参数
      const params = event.body ? JSON.parse(event.body) : {};
      // 合并参数
      event = {
        ...event,
        ...params
      };
      
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
        };
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
      };
    }
  }
  
  const { token } = event
  
  if (!token) {
    const result = {
      code: 401,
      message: '未提供认证令牌'
    };
    
    // 如果是HTTP触发器调用，返回HTTP格式的响应
    if (event.httpMethod) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      };
    }
    
    return result;
  }
  
  try {
    // 查询令牌信息
    const tokenQuery = await db.collection('admin_token').where({
      token: token,
      status: 1,
      expires_at: db.command.gt(db.serverDate())
    }).get()
    
    if (tokenQuery.data.length === 0) {
      const result = {
        code: 401,
        message: '无效或已过期的令牌'
      };
      
      // 如果是HTTP触发器调用，返回HTTP格式的响应
      if (event.httpMethod) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(result)
        };
      }
      
      return result;
    }
    
    const tokenData = tokenQuery.data[0]
    
    // 获取用户信息
    const adminQuery = await db.collection('admin_user').doc(tokenData.user_id).get()
    
    if (!adminQuery.data) {
      const result = {
        code: 404,
        message: '用户不存在'
      };
      
      // 如果是HTTP触发器调用，返回HTTP格式的响应
      if (event.httpMethod) {
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(result)
        };
      }
      
      return result;
    }
    
    const admin = adminQuery.data
    
    // 检查账号状态
    if (admin.status !== 1) {
      const result = {
        code: 403,
        message: '账号已禁用'
      };
      
      // 如果是HTTP触发器调用，返回HTTP格式的响应
      if (event.httpMethod) {
        return {
          statusCode: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(result)
        };
      }
      
      return result;
    }
    
    // 查询角色和权限
    const roleQuery = await db.collection('role').where({
      openid: db.command.in([tokenData.openid])
    }).get()
    
    const userRoles = roleQuery.data.map(role => role.role_name)
    const allPermissions = roleQuery.data.reduce((acc, role) => {
      return [...acc, ...(role.permissions || [])]
    }, [])
    
    const result = {
      code: 0,
      message: '令牌有效',
      data: {
        user: {
          _id: admin._id,
          username: admin.username,
          name: admin.name,
          avatar: admin.avatar,
          roles: userRoles
        },
        permissions: [...new Set(allPermissions)]
      }
    };
    
    // 如果是HTTP触发器调用，返回HTTP格式的响应
    if (event.httpMethod) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      };
    }
    
    return result;
    
  } catch (error) {
    console.error('验证令牌失败:', error)
    const errorResult = {
      code: 500,
      message: '服务器错误',
      error: error.message
    };
    
    // 如果是HTTP触发器调用，返回HTTP格式的响应
    if (event.httpMethod) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(errorResult)
      };
    }
    
    return errorResult;
  }
} 