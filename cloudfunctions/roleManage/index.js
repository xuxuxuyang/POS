// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, roleId, openid, roleData } = event
  const wxContext = cloud.getWXContext()
  
  // 检查调用者是否为超级管理员
  const isSuper = await checkIsSuperAdmin(wxContext.OPENID)
  if (!isSuper) {
    return {
      code: 403,
      message: '只有超级管理员可以管理角色'
    }
  }
  
  try {
    switch (action) {
      case 'list':
        // 获取角色列表
        return await listRoles()
        
      case 'get':
        // 获取单个角色
        if (!roleId) {
          return {
            code: 400,
            message: '未提供角色ID'
          }
        }
        return await getRole(roleId)
        
      case 'create':
        // 创建角色
        if (!roleData) {
          return {
            code: 400,
            message: '未提供角色数据'
          }
        }
        return await createRole(roleData)
        
      case 'update':
        // 更新角色
        if (!roleId || !roleData) {
          return {
            code: 400,
            message: '未提供角色ID或角色数据'
          }
        }
        return await updateRole(roleId, roleData)
        
      case 'delete':
        // 删除角色
        if (!roleId) {
          return {
            code: 400,
            message: '未提供角色ID'
          }
        }
        return await deleteRole(roleId)
        
      case 'assignToUser':
        // 将角色分配给用户
        if (!roleId || !openid) {
          return {
            code: 400,
            message: '未提供角色ID或用户OpenID'
          }
        }
        return await assignRoleToUser(roleId, openid)
        
      case 'removeFromUser':
        // 从用户中移除角色
        if (!roleId || !openid) {
          return {
            code: 400,
            message: '未提供角色ID或用户OpenID'
          }
        }
        return await removeRoleFromUser(roleId, openid)
        
      default:
        return {
          code: 400,
          message: '不支持的操作类型'
        }
    }
  } catch (error) {
    console.error('角色管理操作失败:', error)
    return {
      code: 500,
      message: '角色管理操作失败',
      error: error.message
    }
  }
}

// 检查是否为超级管理员
async function checkIsSuperAdmin(openid) {
  const result = await db.collection('role').where({
    openid: db.command.in([openid]),
    role_name: 'super_admin'
  }).get()
  
  return result.data.length > 0
}

// 获取角色列表
async function listRoles() {
  try {
    const result = await db.collection('role').get()
    
    return {
      code: 0,
      data: result.data,
      message: '获取角色列表成功'
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return {
      code: 500,
      message: '获取角色列表失败',
      error: error.message
    }
  }
}

// 获取单个角色
async function getRole(roleId) {
  try {
    const result = await db.collection('role').doc(roleId).get()
    
    if (!result.data) {
      return {
        code: 404,
        message: '角色不存在'
      }
    }
    
    return {
      code: 0,
      data: result.data,
      message: '获取角色成功'
    }
  } catch (error) {
    console.error('获取角色失败:', error)
    return {
      code: 500,
      message: '获取角色失败',
      error: error.message
    }
  }
}

// 创建角色
async function createRole(roleData) {
  try {
    // 检查角色名称是否存在
    const existResult = await db.collection('role').where({
      role_name: roleData.role_name
    }).get()
    
    if (existResult.data.length > 0) {
      return {
        code: 400,
        message: '角色名称已存在'
      }
    }
    
    // 添加时间戳
    roleData.created_at = db.serverDate()
    roleData.updated_at = db.serverDate()
    
    const result = await db.collection('role').add({
      data: roleData
    })
    
    return {
      code: 0,
      data: {
        _id: result._id
      },
      message: '创建角色成功'
    }
  } catch (error) {
    console.error('创建角色失败:', error)
    return {
      code: 500,
      message: '创建角色失败',
      error: error.message
    }
  }
}

// 更新角色
async function updateRole(roleId, roleData) {
  try {
    // 检查角色是否存在
    const existResult = await db.collection('role').doc(roleId).get()
    
    if (!existResult.data) {
      return {
        code: 404,
        message: '角色不存在'
      }
    }
    
    // 如果更改了角色名称，检查是否与其他角色冲突
    if (roleData.role_name && roleData.role_name !== existResult.data.role_name) {
      const nameCheckResult = await db.collection('role').where({
        role_name: roleData.role_name,
        _id: _.neq(roleId)
      }).get()
      
      if (nameCheckResult.data.length > 0) {
        return {
          code: 400,
          message: '角色名称已被其他角色使用'
        }
      }
    }
    
    // 保护super_admin角色不被降级
    if (existResult.data.role_name === 'super_admin' && roleData.role_name && roleData.role_name !== 'super_admin') {
      return {
        code: 403,
        message: '不能修改超级管理员的角色名称'
      }
    }
    
    // 添加更新时间
    roleData.updated_at = db.serverDate()
    
    await db.collection('role').doc(roleId).update({
      data: roleData
    })
    
    return {
      code: 0,
      message: '更新角色成功'
    }
  } catch (error) {
    console.error('更新角色失败:', error)
    return {
      code: 500,
      message: '更新角色失败',
      error: error.message
    }
  }
}

// 删除角色
async function deleteRole(roleId) {
  try {
    // 检查角色是否存在
    const existResult = await db.collection('role').doc(roleId).get()
    
    if (!existResult.data) {
      return {
        code: 404,
        message: '角色不存在'
      }
    }
    
    // 保护super_admin角色不被删除
    if (existResult.data.role_name === 'super_admin') {
      return {
        code: 403,
        message: '不能删除超级管理员角色'
      }
    }
    
    // 检查是否有用户使用该角色
    const userResult = await db.collection('role').where({
      role_name: existResult.data.role_name
    }).count()
    
    if (userResult.total > 1) {
      return {
        code: 400,
        message: '该角色已分配给用户，请先移除相关用户的角色'
      }
    }
    
    // 删除角色
    await db.collection('role').doc(roleId).remove()
    
    return {
      code: 0,
      message: '删除角色成功'
    }
  } catch (error) {
    console.error('删除角色失败:', error)
    return {
      code: 500,
      message: '删除角色失败',
      error: error.message
    }
  }
}

// 将角色分配给用户
async function assignRoleToUser(roleId, openid) {
  try {
    // 检查角色是否存在
    const roleResult = await db.collection('role').doc(roleId).get()
    
    if (!roleResult.data) {
      return {
        code: 404,
        message: '角色不存在'
      }
    }
    
    const role = roleResult.data
    
    // 检查用户是否已拥有此角色
    const existResult = await db.collection('role').where({
      openid: db.command.in([openid]),
      role_name: role.role_name
    }).get()
    
    if (existResult.data.length > 0) {
      return {
        code: 400,
        message: '用户已拥有此角色'
      }
    }
    
    // 创建新角色记录
    const newRole = {
      role_name: role.role_name,
      role_desc: role.role_desc,
      openid: openid,
      permissions: role.permissions,
      created_at: db.serverDate(),
      updated_at: db.serverDate()
    }
    
    const result = await db.collection('role').add({
      data: newRole
    })
    
    return {
      code: 0,
      data: {
        _id: result._id
      },
      message: '角色分配成功'
    }
  } catch (error) {
    console.error('角色分配失败:', error)
    return {
      code: 500,
      message: '角色分配失败',
      error: error.message
    }
  }
}

// 从用户中移除角色
async function removeRoleFromUser(roleId, openid) {
  try {
    // 检查角色记录是否存在
    const roleResult = await db.collection('role').doc(roleId).get()
    
    if (!roleResult.data) {
      return {
        code: 404,
        message: '角色记录不存在'
      }
    }
    
    const role = roleResult.data
    
    // 检查是否为超级管理员角色
    if (role.role_name === 'super_admin') {
      // 检查是否还有其他超级管理员
      const superAdminCount = await db.collection('role').where({
        role_name: 'super_admin'
      }).count()
      
      if (superAdminCount.total <= 1) {
        return {
          code: 403,
          message: '必须保留至少一个超级管理员'
        }
      }
    }
    
    // 移除角色
    await db.collection('role').doc(roleId).remove()
    
    return {
      code: 0,
      message: '移除角色成功'
    }
  } catch (error) {
    console.error('移除角色失败:', error)
    return {
      code: 500,
      message: '移除角色失败',
      error: error.message
    }
  }
} 