/**
 * 微信支付工具类
 * 用于调用微信支付接口
 */
const config = require('../config/index');

const PaymentService = {
  /**
   * 创建支付订单
   * @param {Object} orderData 订单数据
   * @param {String} orderData.out_trade_no 商户订单号
   * @param {Number} orderData.total_fee 订单金额（分）
   * @param {String} orderData.body 商品描述
   * @param {String} orderData.deposit_type 押金类型
   * @param {Function} callback 回调函数
   */
  createPayment(orderData, callback) {
    if (!orderData || !orderData.out_trade_no || !orderData.total_fee) {
      callback && callback(false, '订单参数不完整');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        action: 'create',
        orderData: {
          out_trade_no: orderData.out_trade_no,
          body: orderData.body || 'POS机押金',
          total_fee: orderData.total_fee,
          deposit_type: orderData.deposit_type || config.payment.depositType.POS_DEPOSIT
        }
      },
      success: res => {
        console.log('创建支付订单成功', res);
        if (res.result && res.result.code === 0 && res.result.data) {
          this.processPay(res.result.data, callback);
        } else {
          callback && callback(false, res.result.message || '创建支付订单失败');
        }
      },
      fail: err => {
        console.error('创建支付订单失败', err);
        callback && callback(false, err.message || '创建支付订单失败');
      }
    });
  },
  
  /**
   * 处理支付过程
   * @param {Object} payParams 支付参数
   * @param {Function} callback 回调函数
   */
  processPay(payParams, callback) {
    wx.requestPayment({
      ...payParams,
      success: res => {
        console.log('支付成功', res);
        callback && callback(true, { message: '支付成功' });
      },
      fail: err => {
        console.error('支付失败', err);
        if (err.errMsg.indexOf('cancel') > -1) {
          callback && callback(false, { message: '用户取消支付', cancel: true });
        } else {
          callback && callback(false, { message: '支付失败', err });
        }
      }
    });
  },
  
  /**
   * 查询支付结果
   * @param {String} outTradeNo 商户订单号
   * @param {Function} callback 回调函数
   */
  queryPayment(outTradeNo, callback) {
    if (!outTradeNo) {
      callback && callback(false, '订单号不能为空');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        action: 'query',
        outTradeNo
      },
      success: res => {
        console.log('查询支付结果成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '查询支付结果失败');
        }
      },
      fail: err => {
        console.error('查询支付结果失败', err);
        callback && callback(false, err.message || '查询支付结果失败');
      }
    });
  },
  
  /**
   * 申请退款
   * @param {String} outTradeNo 商户订单号
   * @param {String} outRefundNo 退款单号
   * @param {Number} totalFee 订单总金额（分）
   * @param {Number} refundFee 退款金额（分）
   * @param {Function} callback 回调函数
   */
  refund(outTradeNo, outRefundNo, totalFee, refundFee, callback) {
    if (!outTradeNo || !outRefundNo || !totalFee || !refundFee) {
      callback && callback(false, '退款参数不完整');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        action: 'refund',
        refundData: {
          out_trade_no: outTradeNo,
          out_refund_no: outRefundNo,
          total_fee: totalFee,
          refund_fee: refundFee
        }
      },
      success: res => {
        console.log('申请退款成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '申请退款失败');
        }
      },
      fail: err => {
        console.error('申请退款失败', err);
        callback && callback(false, err.message || '申请退款失败');
      }
    });
  }
};

module.exports = PaymentService; 