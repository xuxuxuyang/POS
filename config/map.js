/**
 * 地图定位服务配置
 * 使用腾讯地图小程序SDK
 */
const mapConfig = {
  // 腾讯位置服务开发者密钥，需要在腾讯位置服务官网申请
  key: 'YOUR_MAP_KEY',
  
  // 地图类型
  mapType: {
    NORMAL: '0', // 普通地图
    SATELLITE: '1' // 卫星图
  },
  
  // 默认缩放级别 (3-20)
  defaultScale: 14,
  
  // 定位精度
  accuracy: {
    HIGH: 'high', // 高精度
    MEDIUM: 'medium', // 中等精度
    LOW: 'low' // 低精度
  },
  
  // 默认使用的精度
  defaultAccuracy: 'medium',
  
  // 默认地图中心点（当定位失败时使用）
  defaultCenter: {
    latitude: 39.908823,
    longitude: 116.397470
  },
  
  // 地址解析和逆地址解析配置
  geocoder: {
    // API请求地址
    apiUrl: 'https://apis.map.qq.com/ws/geocoder/v1/',
    // 请求超时时间（毫秒）
    timeout: 5000
  },
  
  // 路线规划配置
  direction: {
    // API请求地址
    apiUrl: 'https://apis.map.qq.com/ws/direction/v1/',
    // 请求超时时间（毫秒）
    timeout: 8000
  },
  
  // 距离计算配置
  distance: {
    // 是否使用实时路况
    useTraffic: true,
    // 驾车策略：0-最少时间，1-最短距离，2-避开高速
    policy: 0
  }
};

module.exports = mapConfig; 