"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      code: "",
      countdown: 0,
      timer: null,
      userId: ""
    };
  },
  onLoad(options) {
    this.checkLoginStatus();
    if (options && options.userId) {
      this.userId = options.userId;
    }
  },
  onShow() {
    this.loadUserPhone();
  },
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
        return;
      }
      try {
        const userInfoObj = JSON.parse(userInfo);
        this.userId = userInfoObj._id;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/phone-verify.vue:124", "解析用户信息失败", e);
      }
    },
    // 加载用户手机号
    loadUserPhone() {
      if (!this.userId)
        return;
      const db = common_vendor.wx$1.cloud.database();
      db.collection("userinfo").doc(this.userId).get().then((res) => {
        if (res.data && res.data.phone) {
          this.phone = res.data.phone;
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/phone-verify.vue:142", "获取用户手机号失败", err);
      });
    },
    // 获取验证码
    getVerifyCode() {
      if (this.countdown > 0)
        return;
      if (!/^1\d{10}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "发送中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "验证码已发送",
          icon: "success"
        });
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1e3);
      }, 1500);
    },
    // 提交验证
    submitVerify() {
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!this.code) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return;
      }
      if (!/^1\d{10}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (!/^\d{6}$/.test(this.code)) {
        common_vendor.index.showToast({
          title: "请输入6位数字验证码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "验证中..."
      });
      setTimeout(() => {
        const db = common_vendor.wx$1.cloud.database();
        db.collection("userinfo").doc(this.userId).update({
          data: {
            phone: this.phone,
            isPhoneVerified: true,
            updateTime: /* @__PURE__ */ new Date()
          }
        }).then(() => {
          const userInfoStr = common_vendor.index.getStorageSync("userInfo");
          if (userInfoStr) {
            try {
              const userInfo = JSON.parse(userInfoStr);
              userInfo.phone = this.phone;
              userInfo.isPhoneVerified = true;
              common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/phone-verify.vue:250", "更新本地用户信息失败", e);
            }
          }
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "验证成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }).catch((err) => {
          common_vendor.index.__f__("error", "at pages/user/phone-verify.vue:266", "更新用户手机号失败", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "验证失败，请重试",
            icon: "none"
          });
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.phone,
    b: common_vendor.o(($event) => $data.phone = $event.detail.value),
    c: $data.code,
    d: common_vendor.o(($event) => $data.code = $event.detail.value),
    e: common_vendor.t($data.countdown > 0 ? `${$data.countdown}秒` : "获取验证码"),
    f: $data.countdown > 0 ? 1 : "",
    g: common_vendor.o((...args) => $options.getVerifyCode && $options.getVerifyCode(...args)),
    h: common_vendor.o((...args) => $options.submitVerify && $options.submitVerify(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/phone-verify.js.map
