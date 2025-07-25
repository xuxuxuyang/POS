/**
 * 短信验证服务配置
 * 使用腾讯云短信服务
 */
const smsConfig = {
  // 短信应用 SDK AppID
  appid: 'YOUR_SMS_APPID',
  
  // 短信应用 SDK AppKey
  appkey: 'YOUR_SMS_APPKEY',
  
  // 短信签名
  smsSign: 'POS机申请平台',
  
  // 模板 ID 列表
  templateId: {
    // 验证码短信模板ID
    verify: 'SMS_VERIFY_TEMPLATE_ID',
    
    // 订单确认短信模板ID
    orderConfirm: 'SMS_ORDER_CONFIRM_TEMPLATE_ID',
    
    // 发货通知短信模板ID
    shipping: 'SMS_SHIPPING_TEMPLATE_ID',
    
    // 安装通知短信模板ID
    installation: 'SMS_INSTALLATION_TEMPLATE_ID'
  },
  
  // 验证码有效期（分钟）
  expireMinutes: 5,
  
  // 一天内同一手机号最大发送次数
  dailyLimit: 10
};

module.exports = smsConfig; 