"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const config_index = require("./config/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/order/list.js";
  "./pages/service/activate.js";
  "./pages/service/appointment.js";
  "./pages/service/repair.js";
  "./pages/product/list.js";
  "./pages/product/detail.js";
  "./pages/apply/index.js";
  "./pages/order/index.js";
  "./pages/deposit/pay.js";
  "./pages/deposit/refund-orders.js";
  "./pages/user/index.js";
  "./pages/help/index.js";
  "./pages/search/index.js";
  "./pages/user/points.js";
  "./pages/guide/apply.js";
  "./pages/guide/index.js";
  "./pages/service/after-sale.js";
  "./pages/activity/list.js";
  "./pages/activity/detail.js";
  "./pages/guide/download.js";
  "./pages/user/invoice.js";
  "./pages/promoter/index.js";
  "./pages/promoter/join.js";
  "./pages/service/more.js";
  "./pages/user/address.js";
  "./pages/user/address-edit.js";
  "./pages/user/security.js";
  "./pages/user/phone-verify.js";
  "./pages/help/feedback.js";
  "./pages/help/about.js";
  "./pages/activity/promotion.js";
}
const _sfc_main = {
  globalData: {
    config: config_index.config,
    // 全局配置
    userInfo: null,
    // 用户信息
    isAuthenticated: false
    // 是否已认证
  },
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Launch");
    this.initCloud();
    this.checkUpdate();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:22", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:26", "App Hide");
  },
  methods: {
    // 初始化云环境
    initCloud() {
      if (!common_vendor.wx$1.cloud) {
        common_vendor.index.__f__("error", "at App.vue:33", "请使用 2.2.3 或以上的基础库以使用云能力");
        return;
      }
      common_vendor.wx$1.cloud.init({
        env: config_index.config.cloud.ENV_ID,
        traceUser: true
      });
      common_vendor.index.__f__("log", "at App.vue:42", "云环境初始化成功:", config_index.config.cloud.ENV_ID);
    },
    // 检查小程序更新
    checkUpdate() {
      if (common_vendor.wx$1.canIUse("getUpdateManager")) {
        const updateManager = common_vendor.wx$1.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          if (res.hasUpdate) {
            common_vendor.index.__f__("log", "at App.vue:52", "检测到新版本");
          }
        });
        updateManager.onUpdateReady(function() {
          common_vendor.wx$1.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success: function(res) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
        updateManager.onUpdateFailed(function() {
          common_vendor.index.__f__("error", "at App.vue:69", "新版本下载失败");
        });
      }
    },
    // 调用云函数
    callCloudFunction(name, data) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.callFunction({
          name,
          data,
          success: (res) => {
            common_vendor.index.__f__("log", "at App.vue:81", `云函数 ${name} 调用成功:`, res);
            if (res.result && res.result.code === 0) {
              resolve(res.result.data);
            } else {
              reject(res.result || { message: `云函数 ${name} 调用失败` });
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at App.vue:89", `云函数 ${name} 调用失败:`, err);
            reject(err);
          }
        });
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
