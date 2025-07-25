<script>
import config from "./config/index.js";

export default {
  globalData: {
    config: config, // 全局配置
    userInfo: null, // 用户信息
    isAuthenticated: false, // 是否已认证
  },

  onLaunch: function () {
    console.log("App Launch");

    // 初始化云环境
    this.initCloud();

    // 检查更新
    this.checkUpdate();
  },

  onShow: function () {
    console.log("App Show");
  },

  onHide: function () {
    console.log("App Hide");
  },

  methods: {
    // 初始化云环境
    initCloud() {
      if (!wx.cloud) {
        console.error("请使用 2.2.3 或以上的基础库以使用云能力");
        return;
      }

      wx.cloud.init({
        env: config.cloud.ENV_ID,
        traceUser: true,
      });

      console.log("云环境初始化成功:", config.cloud.ENV_ID);
    },

    // 检查小程序更新
    checkUpdate() {
      if (wx.canIUse("getUpdateManager")) {
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            console.log("检测到新版本");
          }
        });

        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success: function (res) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            },
          });
        });

        updateManager.onUpdateFailed(function () {
          console.error("新版本下载失败");
        });
      }
    },

    // 调用云函数
    callCloudFunction(name, data) {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name,
          data,
          success: (res) => {
            console.log(`云函数 ${name} 调用成功:`, res);
            if (res.result && res.result.code === 0) {
              resolve(res.result.data);
            } else {
              reject(res.result || { message: `云函数 ${name} 调用失败` });
            }
          },
          fail: (err) => {
            console.error(`云函数 ${name} 调用失败:`, err);
            reject(err);
          },
        });
      });
    },
  },
};
</script>

<style>
/*每个页面公共css */
</style>
