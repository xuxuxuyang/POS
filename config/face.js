/**
 * 腾讯云人脸核身配置
 */
const faceConfig = {
  // 腾讯云账号的 APPID
  appId: 'YOUR_TCLOUD_APPID',
  
  // 腾讯云 SecretId
  secretId: 'YOUR_SECRETID',
  
  // 腾讯云 SecretKey
  secretKey: 'YOUR_SECRETKEY',
  
  // 人脸核身的场景
  ruleId: 'YOUR_RULE_ID', 
  
  // 验证方式
  verifyMethod: {
    // 活体检测+身份证人脸比对
    IDCARD_FACE: '0',
    // 活体检测
    LIVE_DETECTION: '1'
  },
  
  // 比对通过的阈值，建议值为80
  compareThreshold: 80,
  
  // 照片和身份证比对
  photoCompare: {
    enabled: true,
    threshold: 80 // 建议阈值
  },
  
  // 回调配置
  callback: {
    // 验证完成后的回调页面路径
    successPage: '/pages/verification/result',
    // 验证失败的回调页面路径
    failPage: '/pages/verification/fail'
  }
};

module.exports = faceConfig; 