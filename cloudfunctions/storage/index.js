// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, path, fileID, prefix } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 根据操作类型执行不同的存储操作
    switch (action) {
      case 'getUploadUrl':
        // 获取上传文件URL
        try {
          // 校验路径格式，防止非法路径
          if (!path || path.includes('..')) {
            return {
              code: 400,
              message: '无效的文件路径'
            }
          }
          
          // 添加用户标识，便于区分文件所有者
          const userPrefix = wxContext.OPENID.substring(0, 8)
          const timestamp = Date.now()
          let cloudPath = path
          
          // 如果没有指定扩展名，则使用原始路径
          if (!cloudPath.includes('.')) {
            return {
              code: 400,
              message: '文件路径必须包含扩展名'
            }
          }
          
          // 根据路径类型添加前缀
          if (!cloudPath.startsWith('admin/') && !cloudPath.startsWith('public/')) {
            cloudPath = `user/${userPrefix}/${timestamp}_${cloudPath}`
          }
          
          // 预先创建文件占位符获取fileID
          const result = await cloud.uploadFile({
            cloudPath: cloudPath,
            fileContent: Buffer.from(''), // 预占位
          })
          
          const fileID = result.fileID
          
          // 获取上传URL
          const uploadUrl = await cloud.getTempFileURL({
            fileList: [fileID]
          })
          
          return {
            code: 0,
            data: {
              url: uploadUrl.fileList[0].tempFileURL,
              fileID,
              path: cloudPath,
              token: context.token || '',
              authorization: wxContext.OPENID
            },
            message: '获取上传URL成功'
          }
        } catch (error) {
          console.error('获取上传URL失败:', error)
          return {
            code: 500,
            message: '获取上传URL失败',
            error: error.message
          }
        }
        
      case 'getDownloadUrl':
        // 获取下载文件URL
        try {
          if (!fileID) {
            return {
              code: 400,
              message: '未提供文件ID'
            }
          }
          
          const result = await cloud.getTempFileURL({
            fileList: [fileID]
          })
          
          if (result.fileList[0].status !== 0) {
            return {
              code: 404,
              message: '文件不存在',
              error: result.fileList[0].errMsg
            }
          }
          
          return {
            code: 0,
            data: {
              url: result.fileList[0].tempFileURL,
              fileID
            },
            message: '获取下载URL成功'
          }
        } catch (error) {
          console.error('获取下载URL失败:', error)
          return {
            code: 500,
            message: '获取下载URL失败',
            error: error.message
          }
        }
        
      case 'deleteFile':
        // 删除文件
        try {
          if (!fileID) {
            return {
              code: 400,
              message: '未提供文件ID'
            }
          }
          
          // 校验权限（仅管理员和文件所有者可删除）
          const isAdmin = await checkIsAdmin(wxContext.OPENID)
          const isOwner = fileID.includes(wxContext.OPENID.substring(0, 8))
          
          if (!isAdmin && !isOwner) {
            return {
              code: 403,
              message: '没有权限删除此文件'
            }
          }
          
          await cloud.deleteFile({
            fileList: [fileID]
          })
          
          return {
            code: 0,
            message: '删除文件成功'
          }
        } catch (error) {
          console.error('删除文件失败:', error)
          return {
            code: 500,
            message: '删除文件失败',
            error: error.message
          }
        }
        
      case 'batchGetDownloadUrl':
        // 批量获取下载URL
        try {
          if (!event.fileList || !Array.isArray(event.fileList) || event.fileList.length === 0) {
            return {
              code: 400,
              message: '未提供有效的文件ID列表'
            }
          }
          
          // 限制一次最多查询50个文件
          const fileList = event.fileList.slice(0, 50)
          
          const result = await cloud.getTempFileURL({
            fileList: fileList
          })
          
          return {
            code: 0,
            data: {
              fileList: result.fileList
            },
            message: '批量获取下载URL成功'
          }
        } catch (error) {
          console.error('批量获取下载URL失败:', error)
          return {
            code: 500,
            message: '批量获取下载URL失败',
            error: error.message
          }
        }
        
      case 'listFiles':
        // 列出目录下的文件
        try {
          if (!prefix) {
            return {
              code: 400,
              message: '未提供目录前缀'
            }
          }
          
          // 校验权限（查看用户目录需要权限）
          if (prefix.startsWith('user/') && !prefix.includes(wxContext.OPENID.substring(0, 8))) {
            const isAdmin = await checkIsAdmin(wxContext.OPENID)
            if (!isAdmin) {
              return {
                code: 403,
                message: '没有权限列出此目录'
              }
            }
          }
          
          // 由于微信云开发没有直接列出文件的API，这里通过数据库记录查询
          // 实际项目中可以维护一个files集合记录上传的文件信息
          return {
            code: 0,
            data: {
              files: []
            },
            message: '暂不支持列出文件'
          }
        } catch (error) {
          console.error('列出文件失败:', error)
          return {
            code: 500,
            message: '列出文件失败',
            error: error.message
          }
        }
        
      default:
        return {
          code: 400,
          message: '不支持的操作类型'
        }
    }
  } catch (error) {
    console.error('存储操作失败:', error)
    return {
      code: 500,
      message: '服务器错误',
      error: error.message
    }
  }
}

// 检查用户是否为管理员
async function checkIsAdmin(openid) {
  const db = cloud.database()
  
  // 查询角色记录
  const result = await db.collection('role').where({
    openid: db.command.in([openid]),
    role_name: db.command.in(['admin', 'super_admin'])
  }).get()
  
  return result.data.length > 0
} 