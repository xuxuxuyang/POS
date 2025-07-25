// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 腾讯位置服务API配置
const mapConfig = {
  // 腾讯位置服务开发者密钥，需要在实际部署时替换
  key: 'YOUR_MAP_KEY',
  
  // API基础URL
  baseUrl: 'https://apis.map.qq.com'
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

  const { action, address, location, from, to } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    switch (action) {
      case 'geocoder':
        // 地址解析（地址转坐标）
        try {
          if (!address) {
            const result = {
              code: 400,
              message: '地址不能为空'
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
          
          // 调用腾讯地图API进行地址解析
          const geocodeResult = await axios.get(`${mapConfig.baseUrl}/ws/geocoder/v1/`, {
            params: {
              address,
              key: mapConfig.key
            }
          });
          
          // 处理API返回结果
          if (geocodeResult.data && geocodeResult.data.status === 0 && geocodeResult.data.result) {
            const result = {
              code: 0,
              message: '地址解析成功',
              data: {
                title: geocodeResult.data.result.title || address,
                location: geocodeResult.data.result.location,
                address_components: geocodeResult.data.result.address_components,
                formatted_address: geocodeResult.data.result.address
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
              code: geocodeResult.data.status || 500,
              message: geocodeResult.data.message || '地址解析失败'
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
          console.error('地址解析失败:', error);
          const result = {
            code: 500,
            message: '地址解析失败',
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
      
      case 'reverseGeocoder':
        // 逆地址解析（坐标转地址）
        try {
          if (!location || !location.latitude || !location.longitude) {
            const result = {
              code: 400,
              message: '坐标不能为空'
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
          
          // 调用腾讯地图API进行逆地址解析
          const reverseGeocodeResult = await axios.get(`${mapConfig.baseUrl}/ws/geocoder/v1/`, {
            params: {
              location: `${location.latitude},${location.longitude}`,
              get_poi: 1,
              key: mapConfig.key
            }
          });
          
          // 处理API返回结果
          if (reverseGeocodeResult.data && reverseGeocodeResult.data.status === 0 && reverseGeocodeResult.data.result) {
            const result = {
              code: 0,
              message: '逆地址解析成功',
              data: {
                address: reverseGeocodeResult.data.result.address,
                formatted_address: reverseGeocodeResult.data.result.formatted_addresses?.recommend || reverseGeocodeResult.data.result.address,
                address_component: reverseGeocodeResult.data.result.address_component,
                pois: reverseGeocodeResult.data.result.pois || []
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
              code: reverseGeocodeResult.data.status || 500,
              message: reverseGeocodeResult.data.message || '逆地址解析失败'
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
          console.error('逆地址解析失败:', error);
          const result = {
            code: 500,
            message: '逆地址解析失败',
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
      
      case 'calculateDistance':
        // 计算距离和行车时间
        try {
          if (!from || !from.latitude || !from.longitude || !to || !to.latitude || !to.longitude) {
            const result = {
              code: 400,
              message: '起点和终点坐标不能为空'
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
          
          // 调用腾讯地图API计算路线距离和时间
          const distanceResult = await axios.get(`${mapConfig.baseUrl}/ws/direction/v1/driving/`, {
            params: {
              from: `${from.latitude},${from.longitude}`,
              to: `${to.latitude},${to.longitude}`,
              key: mapConfig.key
            }
          });
          
          // 处理API返回结果
          if (distanceResult.data && distanceResult.data.status === 0 && distanceResult.data.result) {
            const result = {
              code: 0,
              message: '计算距离成功',
              data: {
                distance: distanceResult.data.result.routes[0].distance, // 单位：米
                duration: distanceResult.data.result.routes[0].duration, // 单位：秒
                taxi_fee: distanceResult.data.result.routes[0].taxi_fee || 0, // 单位：元
                toll: distanceResult.data.result.routes[0].toll || 0, // 单位：元
                routes: distanceResult.data.result.routes
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
              code: distanceResult.data.status || 500,
              message: distanceResult.data.message || '计算距离失败'
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
          console.error('计算距离失败:', error);
          const result = {
            code: 500,
            message: '计算距离失败',
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