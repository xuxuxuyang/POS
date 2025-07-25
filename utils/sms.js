/**
 * 短信验证工具类
 */
const config = require('../config/index');

const SmsService = {
  /**
   * 发送验证码短信
   * @param {String} phoneNumber 手机号
   * @param {Function} callback 回调函数
   */
  sendVerifyCode(phoneNumber, callback) {
    if (!this._validatePhone(phoneNumber)) {
      callback && callback(false, '手机号码格式不正确');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'sendSms',
      data: {
        action: 'sendVerifyCode',
        phoneNumber,
        templateId: config.sms.templateId.verify
      },
      success: res => {
        console.log('发送验证码成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, {
            message: '验证码已发送',
            expireMinutes: config.sms.expireMinutes
          });
        } else {
          callback && callback(false, res.result.message || '验证码发送失败');
        }
      },
      fail: err => {
        console.error('发送验证码失败', err);
        callback && callback(false, err.message || '验证码发送失败');
      }
    });
  },
  
  /**
   * 验证短信验证码
   * @param {String} phoneNumber 手机号
   * @param {String} code 验证码
   * @param {Function} callback 回调函数
   */
  verifyCode(phoneNumber, code, callback) {
    if (!this._validatePhone(phoneNumber)) {
      callback && callback(false, '手机号码格式不正确');
      return;
    }
    
    if (!code || code.length !== 6) {
      callback && callback(false, '验证码格式不正确');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'sendSms',
      data: {
        action: 'verifyCode',
        phoneNumber,
        code
      },
      success: res => {
        console.log('验证码验证结果', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, {
            message: '验证成功'
          });
        } else {
          callback && callback(false, res.result.message || '验证码错误或已过期');
        }
      },
      fail: err => {
        console.error('验证码验证失败', err);
        callback && callback(false, err.message || '验证失败');
      }
    });
  },
  
  /**
   * 发送订单确认短信
   * @param {String} phoneNumber 手机号
   * @param {String} orderNo 订单编号
   * @param {Object} orderInfo 订单信息
   * @param {Function} callback 回调函数
   */
  sendOrderConfirm(phoneNumber, orderNo, orderInfo, callback) {
    if (!this._validatePhone(phoneNumber)) {
      callback && callback(false, '手机号码格式不正确');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'sendSms',
      data: {
        action: 'sendOrderConfirm',
        phoneNumber,
        templateId: config.sms.templateId.orderConfirm,
        params: {
          orderNo,
          productName: orderInfo.productName,
          amount: orderInfo.amount
        }
      },
      success: res => {
        console.log('发送订单确认短信成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, {
            message: '订单确认短信已发送'
          });
        } else {
          callback && callback(false, res.result.message || '订单确认短信发送失败');
        }
      },
      fail: err => {
        console.error('发送订单确认短信失败', err);
        callback && callback(false, err.message || '订单确认短信发送失败');
      }
    });
  },
  
  /**
   * 发送发货通知短信
   * @param {String} phoneNumber 手机号
   * @param {String} orderNo 订单编号
   * @param {Object} shippingInfo 发货信息
   * @param {Function} callback 回调函数
   */
  sendShippingNotice(phoneNumber, orderNo, shippingInfo, callback) {
    if (!this._validatePhone(phoneNumber)) {
      callback && callback(false, '手机号码格式不正确');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'sendSms',
      data: {
        action: 'sendShippingNotice',
        phoneNumber,
        templateId: config.sms.templateId.shipping,
        params: {
          orderNo,
          expressCompany: shippingInfo.expressCompany,
          trackingNo: shippingInfo.trackingNo
        }
      },
      success: res => {
        console.log('发送发货通知短信成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, {
            message: '发货通知短信已发送'
          });
        } else {
          callback && callback(false, res.result.message || '发货通知短信发送失败');
        }
      },
      fail: err => {
        console.error('发送发货通知短信失败', err);
        callback && callback(false, err.message || '发货通知短信发送失败');
      }
    });
  },
  
  /**
   * 验证手机号格式
   * @param {String} phoneNumber 手机号
   * @returns {Boolean} 是否合法
   */
  _validatePhone(phoneNumber) {
    return /^1[3456789]\d{9}$/.test(phoneNumber);
  }
};

module.exports = SmsService;