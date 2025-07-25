"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      deviceModel: "",
      serialNumber: "",
      deviceNumber: "",
      merchantName: "",
      contactName: "",
      contactPhone: "",
      currentStep: 1,
      activationCode: "",
      isSubmitting: false
    };
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (!userInfo) {
      common_vendor.index.showToast({
        title: "请先登录",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/user/index"
        });
      }, 1500);
      return;
    }
    try {
      const userInfoObj = JSON.parse(userInfo);
      if (userInfoObj.merchantName) {
        this.merchantName = userInfoObj.merchantName;
      }
      if (userInfoObj.nickName) {
        this.contactName = userInfoObj.nickName;
      }
      if (userInfoObj.phone) {
        this.contactPhone = userInfoObj.phone;
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at pages/service/activate.vue:211", "解析用户信息失败", e);
    }
  },
  methods: {
    // 扫码获取序列号
    scanSerialNumber() {
      common_vendor.index.scanCode({
        scanType: ["qrCode", "barCode"],
        success: (res) => {
          this.serialNumber = res.result;
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "扫码失败",
            icon: "none"
          });
        }
      });
    },
    // 下一步或提交
    nextStep() {
      if (this.currentStep < 4) {
        if (this.currentStep === 1) {
          if (!this.deviceModel || !this.serialNumber || !this.deviceNumber) {
            common_vendor.index.showToast({
              title: "请填写完设备信息",
              icon: "none"
            });
            return;
          }
        } else if (this.currentStep === 2) {
          if (!this.merchantName || !this.contactName || !this.contactPhone) {
            common_vendor.index.showToast({
              title: "请填写完商户信息",
              icon: "none"
            });
            return;
          }
          if (!/^1\d{10}$/.test(this.contactPhone)) {
            common_vendor.index.showToast({
              title: "请输入正确的手机号",
              icon: "none"
            });
            return;
          }
        }
        this.currentStep++;
        if (this.currentStep === 3) {
          this.generateActivationCode();
        }
      } else {
        this.submitActivation();
      }
    },
    // 生成激活码
    generateActivationCode() {
      common_vendor.index.showLoading({
        title: "生成激活码..."
      });
      setTimeout(() => {
        const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.activationCode = `${randomCode.slice(0, 4)}-${randomCode.slice(
          4,
          8
        )}`;
        common_vendor.index.hideLoading();
      }, 1500);
    },
    // 提交激活信息
    submitActivation() {
      if (this.isSubmitting)
        return;
      this.isSubmitting = true;
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      const activationData = {
        deviceModel: this.deviceModel,
        serialNumber: this.serialNumber,
        deviceNumber: this.deviceNumber,
        merchantName: this.merchantName,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        activationCode: this.activationCode,
        activationTime: /* @__PURE__ */ new Date(),
        status: "pending"
        // 待审核状态
      };
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pages/service/activate.vue:325", "提交激活信息", activationData);
        common_vendor.index.showModal({
          title: "激活申请已提交",
          content: "您的POS机激活申请已提交，我们将在1-2个工作日内处理。激活结果将通过短信通知您。",
          showCancel: false,
          confirmText: "知道了",
          success: () => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }
        });
        this.isSubmitting = false;
      }, 2e3);
    },
    // 复制激活码
    copyActivationCode() {
      common_vendor.index.setClipboardData({
        data: this.activationCode,
        success: () => {
          common_vendor.index.showToast({
            title: "激活码已复制",
            icon: "success"
          });
        }
      });
    },
    // 导航到指定页面
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    // 拨打客服电话
    callService() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "400-123-4567",
        fail: () => {
          common_vendor.index.showToast({
            title: "拨打失败",
            icon: "none"
          });
        }
      });
    },
    // 联系在线客服
    contactOnlineService() {
      common_vendor.index.showToast({
        title: "正在接入客服...",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.deviceModel,
    b: common_vendor.o(($event) => $data.deviceModel = $event.detail.value),
    c: $data.serialNumber,
    d: common_vendor.o(($event) => $data.serialNumber = $event.detail.value),
    e: common_vendor.o((...args) => $options.scanSerialNumber && $options.scanSerialNumber(...args)),
    f: $data.deviceNumber,
    g: common_vendor.o(($event) => $data.deviceNumber = $event.detail.value),
    h: $data.merchantName,
    i: common_vendor.o(($event) => $data.merchantName = $event.detail.value),
    j: $data.contactName,
    k: common_vendor.o(($event) => $data.contactName = $event.detail.value),
    l: $data.contactPhone,
    m: common_vendor.o(($event) => $data.contactPhone = $event.detail.value),
    n: $data.currentStep >= 1 ? 1 : "",
    o: $data.currentStep >= 2 ? 1 : "",
    p: $data.currentStep >= 3 ? 1 : "",
    q: $data.currentStep >= 4 ? 1 : "",
    r: $data.activationCode
  }, $data.activationCode ? {
    s: common_vendor.t($data.activationCode),
    t: common_vendor.o((...args) => $options.copyActivationCode && $options.copyActivationCode(...args))
  } : {}, {
    v: common_vendor.o(($event) => $options.navigateTo("/pages/guide/activate")),
    w: common_vendor.o((...args) => $options.callService && $options.callService(...args)),
    x: common_vendor.o((...args) => $options.contactOnlineService && $options.contactOnlineService(...args)),
    y: common_vendor.t($data.currentStep < 4 ? "下一步" : "完成激活"),
    z: common_vendor.o((...args) => $options.nextStep && $options.nextStep(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/activate.js.map
