"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    const today = /* @__PURE__ */ new Date();
    const minDate = today.toISOString().split("T")[0];
    const maxDate = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split("T")[0];
    return {
      currentStep: 1,
      productId: null,
      productInfo: {
        name: "智能POS机A1",
        deposit: 99,
        image: "/static/banner/99-2.jpg"
      },
      formData: {
        agreeTerms: false,
        name: "",
        phone: "",
        address: "",
        deliveryType: 0,
        // 0-邮寄，1-上门安装
        receiver: "",
        contactPhone: "",
        deliveryAddress: "",
        appointmentDate: "",
        appointmentTime: "",
        installAddress: "",
        paymentMethod: "wechat"
      },
      minDate,
      maxDate,
      timeSlots: ["9:00-12:00", "13:00-17:00", "18:00-21:00"]
    };
  },
  onLoad(options) {
    common_vendor.wx$1.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true
    });
    if (options.productId) {
      this.productId = options.productId;
      this.loadProductInfo();
    } else if (options.bannerId) {
      this.loadBannerProductInfo(options.bannerId);
    }
  },
  methods: {
    // 加载产品信息
    loadProductInfo() {
      common_vendor.index.__f__("log", "at pages/apply/index.vue:280", "加载产品ID:", this.productId);
      const productsData = {
        1: {
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png"
        },
        2: {
          name: "乐积分4G传统199版A",
          deposit: 199,
          image: "/static/banner/199-2.png"
        },
        3: {
          name: "乐积分微智能电签199版A",
          deposit: 199,
          image: "/static/banner/199.png"
        }
      };
      if (productsData[this.productId]) {
        this.productInfo = productsData[this.productId];
      } else {
        this.productInfo = {
          name: "智能POS机",
          deposit: 99,
          image: "/static/banner/99-2.jpg"
        };
      }
    },
    // 加载Banner对应的产品信息
    loadBannerProductInfo(bannerId) {
      common_vendor.index.__f__("log", "at pages/apply/index.vue:316", "加载Banner ID:", bannerId);
      const bannerProductMap = {
        1: {
          productId: 1,
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png"
        },
        2: {
          productId: 1,
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png"
        },
        3: {
          productId: 1,
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png"
        }
      };
      if (bannerProductMap[bannerId]) {
        this.productId = bannerProductMap[bannerId].productId;
        this.productInfo = bannerProductMap[bannerId];
      } else {
        this.productInfo = {
          name: "智能POS机",
          deposit: 99,
          image: "/static/banner/99-2.jpg"
        };
      }
    },
    // 上一步
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    // 下一步
    nextStep() {
      if (!this.validateCurrentStep()) {
        return;
      }
      if (this.currentStep < 4) {
        this.currentStep++;
      }
    },
    // 验证当前步骤
    validateCurrentStep() {
      switch (this.currentStep) {
        case 1:
          if (!this.formData.agreeTerms) {
            common_vendor.index.showToast({
              title: "请阅读并同意相关条款",
              icon: "none"
            });
            return false;
          }
          break;
        case 2:
          if (this.formData.deliveryType === 0) {
            if (!this.formData.receiver) {
              common_vendor.index.showToast({
                title: "请输入收货人姓名",
                icon: "none"
              });
              return false;
            }
            if (!this.formData.contactPhone || !/^1\d{10}$/.test(this.formData.contactPhone)) {
              common_vendor.index.showToast({
                title: "请输入正确的联系电话",
                icon: "none"
              });
              return false;
            }
            if (!this.formData.deliveryAddress) {
              common_vendor.index.showToast({
                title: "请输入收货地址",
                icon: "none"
              });
              return false;
            }
          }
          break;
      }
      return true;
    },
    // 提交表单
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      const wxUserInfo = await this.getUserInfo();
      const userId = common_vendor.index.getStorageSync("userId");
      const orderData = {
        // 基本信息 - 从配送信息中获取
        name: this.formData.receiver || "",
        phone: this.formData.contactPhone || "",
        // 配送方式
        deliveryType: this.formData.deliveryType,
        receiver: this.formData.receiver,
        contactPhone: this.formData.contactPhone,
        deliveryAddress: this.formData.deliveryAddress,
        // 产品信息
        productId: this.productId,
        productName: this.productInfo.name,
        deposit: this.productInfo.deposit,
        productImage: this.productInfo.image,
        // 订单信息
        status: "待审核",
        createTime: /* @__PURE__ */ new Date(),
        paymentMethod: this.formData.paymentMethod,
        // 用户信息关联
        wxUserInfo,
        userId: userId || null
        // 关联用户ID（已登录用户）
      };
      const db = common_vendor.wx$1.cloud.database();
      db.collection("user").add({
        data: orderData,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/apply/index.vue:465", "保存成功，记录ID：", res._id);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "支付成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.setStorageSync("currentOrderId", res._id);
            common_vendor.index.switchTab({
              url: "/pages/order/index",
              success: () => {
                common_vendor.index.__f__("log", "at pages/apply/index.vue:481", "成功跳转到订单页面");
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/apply/index.vue:484", "跳转失败", err);
                common_vendor.index.switchTab({
                  url: "/pages/index/index"
                });
              }
            });
          }, 1500);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/apply/index.vue:494", "保存失败：", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "提交失败，请重试",
            icon: "none"
          });
        }
      });
    },
    // 表单验证
    validateForm() {
      if (this.currentStep === 3) {
        if (!this.formData.agreeTerms) {
          common_vendor.index.showToast({
            title: "请阅读并同意相关条款",
            icon: "none"
          });
          return false;
        }
        if (this.formData.deliveryType === 0) {
          if (!this.formData.receiver) {
            common_vendor.index.showToast({
              title: "请输入收货人姓名",
              icon: "none"
            });
            return false;
          }
          if (!this.formData.contactPhone || !/^1\d{10}$/.test(this.formData.contactPhone)) {
            common_vendor.index.showToast({
              title: "请输入正确的联系电话",
              icon: "none"
            });
            return false;
          }
          if (!this.formData.deliveryAddress) {
            common_vendor.index.showToast({
              title: "请输入收货地址",
              icon: "none"
            });
            return false;
          }
        }
      }
      return true;
    },
    // 日期变化
    onDateChange(e) {
      this.formData.appointmentDate = e.detail.value;
    },
    // 同意条款变化
    onAgreeChange(e) {
      this.formData.agreeTerms = e.detail.value.length > 0;
    },
    // 时间段变化
    onTimeSlotChange(e) {
      this.formData.appointmentTime = this.timeSlots[e.detail.value];
    },
    // 上传图片
    uploadImage(field) {
      const that = this;
      common_vendor.index.chooseImage({
        count: 1,
        success(res) {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          that.formData[field] = tempFilePath;
          const cloudPath = `idcard/${field}_${(/* @__PURE__ */ new Date()).getTime()}${tempFilePath.match(/\.[^.]+?$/)[0]}`;
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath,
            filePath: tempFilePath,
            success: (res2) => {
              common_vendor.index.__f__("log", "at pages/apply/index.vue:594", "上传成功", res2);
              that.formData[field + "Cloud"] = res2.fileID;
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "上传成功",
                icon: "success"
              });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/apply/index.vue:604", "上传失败", err);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "上传失败，请重试",
                icon: "none"
              });
            }
          });
        }
      });
    },
    // 选择微信地址
    chooseWxAddress() {
      const that = this;
      common_vendor.index.chooseAddress({
        success(res) {
          common_vendor.index.__f__("log", "at pages/apply/index.vue:622", "获取微信地址成功", res);
          const fullAddress = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`;
          that.formData.receiver = res.userName;
          that.formData.contactPhone = res.telNumber;
          that.formData.deliveryAddress = fullAddress;
          common_vendor.index.showToast({
            title: "地址导入成功",
            icon: "success"
          });
        },
        fail(err) {
          common_vendor.index.__f__("error", "at pages/apply/index.vue:637", "获取地址失败", err);
          if (err.errMsg.indexOf("auth deny") > -1) {
            common_vendor.index.showModal({
              title: "提示",
              content: "请在微信设置中允许小程序访问通讯地址",
              showCancel: false
            });
          } else {
            common_vendor.index.showToast({
              title: "获取地址失败",
              icon: "none"
            });
          }
        }
      });
    },
    // 获取用户信息
    async getUserInfo() {
      return new Promise((resolve) => {
        common_vendor.index.getUserInfo({
          success: (res) => {
            resolve(res.userInfo);
          },
          fail: () => {
            resolve({});
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentStep >= 1 ? 1 : "",
    b: $data.currentStep > 1 ? 1 : "",
    c: $data.currentStep > 1 ? 1 : "",
    d: $data.currentStep >= 2 ? 1 : "",
    e: $data.currentStep > 2 ? 1 : "",
    f: $data.currentStep > 2 ? 1 : "",
    g: $data.currentStep >= 3 ? 1 : "",
    h: $data.productInfo
  }, $data.productInfo ? {
    i: $data.productInfo.image,
    j: common_vendor.t($data.productInfo.name),
    k: common_vendor.t($data.productInfo.deposit)
  } : {}, {
    l: $data.currentStep === 1
  }, $data.currentStep === 1 ? {
    m: common_vendor.t($data.productInfo.deposit),
    n: $data.formData.agreeTerms,
    o: common_vendor.o((...args) => $options.onAgreeChange && $options.onAgreeChange(...args))
  } : {}, {
    p: $data.currentStep === 2
  }, $data.currentStep === 2 ? common_vendor.e({
    q: $data.formData.deliveryType === 0 ? 1 : "",
    r: common_vendor.o(($event) => $data.formData.deliveryType = 0),
    s: $data.formData.deliveryType === 0
  }, $data.formData.deliveryType === 0 ? {
    t: $data.formData.receiver,
    v: common_vendor.o(($event) => $data.formData.receiver = $event.detail.value),
    w: $data.formData.contactPhone,
    x: common_vendor.o(($event) => $data.formData.contactPhone = $event.detail.value),
    y: common_vendor.o((...args) => $options.chooseWxAddress && $options.chooseWxAddress(...args)),
    z: $data.formData.deliveryAddress,
    A: common_vendor.o(($event) => $data.formData.deliveryAddress = $event.detail.value)
  } : {}) : {}, {
    B: $data.currentStep === 3
  }, $data.currentStep === 3 ? {
    C: common_vendor.t($data.productInfo.name),
    D: common_vendor.t($data.productInfo.deposit),
    E: $data.productInfo.image
  } : {}, {
    F: $data.currentStep > 1
  }, $data.currentStep > 1 ? {
    G: common_vendor.o((...args) => $options.prevStep && $options.prevStep(...args))
  } : {}, {
    H: $data.currentStep < 3
  }, $data.currentStep < 3 ? {
    I: common_vendor.o((...args) => $options.nextStep && $options.nextStep(...args))
  } : {}, {
    J: $data.currentStep === 3
  }, $data.currentStep === 3 ? {
    K: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/apply/index.js.map
