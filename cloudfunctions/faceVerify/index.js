// 云函数入口文件
const cloud = require('wx-server-sdk');
const tencentcloud = require('tencentcloud-sdk-nodejs');
const crypto = require('crypto');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 腾讯云人脸核身服务配置
const faceConfig = {
  // 腾讯云账号的 APPID，需要在实际部署时替换
  appId: 'YOUR_TCLOUD_APPID',
  
  // 腾讯云 SecretId，需要在实际部署时替换
  secretId: 'YOUR_SECRETID',
  
  // 腾讯云 SecretKey，需要在实际部署时替换
  secretKey: 'YOUR_SECRETKEY',
  
  // 人脸核身的场景规则ID，需要在实际部署时替换
  ruleId: 'YOUR_RULE_ID'
};

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

  const { action, userInfo, orderNo } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    switch (action) {
      case 'getSign':
        // 获取人脸核身签名
        try {
          // 验证参数
          if (!userInfo || !userInfo.name || !userInfo.idcard) {
            const result = {
              code: 400,
              message: '用户信息不完整'
            };
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              };
            }
            
            return result;
          }
          
          // 创建订单号
          const faceOrderNo = `F${Date.now()}${Math.floor(Math.random() * 1000)}`;
          
          // 调用腾讯云API获取签名
          try {
            const FaceidClient = tencentcloud.faceid.v20180301.Client;
            const clientConfig = {
              credential: {
                secretId: faceConfig.secretId,
                secretKey: faceConfig.secretKey
              },
              region: 'ap-guangzhou',
              profile: {
                httpProfile: {
                  endpoint: 'faceid.tencentcloudapi.com'
                }
              }
            };
            
            const client = new FaceidClient(clientConfig);
            
            // 计算签名
            const params = {
              RuleId: faceConfig.ruleId,
              // 小程序中默认使用WxMiniApp渠道
              CallbackUrl: '', // 不使用回调
              RedirectUrl: '', // 不使用跳转
              AppId: faceConfig.appId,
              OrderNo: faceOrderNo,
              Name: userInfo.name,
              IdCard: userInfo.idcard
            };
            
            const signResult = await client.DetectAuth(params);
            
            // 保存核身记录
            await db.collection('face_verify').add({
              data: {
                order_no: faceOrderNo,
                user_info: {
                  name: userInfo.name,
                  idcard: userInfo.idcard
                },
                ticket: signResult.Url.substring(signResult.Url.indexOf('ticket=') + 7),
                status: 0, // 0-待验证
                created_at: db.serverDate(),
                _openid: wxContext.OPENID || ''
              }
            });
            
            const result = {
              code: 0,
              message: '获取人脸核身签名成功',
              data: {
                orderNo: faceOrderNo,
                ticket: signResult.Url.substring(signResult.Url.indexOf('ticket=') + 7),
                url: signResult.Url
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
          } catch (apiError) {
            console.error('获取人脸核身签名失败:', apiError);
            const result = {
              code: 500,
              message: '获取人脸核身签名失败',
              error: apiError.message || '调用API出错'
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
        } catch (error) {
          console.error('获取人脸核身签名失败:', error);
          const result = {
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      
      case 'queryResult':
        // 查询人脸核身结果
        try {
          if (!orderNo) {
            const result = {
              code: 400,
              message: '订单号不能为空'
            };
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              };
            }
            
            return result;
          }
          
          // 查询本地数据库中的记录
          const faceVerifyResult = await db.collection('face_verify').where({
            order_no: orderNo
          }).get();
          
          if (!faceVerifyResult.data || faceVerifyResult.data.length === 0) {
            const result = {
              code: 404,
              message: '未找到核身记录'
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
          
          const faceRecord = faceVerifyResult.data[0];
          
          // 如果本地已有结果，直接返回
          if (faceRecord.status === 1 || faceRecord.status === 2) {
            const result = {
              code: 0,
              message: '查询人脸核身结果成功',
              data: {
                orderNo: faceRecord.order_no,
                status: faceRecord.status,
                statusText: faceRecord.status === 1 ? '验证成功' : '验证失败',
                detail: faceRecord.verify_result || {}
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
          }
          
          // 否则调用腾讯云API查询结果
          try {
            const FaceidClient = tencentcloud.faceid.v20180301.Client;
            const clientConfig = {
              credential: {
                secretId: faceConfig.secretId,
                secretKey: faceConfig.secretKey
              },
              region: 'ap-guangzhou',
              profile: {
                httpProfile: {
                  endpoint: 'faceid.tencentcloudapi.com'
                }
              }
            };
            
            const client = new FaceidClient(clientConfig);
            
            // 查询核身结果
            const params = {
              RuleId: faceConfig.ruleId,
              OrderNo: orderNo
            };
            
            const queryResult = await client.GetDetectInfo(params);
            
            // 解析结果
            let status = 0;
            let verifyResult = queryResult;
            
            if (queryResult && queryResult.DetectInfo) {
              const detectInfo = JSON.parse(queryResult.DetectInfo);
              if (detectInfo.IsNeedCharge) {
                if (detectInfo.IsPass) {
                  status = 1; // 验证成功
                } else {
                  status = 2; // 验证失败
                }
                verifyResult = detectInfo;
              }
            }
            
            // 更新数据库记录
            if (status !== 0) {
              await db.collection('face_verify').doc(faceRecord._id).update({
                data: {
                  status,
                  verify_result: verifyResult,
                  updated_at: db.serverDate()
                }
              });
            }
            
            const result = {
              code: 0,
              message: '查询人脸核身结果成功',
              data: {
                orderNo,
                status,
                statusText: status === 1 ? '验证成功' : (status === 2 ? '验证失败' : '处理中'),
                detail: verifyResult
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
          } catch (apiError) {
            console.error('查询人脸核身结果失败:', apiError);
            const result = {
              code: 500,
              message: '查询人脸核身结果失败',
              error: apiError.message || '调用API出错'
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
        } catch (error) {
          console.error('查询人脸核身结果失败:', error);
          const result = {
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      
      case 'reportResult':
        // 上报核身结果
        try {
          const { orderNo, verifyResult, success } = event;
          
          if (!orderNo) {
            const result = {
              code: 400,
              message: '订单号不能为空'
            };
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              };
            }
            
            return result;
          }
          
          // 查询本地数据库中的记录
          const faceVerifyResult = await db.collection('face_verify').where({
            order_no: orderNo
          }).get();
          
          if (!faceVerifyResult.data || faceVerifyResult.data.length === 0) {
            const result = {
              code: 404,
              message: '未找到核身记录'
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
          
          // 更新数据库记录
          await db.collection('face_verify').doc(faceVerifyResult.data[0]._id).update({
            data: {
              status: success ? 1 : 2, // 1-成功，2-失败
              verify_result: verifyResult || {},
              updated_at: db.serverDate()
            }
          });
          
          const result = {
            code: 0,
            message: '上报人脸核身结果成功'
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
          console.error('上报人脸核身结果失败:', error);
          const result = {
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
              body: JSON.stringify(result)
            };
          }
          
          return result;
        }
      
      default:
        const result = {
          code: 400,
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
            body: JSON.stringify(result)
          };
        }
        
        return result;
    }
  } catch (error) {
    console.error('操作失败:', error);
    const result = {
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
        body: JSON.stringify(result)
      };
    }
    
    return result;
  }
}; 