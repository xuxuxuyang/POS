// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

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

  const { action, collection, query = {}, options = {}, id, data, page = 1, pageSize = 10 } = event;
  const wxContext = cloud.getWXContext();
  
  // 检查操作权限
  try {
    // 非admin集合的写操作需要检查权限
    if (['add', 'update', 'remove'].includes(action) && 
        !['admin_user', 'admin_token', 'role'].includes(collection)) {
      // 查询用户角色
      const userRoleQuery = await db.collection('role').where({
        openid: wxContext.OPENID
      }).get();
      
      // 不是管理员或超级管理员，权限不足
      if (userRoleQuery.data.length === 0) {
        const isUserOperation = (collection === 'user' && query._openid === wxContext.OPENID) || 
                               (collection === 'order' && query.user_openid === wxContext.OPENID);
        
        if (!isUserOperation) {
          const result = {
            code: 403,
            message: '权限不足'
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
      }
    }

    // 根据操作类型执行不同的数据库操作
    switch (action) {
      case 'get':
        // 查询数据
        try {
          let dbQuery = db.collection(collection);

          // 构建查询条件
          if (query && Object.keys(query).length > 0) {
            Object.keys(query).forEach(key => {
              if (key === '_id') {
                dbQuery = dbQuery.where({
                  _id: query._id
                });
              } else if (typeof query[key] === 'object' && query[key] !== null) {
                // 处理复杂查询条件，如大于、小于等
                const condition = query[key];
                Object.keys(condition).forEach(op => {
                  switch (op) {
                    case 'gt':
                      dbQuery = dbQuery.where({
                        [key]: _.gt(condition[op])
                      });
                      break;
                    case 'gte':
                      dbQuery = dbQuery.where({
                        [key]: _.gte(condition[op])
                      });
                      break;
                    case 'lt':
                      dbQuery = dbQuery.where({
                        [key]: _.lt(condition[op])
                      });
                      break;
                    case 'lte':
                      dbQuery = dbQuery.where({
                        [key]: _.lte(condition[op])
                      });
                      break;
                    case 'eq':
                      dbQuery = dbQuery.where({
                        [key]: condition[op]
                      });
                      break;
                    case 'neq':
                      dbQuery = dbQuery.where({
                        [key]: _.neq(condition[op])
                      });
                      break;
                    case 'in':
                      dbQuery = dbQuery.where({
                        [key]: _.in(condition[op])
                      });
                      break;
                  }
                });
              } else {
                dbQuery = dbQuery.where({
                  [key]: query[key]
                });
              }
            });
          }

          // 处理排序
          if (options.orderBy) {
            dbQuery = dbQuery.orderBy(options.orderBy, options.order || 'desc');
          }

          const res = await dbQuery.get();
          const result = {
            code: 0,
            data: res.data,
            message: '查询成功'
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
          const result = {
            code: 1,
            message: '查询失败',
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      case 'add':
        // 添加数据
        try {
          // 自动添加openid和时间戳
          const addData = {
            ...data,
            _openid: wxContext.OPENID,
            created_at: db.serverDate(),
            updated_at: db.serverDate()
          };
          
          const res = await db.collection(collection).add({
            data: addData
          });
          
          const result = {
            code: 0,
            data: {
              _id: res._id
            },
            message: '添加成功'
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
          const result = {
            code: 1,
            message: '添加失败',
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      case 'update':
        // 更新数据
        try {
          // 自动更新时间戳
          const updateData = {
            ...data,
            updated_at: db.serverDate()
          };
          
          const res = await db.collection(collection).doc(id).update({
            data: updateData
          });
          
          const result = {
            code: 0,
            data: {
              updated: res.stats.updated
            },
            message: '更新成功'
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
          const result = {
            code: 1,
            message: '更新失败',
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      case 'remove':
        // 删除数据
        try {
          const res = await db.collection(collection).doc(id).remove();
          
          const result = {
            code: 0,
            data: {
              removed: res.stats.removed
            },
            message: '删除成功'
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
          const result = {
            code: 1,
            message: '删除失败',
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      case 'page':
        // 分页查询
        try {
          // 构建查询条件
          let dbQuery = db.collection(collection);
          
          if (query && Object.keys(query).length > 0) {
            dbQuery = dbQuery.where(query);
          }
          
          // 获取总数
          const countResult = await dbQuery.count();
          const total = countResult.total;
          
          // 处理排序
          if (options.orderBy) {
            dbQuery = dbQuery.orderBy(options.orderBy, options.order || 'desc');
          }
          
          // 执行分页查询
          const res = await dbQuery
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .get();
          
          const result = {
            code: 0,
            data: {
              list: res.data,
              pagination: {
                total,
                current: page,
                pageSize,
                pages: Math.ceil(total / pageSize)
              }
            },
            message: '查询成功'
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
          const result = {
            code: 1,
            message: '分页查询失败',
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      default:
        const defaultResult = {
          code: 1,
          message: '不支持的操作类型'
        };
        
        // 如果是HTTP触发器调用，返回HTTP格式的响应
        if (event.httpMethod) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(defaultResult)
          };
        }
        
        return defaultResult;
    }
  } catch (error) {
    console.error('操作失败:', error);
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
}; 