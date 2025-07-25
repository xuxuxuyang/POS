/**
 * 小程序全局配置
 */

export default {
  // 应用名称
  appName: 'POS机在线申请平台',
  
  // 应用版本
  version: '1.0.0',
  
  // 开发环境标识：development-开发环境，production-生产环境
  env: 'development',
  
  // 云环境配置
  cloud: {
    ENV_ID: 'cloud1-9grox8bwd6dbce0c', // 云环境ID
    REGION: 'ap-shanghai'              // 云环境地区
  },
  
  // 微信支付配置
  payment: {
    enabled: true,
    // 其他支付相关配置
  },
  
  // 短信服务配置
  sms: {
    enabled: false,
    // 短信服务配置
  },
  
  // 人脸核身配置
  face: {
    enabled: false,
    // 人脸核身配置
  },
  
  // 物流查询配置
  logistics: {
    enabled: false,
    // 物流查询配置
  },
  
  // 地图服务配置
  map: {
    enabled: false,
    // 地图服务配置
  },
  
  // 默认分页大小
  pageSize: 10,
  
  // 全局请求超时时间（毫秒）
  requestTimeout: 10000,
  
  // 缓存设置
  cache: {
    // 用户信息缓存有效期（毫秒）
    userInfo: 7 * 24 * 60 * 60 * 1000, // 7天
    
    // 产品列表缓存有效期（毫秒）
    productList: 30 * 60 * 1000, // 30分钟
    
    // 通用数据缓存有效期（毫秒）
    common: 60 * 60 * 1000 // 1小时
  },
  
  // 用户相关配置
  user: {
    defaultAvatar: '/static/images/default-avatar.png'
  },
  
  // API配置
  api: {
    baseUrl: ''  // 如果有外部API可以在这里配置
  },
  
  // 调试模式
  debug: true
} 