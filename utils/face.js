/**
 * 人脸核身工具类
 * 基于腾讯云人脸核身服务
 */
const config = require('../config/index');

const FaceVerifyService = {
  /**
   * 获取人脸核身签名
   * @param {Object} userInfo 用户信息
   * @param {String} userInfo.name 姓名
   * @param {String} userInfo.idcard 身份证号
   * @param {Function} callback 回调函数
   */
  getFaceVerifySign(userInfo, callback) {
    if (!userInfo || !userInfo.name || !userInfo.idcard) {
      callback && callback(false, '用户信息不完整');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'faceVerify',
      data: {
        action: 'getSign',
        userInfo: {
          name: userInfo.name,
          idcard: userInfo.idcard
        }
      },
      success: res => {
        console.log('获取人脸核身签名成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '获取签名失败');
        }
      },
      fail: err => {
        console.error('获取人脸核身签名失败', err);
        callback && callback(false, err.message || '获取签名失败');
      }
    });
  },
  
  /**
   * 启动人脸核身
   * @param {Object} params 核身参数
   * @param {String} params.verifyMethod 验证方式
   * @param {Object} params.userInfo 用户信息
   * @param {Object} params.sign 签名信息
   * @param {Function} callback 回调函数
   */
  startFaceVerify(params, callback) {
    const { verifyMethod, userInfo, sign } = params;
    
    if (!sign || !sign.ticket) {
      callback && callback(false, '签名信息不完整');
      return;
    }
    
    // 调用人脸核身小程序插件
    const plugin = requirePlugin('faceid-verification');
    plugin.startVerify({
      data: {
        orderNo: sign.orderNo,
        h5faceId: sign.ticket,
        userId: userInfo.userId || '',
        name: userInfo.name,
        idcard: userInfo.idcard,
        verifyMethod: verifyMethod || config.face.verifyMethod.IDCARD_FACE
      },
      success: (res) => {
        console.log('人脸核身成功', res);
        // 验证结果上报
        this._reportVerifyResult({
          orderNo: sign.orderNo,
          verifyResult: res,
          success: true
        }, (success, data) => {
          if (success) {
            callback && callback(true, {
              message: '人脸核身成功',
              ...data
            });
          } else {
            callback && callback(true, {
              message: '人脸核身成功，但结果上报失败',
              verifyResult: res
            });
          }
        });
      },
      fail: (err) => {
        console.error('人脸核身失败', err);
        // 上报失败结果
        this._reportVerifyResult({
          orderNo: sign.orderNo,
          verifyResult: err,
          success: false
        });
        
        callback && callback(false, {
          message: '人脸核身失败',
          error: err
        });
      }
    });
  },
  
  /**
   * 查询人脸核身结果
   * @param {String} orderNo 订单号
   * @param {Function} callback 回调函数
   */
  queryVerifyResult(orderNo, callback) {
    if (!orderNo) {
      callback && callback(false, '订单号不能为空');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'faceVerify',
      data: {
        action: 'queryResult',
        orderNo
      },
      success: res => {
        console.log('查询人脸核身结果成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '查询结果失败');
        }
      },
      fail: err => {
        console.error('查询人脸核身结果失败', err);
        callback && callback(false, err.message || '查询结果失败');
      }
    });
  },
  
  /**
   * 上报核身结果
   * @param {Object} params 结果参数
   * @param {String} params.orderNo 订单号
   * @param {Object} params.verifyResult 核身结果
   * @param {Boolean} params.success 是否成功
   * @param {Function} callback 回调函数
   */
  _reportVerifyResult(params, callback) {
    wx.cloud.callFunction({
      name: 'faceVerify',
      data: {
        action: 'reportResult',
        orderNo: params.orderNo,
        verifyResult: params.verifyResult,
        success: params.success
      },
      success: res => {
        console.log('上报人脸核身结果成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '上报结果失败');
        }
      },
      fail: err => {
        console.error('上报人脸核身结果失败', err);
        callback && callback(false, err.message || '上报结果失败');
      }
    });
  }
};

module.exports = FaceVerifyService; 