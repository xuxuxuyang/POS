/**
 * 微信支付配置
 */
const paymentConfig = {
  // 微信支付商户号，需要在微信支付商户平台申请
  mchId: 'YOUR_MCH_ID', 
  
  // 微信支付API密钥，用于签名验证
  apiKey: 'YOUR_API_KEY',
  
  // 回调通知地址，用于接收支付结果
  notifyUrl: 'YOUR_NOTIFY_URL',
  
  // 微信支付交易类型
  tradeType: 'JSAPI',
  
  // 支付超时时间（分钟）
  timeExpire: 30,
  
  // 支付场景描述
  sceneInfo: {
    // 支付场景
    payer_client_ip: 'CLIENT_IP',
    
    // 商户门店信息
    store_info: {
      id: 'STORE_ID',
      name: 'POS机申请平台',
      area_code: 'AREA_CODE',
      address: 'STORE_ADDRESS'
    }
  },
  
  // 押金类型
  depositType: {
    POS_DEPOSIT: '1' // POS机押金
  }
};

module.exports = paymentConfig; 