// 云函数入口文件
const cloud = require('wx-server-sdk');
const tencentcloud = require('tencentcloud-sdk-nodejs');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 腾讯云短信服务配置
const smsConfig = {
  // 短信应用 SDK AppID，需要替换为实际的AppID
  appid: 'YOUR_SMS_APPID',
  
  // 短信应用 SDK AppKey，需要替换为实际的AppKey
  appkey: 'YOUR_SMS_APPKEY',
  
  // 短信签名
  smsSign: 'POS机申请平台',
  
  // 短信模板ID
  templateId: {
    verify: 'VERIFY_TEMPLATE_ID', // 验证码短信模板ID
    orderConfirm: 'ORDER_CONFIRM_TEMPLATE_ID', // 订单确认短信模板ID
    shipping: 'SHIPPING_TEMPLATE_ID', // 发货通知短信模板ID
    installation: 'INSTALLATION_TEMPLATE_ID' // 安装通知短信模板ID
  },
  
  // 验证码有效期（分钟）
  expireMinutes: 5,
  
  // 一天内同一手机号最大发送次数
  dailyLimit: 10
};

// 验证码字符集
const VERIFY_CODE_CHARS = '0123456789';

// 生成指定长度的随机验证码
function generateVerifyCode(length = 6) {
  let result = '';
  const charLength = VERIFY_CODE_CHARS.length;
  
  for (let i = 0; i < length; i++) {
    result += VERIFY_CODE_CHARS.charAt(Math.floor(Math.random() * charLength));
  }
  
  return result;
}

// 发送短信
async function sendTencentCloudSms(phoneNumber, templateId, params) {
  try {
    // 实例化短信client
    const SmsClient = tencentcloud.sms.v20210111.Client;
    const clientConfig = {
      credential: {
        secretId: process.env.TENCENTCLOUD_SECRETID || 'YOUR_SECRET_ID',
        secretKey: process.env.TENCENTCLOUD_SECRETKEY || 'YOUR_SECRET_KEY',
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'sms.tencentcloudapi.com',
        },
      },
    };
    
    const client = new SmsClient(clientConfig);
    
    // 发送短信参数
    const sendParams = {
      PhoneNumberSet: [`+86${phoneNumber}`],
      SmsSdkAppId: smsConfig.appid,
      SignName: smsConfig.smsSign,
      TemplateId: templateId,
      TemplateParamSet: params
    };
    
    // 发送短信
    const result = await client.SendSms(sendParams);
    
    if (result && result.SendStatusSet && result.SendStatusSet[0] && result.SendStatusSet[0].Code === 'Ok') {
      return {
        success: true,
        message: '短信发送成功'
      };
    } else {
      const error = result && result.SendStatusSet && result.SendStatusSet[0] ? result.SendStatusSet[0].Message : '短信发送失败';
      return {
        success: false,
        message: error
      };
    }
  } catch (error) {
    console.error('发送短信失败:', error);
    return {
      success: false,
      message: error.message || '发送短信失败'
    };
  }
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

  const { action, phoneNumber, templateId, code, params } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    switch (action) {
      case 'sendVerifyCode':
        // 发送验证码短信
        try {
          // 验证手机号格式
          if (!phoneNumber || !/^1[3456789]\d{9}$/.test(phoneNumber)) {
            const result = {
              code: 400,
              message: '手机号格式不正确'
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
          
          // 检查发送次数限制
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const countResult = await db.collection('sms_record').where({
            phone_number: phoneNumber,
            type: 'verify',
            created_at: db.command.gte(today)
          }).count();
          
          if (countResult.total >= smsConfig.dailyLimit) {
            const result = {
              code: 429,
              message: `当日验证码发送次数已达上限(${smsConfig.dailyLimit}次)`
            };
            
            // 如果是HTTP触发器调用，返回HTTP格式的响应
            if (event.httpMethod) {
              return {
                statusCode: 429,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
              };
            }
            
            return result;
          }
          
          // 生成验证码
          const verifyCode = generateVerifyCode(6);
          
          // 计算过期时间
          const expireTime = new Date();
          expireTime.setMinutes(expireTime.getMinutes() + smsConfig.expireMinutes);
          
          // 保存验证码记录
          await db.collection('sms_verify_code').add({
            data: {
              phone_number: phoneNumber,
              code: verifyCode,
              created_at: db.serverDate(),
              expire_at: expireTime,
              used: false
            }
          });
          
          // 发送短信
          const smsResult = await sendTencentCloudSms(
            phoneNumber,
            templateId || smsConfig.templateId.verify,
            [verifyCode, `${smsConfig.expireMinutes}`]
          );
          
          // 记录发送日志
          await db.collection('sms_record').add({
            data: {
              phone_number: phoneNumber,
              type: 'verify',
              template_id: templateId || smsConfig.templateId.verify,
              success: smsResult.success,
              message: smsResult.message,
              created_at: db.serverDate(),
              _openid: wxContext.OPENID || ''
            }
          });
          
          if (smsResult.success) {
            const result = {
              code: 0,
              message: '验证码发送成功',
              data: {
                expire_minutes: smsConfig.expireMinutes
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
          } else {
            const result = {
              code: 500,
              message: '验证码发送失败',
              error: smsResult.message
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
          console.error('发送验证码失败:', error);
          const result = {
            code: 500,
            message: '发送验证码失败',
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
      
      case 'verifyCode':
        // 验证短信验证码
        try {
          // 验证手机号和验证码格式
          if (!phoneNumber || !/^1[3456789]\d{9}$/.test(phoneNumber) || !code || code.length !== 6) {
            const result = {
              code: 400,
              message: '手机号或验证码格式不正确'
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
          
          // 查询验证码记录
          const now = new Date();
          const codeResult = await db.collection('sms_verify_code').where({
            phone_number: phoneNumber,
            code: code,
            expire_at: db.command.gt(now),
            used: false
          }).get();
          
          if (!codeResult.data || codeResult.data.length === 0) {
            const result = {
              code: 400,
              message: '验证码错误或已过期'
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
          
          // 标记验证码为已使用
          await db.collection('sms_verify_code').doc(codeResult.data[0]._id).update({
            data: {
              used: true
            }
          });
          
          const result = {
            code: 0,
            message: '验证成功'
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
          console.error('验证码验证失败:', error);
          const result = {
            code: 500,
            message: '验证码验证失败',
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
      
      case 'sendOrderConfirm':
        // 发送订单确认短信
        try {
          // 验证手机号格式和参数
          if (!phoneNumber || !/^1[3456789]\d{9}$/.test(phoneNumber) || !params || !params.orderNo) {
            const result = {
              code: 400,
              message: '参数不完整'
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
          
          // 发送短信
          const smsResult = await sendTencentCloudSms(
            phoneNumber,
            templateId || smsConfig.templateId.orderConfirm,
            [params.orderNo, params.productName || 'POS机', params.amount || '']
          );
          
          // 记录发送日志
          await db.collection('sms_record').add({
            data: {
              phone_number: phoneNumber,
              type: 'orderConfirm',
              template_id: templateId || smsConfig.templateId.orderConfirm,
              success: smsResult.success,
              message: smsResult.message,
              created_at: db.serverDate(),
              _openid: wxContext.OPENID || ''
            }
          });
          
          if (smsResult.success) {
            const result = {
              code: 0,
              message: '订单确认短信发送成功'
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
          } else {
            const result = {
              code: 500,
              message: '订单确认短信发送失败',
              error: smsResult.message
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
          console.error('发送订单确认短信失败:', error);
          const result = {
            code: 500,
            message: '发送订单确认短信失败',
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
      
      case 'sendShippingNotice':
        // 发送发货通知短信
        try {
          // 验证手机号格式和参数
          if (!phoneNumber || !/^1[3456789]\d{9}$/.test(phoneNumber) || !params || !params.orderNo || !params.expressCompany || !params.trackingNo) {
            const result = {
              code: 400,
              message: '参数不完整'
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
          
          // 发送短信
          const smsResult = await sendTencentCloudSms(
            phoneNumber,
            templateId || smsConfig.templateId.shipping,
            [params.orderNo, params.expressCompany, params.trackingNo]
          );
          
          // 记录发送日志
          await db.collection('sms_record').add({
            data: {
              phone_number: phoneNumber,
              type: 'shipping',
              template_id: templateId || smsConfig.templateId.shipping,
              success: smsResult.success,
              message: smsResult.message,
              created_at: db.serverDate(),
              _openid: wxContext.OPENID || ''
            }
          });
          
          if (smsResult.success) {
            const result = {
              code: 0,
              message: '发货通知短信发送成功'
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
          } else {
            const result = {
              code: 500,
              message: '发货通知短信发送失败',
              error: smsResult.message
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
          console.error('发送发货通知短信失败:', error);
          const result = {
            code: 500,
            message: '发送发货通知短信失败',
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