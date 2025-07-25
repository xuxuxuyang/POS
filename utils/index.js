/**
 * 工具类统一导出入口
 */
const paymentService = require('./payment');
const smsService = require('./sms');
const faceVerifyService = require('./face');
const logisticsService = require('./logistics');
const mapService = require('./map');

// 日期格式化工具
const formatDate = {
  /**
   * 格式化日期
   * @param {Date|String|Number} date 日期对象/日期字符串/时间戳
   * @param {String} format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
   * @returns {String} 格式化后的日期字符串
   */
  format(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    
    // 转换为日期对象
    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    return format
      .replace('YYYY', year)
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('HH', hours.toString().padStart(2, '0'))
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'));
  },
  
  /**
   * 获取相对时间描述
   * @param {Date|String|Number} date 日期对象/日期字符串/时间戳
   * @returns {String} 相对时间描述
   */
  getRelativeTime(date) {
    if (!date) return '';
    
    // 转换为日期对象
    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date);
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 一分钟内
    if (diff < 60 * 1000) {
      return '刚刚';
    }
    
    // 一小时内
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}分钟前`;
    }
    
    // 一天内
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}小时前`;
    }
    
    // 一月内
    if (diff < 30 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}天前`;
    }
    
    // 一年内
    if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
      const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
      return `${months}个月前`;
    }
    
    // 超过一年
    const years = Math.floor(diff / (12 * 30 * 24 * 60 * 60 * 1000));
    return `${years}年前`;
  }
};

// 通用工具方法
const utils = {
  /**
   * 防抖函数
   * @param {Function} fn 需要防抖的函数
   * @param {Number} wait 等待时间(ms)
   * @returns {Function} 防抖处理后的函数
   */
  debounce(fn, wait = 500) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  },
  
  /**
   * 节流函数
   * @param {Function} fn 需要节流的函数
   * @param {Number} interval 间隔时间(ms)
   * @returns {Function} 节流处理后的函数
   */
  throttle(fn, interval = 500) {
    let last = 0;
    return function(...args) {
      const now = Date.now();
      if (now - last >= interval) {
        last = now;
        fn.apply(this, args);
      }
    };
  },
  
  /**
   * 生成UUID
   * @returns {String} uuid
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  /**
   * 格式化金额
   * @param {Number} amount 金额（分）
   * @returns {String} 格式化后的金额（元）
   */
  formatAmount(amount) {
    if (typeof amount !== 'number') return '0.00';
    return (amount / 100).toFixed(2);
  },
  
  /**
   * 获取文件扩展名
   * @param {String} filename 文件名
   * @returns {String} 文件扩展名
   */
  getFileExtension(filename) {
    if (!filename) return '';
    return filename.substring(filename.lastIndexOf('.') + 1);
  },
  
  /**
   * 将查询参数对象转换为查询字符串
   * @param {Object} params 查询参数对象
   * @returns {String} 查询字符串
   */
  objectToQueryString(params) {
    if (!params || typeof params !== 'object') return '';
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
};

module.exports = {
  payment: paymentService,
  sms: smsService,
  face: faceVerifyService,
  logistics: logisticsService,
  map: mapService,
  date: formatDate,
  utils
}; 