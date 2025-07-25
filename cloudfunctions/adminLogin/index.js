// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 密码加密函数
function encryptPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

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

  const { username, password } = event
  
  try {
    // 1. 查询用户信息
    const adminQuery = await db.collection('admin_user').where({
      username: username
    }).get()
    
    if (adminQuery.data.length === 0) {
      const result = {
        code: 401,
        message: '用户名或密码错误'
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
    
    const admin = adminQuery.data[0]
    
    // 2. 验证密码
    const encryptedPassword = encryptPassword(password, admin.salt || '')
    if (admin.password !== encryptedPassword) {
      const result = {
        code: 401,
        message: '用户名或密码错误'
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
    
    // 3. 检查账号状态
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
    
    // 4. 获取用户OpenID
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    
    // 5. 查询角色和权限
    const roleQuery = await db.collection('role').where({
      openid: _.in([openid])
    }).get()
    
    if (roleQuery.data.length === 0) {
      const result = {
        code: 403,
        message: '没有授权角色'
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
    
    const userRoles = roleQuery.data.map(role => role.role_name)
    const allPermissions = roleQuery.data.reduce((acc, role) => {
      return [...acc, ...(role.permissions || [])]
    }, [])
    
    // 6. 生成访问令牌
    const token = openid + '_' + Date.now() + '_' + Math.random().toString(36).substring(2)
    
    // 7. 保存令牌到token集合
    await db.collection('admin_token').add({
      data: {
        token: token,
        user_id: admin._id,
        openid: openid,
        ip: wxContext.CLIENTIP || '',
        created_at: db.serverDate(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天有效期
        status: 1
      }
    })
    
    // 8. 更新最后登录时间
    await db.collection('admin_user').doc(admin._id).update({
      data: {
        last_login_time: db.serverDate(),
        last_login_ip: wxContext.CLIENTIP || ''
      }
    })
    
    // 9. 返回登录成功信息
    const result = {
      code: 0,
      message: '登录成功',
      data: {
        token: token,
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
    console.error('登录失败:', error)
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