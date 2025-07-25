// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-9grox8bwd6dbce0c'
})

const db = cloud.database()
const _ = db.command

// 定义管理员账号（生产环境应存储在数据库中）
const adminAccounts = [
  {
    username: 'admin',
    password: '123456', // 实际应用中应使用加密存储
    role: 'admin',
    permissions: ['*'] // 所有权限
  },
  {
    username: 'operator',
    password: 'operator123',
    role: 'operator',
    permissions: ['order:view', 'order:edit', 'customer:view']
  }
]

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  
  // 获取openid
  const { OPENID } = cloud.getWXContext()
  
  switch (action) {
    case 'login':
      return login(data)
    case 'getUserInfo':
      return getUserInfo(OPENID)
    case 'logout':
      return logout(OPENID)
    default:
      return {
        code: 1,
        message: '未知的操作类型'
      }
  }
}

/**
 * 登录处理
 * @param {Object} data 登录数据
 */
async function login(data) {
  const { username, password } = data
  
  if (!username || !password) {
    return {
      code: 1,
      message: '用户名和密码不能为空'
    }
  }
  
  // 查找管理员账号
  const admin = adminAccounts.find(account => 
    account.username === username && account.password === password)
  
  if (!admin) {
    return {
      code: 1,
      message: '用户名或密码错误'
    }
  }
  
  // 生成token（实际应用中应该使用更安全的方式）
  const token = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2)
  
  // 保存登录状态（实际应用中应该保存到数据库）
  // 这里简化处理，实际应存储到数据库中
  
  return {
    code: 0,
    message: '登录成功',
    data: {
      token,
      userInfo: {
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions
      }
    }
  }
}

/**
 * 获取用户信息
 * @param {String} openid 用户openid
 */
async function getUserInfo(openid) {
  // 实际应用中，应该根据token从数据库中获取用户信息
  // 这里简化处理，返回默认管理员信息
  
  return {
    code: 0,
    message: '获取成功',
    data: {
      username: 'admin',
      role: 'admin',
      permissions: ['*']
    }
  }
}

/**
 * 退出登录
 * @param {String} openid 用户openid
 */
async function logout(openid) {
  // 实际应用中，应该清除数据库中的登录状态
  
  return {
    code: 0,
    message: '退出登录成功'
  }
} 