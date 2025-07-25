// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  if (!wxContext.OPENID) {
    return {
      code: 401,
      message: '获取用户信息失败'
    }
  }
  
  try {
    // 获取用户信息
    const userResult = await db.collection('user').where({
      _openid: wxContext.OPENID
    }).get()
    
    // 用户存在，返回用户信息
    if (userResult.data && userResult.data.length > 0) {
      const user = userResult.data[0]
      return {
        code: 0,
        data: {
          user,
          openid: wxContext.OPENID
        },
        message: '登录成功'
      }
    }
    
    // 用户不存在，创建新用户
    return {
      code: 0,
      data: {
        user: null,
        openid: wxContext.OPENID,
        isNew: true
      },
      message: '用户未注册'
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      code: 500,
      message: '登录失败',
      error: error.message
    }
  }
} 