/**
 * 物流查询工具类
 */
const config = require('../config/index');

const LogisticsService = {
  /**
   * 获取物流信息
   * @param {String} expressCompany 快递公司代码
   * @param {String} expressNo 快递单号
   * @param {Function} callback 回调函数
   */
  getLogisticsInfo(expressCompany, expressNo, callback) {
    if (!expressCompany || !expressNo) {
      callback && callback(false, '物流信息不完整');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'getLogistics',
      data: {
        expressCompany,
        expressNo
      },
      success: res => {
        console.log('获取物流信息成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '获取物流信息失败');
        }
      },
      fail: err => {
        console.error('获取物流信息失败', err);
        callback && callback(false, err.message || '获取物流信息失败');
      }
    });
  },
  
  /**
   * 获取快递公司列表
   * @returns {Array} 快递公司列表
   */
  getExpressCompanies() {
    return config.logistics.companies || [];
  },
  
  /**
   * 通过代码获取快递公司名称
   * @param {String} code 快递公司代码
   * @returns {String} 快递公司名称
   */
  getCompanyNameByCode(code) {
    if (!code) return '';
    
    const companies = this.getExpressCompanies();
    const company = companies.find(item => item.code === code);
    return company ? company.name : '';
  },
  
  /**
   * 获取物流状态文本描述
   * @param {String} statusCode 状态代码
   * @returns {String} 状态文本
   */
  getStatusText(statusCode) {
    switch (statusCode) {
      case config.logistics.statusCode.PENDING:
        return '待发货';
      case config.logistics.statusCode.SHIPPED:
        return '已发货';
      case config.logistics.statusCode.IN_TRANSIT:
        return '运输中';
      case config.logistics.statusCode.DELIVERED:
        return '已签收';
      case config.logistics.statusCode.EXCEPTION:
        return '异常';
      case config.logistics.statusCode.RETURNING:
        return '退回中';
      case config.logistics.statusCode.RETURNED:
        return '已退回';
      default:
        return '未知状态';
    }
  },
  
  /**
   * 绑定物流信息到订单
   * @param {String} orderId 订单ID
   * @param {Object} logisticsInfo 物流信息
   * @param {String} logisticsInfo.expressCompany 快递公司代码
   * @param {String} logisticsInfo.expressNo 快递单号
   * @param {Function} callback 回调函数
   */
  bindLogisticsToOrder(orderId, logisticsInfo, callback) {
    if (!orderId || !logisticsInfo || !logisticsInfo.expressCompany || !logisticsInfo.expressNo) {
      callback && callback(false, '参数不完整');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'database',
      data: {
        action: 'update',
        collection: 'order',
        id: orderId,
        data: {
          logistics_info: {
            express_company: logisticsInfo.expressCompany,
            express_no: logisticsInfo.expressNo,
            status: config.logistics.statusCode.SHIPPED,
            update_time: new Date()
          },
          order_status: 3 // 已发货
        }
      },
      success: res => {
        console.log('绑定物流信息成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, {
            message: '绑定物流信息成功'
          });
        } else {
          callback && callback(false, res.result.message || '绑定物流信息失败');
        }
      },
      fail: err => {
        console.error('绑定物流信息失败', err);
        callback && callback(false, err.message || '绑定物流信息失败');
      }
    });
  }
};

module.exports = LogisticsService; 