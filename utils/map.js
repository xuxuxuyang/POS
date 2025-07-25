/**
 * 地图定位服务工具类
 */
const config = require('../config/index');

const MapService = {
  /**
   * 获取当前位置
   * @param {Object} options 定位选项
   * @param {String} options.accuracy 定位精度
   * @param {Boolean} options.isHighAccuracy 是否使用高精度
   * @param {Function} callback 回调函数
   */
  getCurrentLocation(options = {}, callback) {
    // 获取定位精度
    const accuracy = options.accuracy || config.map.defaultAccuracy;
    
    // 是否使用高精度定位
    const isHighAccuracy = options.isHighAccuracy || (accuracy === config.map.accuracy.HIGH);
    
    wx.getLocation({
      type: isHighAccuracy ? 'gcj02' : 'wgs84',
      isHighAccuracy: isHighAccuracy,
      highAccuracyExpireTime: 3000, // 高精度定位超时时间，单位ms
      success: res => {
        console.log('获取位置成功', res);
        callback && callback(true, {
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy,
          altitude: res.altitude,
          speed: res.speed,
          verticalAccuracy: res.verticalAccuracy,
          horizontalAccuracy: res.horizontalAccuracy
        });
      },
      fail: err => {
        console.error('获取位置失败', err);
        // 如果是高精度定位失败，尝试普通精度
        if (isHighAccuracy) {
          console.log('高精度定位失败，尝试普通精度');
          this.getCurrentLocation({...options, isHighAccuracy: false}, callback);
        } else {
          callback && callback(false, {
            message: '获取位置失败，请检查是否授予位置权限',
            error: err
          });
        }
      }
    });
  },
  
  /**
   * 地址解析（地址转坐标）
   * @param {String} address 地址
   * @param {Function} callback 回调函数
   */
  geocoder(address, callback) {
    if (!address) {
      callback && callback(false, '地址不能为空');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'map',
      data: {
        action: 'geocoder',
        address
      },
      success: res => {
        console.log('地址解析成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '地址解析失败');
        }
      },
      fail: err => {
        console.error('地址解析失败', err);
        callback && callback(false, err.message || '地址解析失败');
      }
    });
  },
  
  /**
   * 逆地址解析（坐标转地址）
   * @param {Number} latitude 纬度
   * @param {Number} longitude 经度
   * @param {Function} callback 回调函数
   */
  reverseGeocoder(latitude, longitude, callback) {
    if (!latitude || !longitude) {
      callback && callback(false, '坐标不能为空');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'map',
      data: {
        action: 'reverseGeocoder',
        location: {
          latitude,
          longitude
        }
      },
      success: res => {
        console.log('逆地址解析成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '逆地址解析失败');
        }
      },
      fail: err => {
        console.error('逆地址解析失败', err);
        callback && callback(false, err.message || '逆地址解析失败');
      }
    });
  },
  
  /**
   * 计算两点之间的距离和行车时间
   * @param {Object} from 起点坐标
   * @param {Number} from.latitude 起点纬度
   * @param {Number} from.longitude 起点经度
   * @param {Object} to 终点坐标
   * @param {Number} to.latitude 终点纬度
   * @param {Number} to.longitude 终点经度
   * @param {Function} callback 回调函数
   */
  calculateDistance(from, to, callback) {
    if (!from || !from.latitude || !from.longitude || !to || !to.latitude || !to.longitude) {
      callback && callback(false, '坐标信息不完整');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'map',
      data: {
        action: 'calculateDistance',
        from: {
          latitude: from.latitude,
          longitude: from.longitude
        },
        to: {
          latitude: to.latitude,
          longitude: to.longitude
        },
        useTraffic: config.map.distance.useTraffic,
        policy: config.map.distance.policy
      },
      success: res => {
        console.log('计算距离成功', res);
        if (res.result && res.result.code === 0) {
          callback && callback(true, res.result.data);
        } else {
          callback && callback(false, res.result.message || '计算距离失败');
        }
      },
      fail: err => {
        console.error('计算距离失败', err);
        callback && callback(false, err.message || '计算距离失败');
      }
    });
  },
  
  /**
   * 在地图上选择位置
   * @param {Function} callback 回调函数
   */
  chooseLocation(callback) {
    wx.chooseLocation({
      success: res => {
        console.log('选择位置成功', res);
        callback && callback(true, {
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: err => {
        console.error('选择位置失败', err);
        if (err.errMsg.indexOf('cancel') > -1) {
          callback && callback(false, {
            message: '用户取消选择',
            cancel: true
          });
        } else {
          callback && callback(false, {
            message: '选择位置失败',
            error: err
          });
        }
      }
    });
  }
};

module.exports = MapService; 