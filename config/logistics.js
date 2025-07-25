/**
 * 物流查询API配置
 * 使用第三方快递查询服务
 */
const logisticsConfig = {
  // 接口提供方
  provider: 'EXPRESS_PROVIDER',
  
  // API密钥
  appKey: 'YOUR_EXPRESS_APP_KEY',
  
  // API请求地址
  apiUrl: 'https://api.example.com/express/query',
  
  // 请求超时时间（毫秒）
  timeout: 5000,
  
  // 支持的快递公司列表
  companies: [
    { code: 'SF', name: '顺丰速运' },
    { code: 'ZTO', name: '中通快递' },
    { code: 'YTO', name: '圆通速递' },
    { code: 'YD', name: '韵达速递' },
    { code: 'HTKY', name: '百世快递' },
    { code: 'JD', name: '京东物流' },
    { code: 'EMS', name: 'EMS' },
    { code: 'STO', name: '申通快递' },
    { code: 'YZPY', name: '邮政快递包裹' },
    { code: 'HHTT', name: '天天快递' }
  ],
  
  // 物流状态码
  statusCode: {
    PENDING: '0', // 待发货
    SHIPPED: '1', // 已发货
    IN_TRANSIT: '2', // 运输中
    DELIVERED: '3', // 已签收
    EXCEPTION: '4', // 异常
    RETURNING: '5', // 退回中
    RETURNED: '6' // 已退回
  },
  
  // 自动刷新间隔（毫秒），为0表示不自动刷新
  autoRefreshInterval: 0
};

module.exports = logisticsConfig; 