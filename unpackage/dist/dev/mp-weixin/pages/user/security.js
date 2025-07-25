"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        phone: "",
        isVerified: false
      },
      hasPayPassword: false
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          }
        });
      }
    },
    // 获取用户信息
    getUserInfo() {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          this.userInfo = userInfo;
          if (userInfo._id) {
            this.fetchUserSecurityInfo(userInfo._id);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/user/security.vue:183", "解析用户信息失败", e);
        }
      }
    },
    // 获取用户安全信息
    fetchUserSecurityInfo(userId) {
      const db = common_vendor.wx$1.cloud.database();
      db.collection("userinfo").doc(userId).get().then((res) => {
        if (res.data) {
          this.userInfo = res.data;
          this.hasPayPassword = !!res.data.hasPayPassword;
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/security.vue:204", "获取用户安全信息失败", err);
      });
    },
    // 手机号验证
    handlePhoneVerify() {
      common_vendor.index.navigateTo({
        url: "/pages/user/phone-verify"
      });
    },
    // 设置支付密码
    handleSetPayPassword() {
      common_vendor.index.showToast({
        title: "支付密码功能开发中",
        icon: "none"
      });
    },
    // 微信授权
    handleWechatAuth() {
      common_vendor.index.showToast({
        title: "微信已授权",
        icon: "success"
      });
    },
    // 实名认证
    handleVerifyIdentity() {
      if (this.userInfo.isVerified) {
        common_vendor.index.showModal({
          title: "提示",
          content: "您已完成实名认证",
          showCancel: false
        });
        return;
      }
      common_vendor.index.showToast({
        title: "实名认证功能开发中",
        icon: "none"
      });
    },
    // 修改登录密码
    handleChangeLoginPassword() {
      common_vendor.index.showToast({
        title: "密码修改功能开发中",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.userInfo.phone ? $data.userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "未绑定"),
    b: common_vendor.o((...args) => $options.handlePhoneVerify && $options.handlePhoneVerify(...args)),
    c: common_vendor.t($data.hasPayPassword ? "已设置" : "未设置"),
    d: common_vendor.o((...args) => $options.handleSetPayPassword && $options.handleSetPayPassword(...args)),
    e: common_vendor.o((...args) => $options.handleWechatAuth && $options.handleWechatAuth(...args)),
    f: common_vendor.t($data.userInfo.isVerified ? "已认证" : "未认证"),
    g: common_vendor.o((...args) => $options.handleVerifyIdentity && $options.handleVerifyIdentity(...args)),
    h: common_vendor.o((...args) => $options.handleChangeLoginPassword && $options.handleChangeLoginPassword(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/security.js.map
