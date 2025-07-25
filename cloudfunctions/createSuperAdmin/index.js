// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { username, password, name, secret_key } = event
  const wxContext = cloud.getWXContext()
  
  // 验证密钥（此处仅为示例，实际应用中应该使用更安全的机制）
  const expected_key = 'wx_pos_super_admin_key_2023'
  if (secret_key !== expected_key) {
    return {
      code: 403,
      message: '无效的密钥'
    }
  }
  
  try {
    // 检查是否已存在超级管理员
    const superAdminCheck = await db.collection('role').where({
      role_name: 'super_admin'
    }).count()
    
    if (superAdminCheck.total > 0) {
      return {
        code: 400,
        message: '已存在超级管理员，请使用正常的管理员创建流程'
      }
    }
    
    // 检查用户名是否已存在
    const usernameCheck = await db.collection('admin_user').where({
      username
    }).count()
    
    if (usernameCheck.total > 0) {
      return {
        code: 400,
        message: '用户名已存在'
      }
    }
    
    // 生成盐值和加密密码
    const salt = crypto.randomBytes(16).toString('hex')
    const encryptedPassword = crypto.createHash('sha256').update(password + salt).digest('hex')
    
    // 创建管理员记录
    const adminResult = await db.collection('admin_user').add({
      data: {
        username,
        password: encryptedPassword,
        salt,
        name: name || '超级管理员',
        avatar: '',
        status: 1, // 1-正常
        _openid: wxContext.OPENID,
        created_at: db.serverDate(),
        updated_at: db.serverDate()
      }
    })
    
    // 创建角色记录
    const roleResult = await db.collection('role').add({
      data: {
        role_name: 'super_admin',
        role_desc: '超级管理员',
        openid: wxContext.OPENID,
        permissions: ['all'], // 所有权限
        _openid: wxContext.OPENID,
        created_at: db.serverDate(),
        updated_at: db.serverDate()
      }
    })
    
    return {
      code: 0,
      data: {
        admin_id: adminResult._id,
        role_id: roleResult._id,
        openid: wxContext.OPENID
      },
      message: '超级管理员创建成功'
    }
    
  } catch (error) {
    console.error('创建超级管理员失败:', error)
    return {
      code: 500,
      message: '创建超级管理员失败',
      error: error.message
    }
  }
} 