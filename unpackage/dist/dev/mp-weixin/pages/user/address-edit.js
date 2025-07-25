"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      addressId: "",
      userId: "",
      addressData: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        region: "",
        address: "",
        isDefault: false
      }
    };
  },
  onLoad(options) {
    this.checkLoginStatus();
    if (options.id) {
      this.addressId = options.id;
      this.loadAddressData(options.id);
    }
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        this.userId = parsedInfo._id;
      } else {
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
    // 加载地址数据
    loadAddressData(addressId) {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      const db = common_vendor.wx$1.cloud.database();
      db.collection("address").doc(addressId).get().then((res) => {
        if (res.data) {
          this.addressData = res.data;
          this.addressData.region = res.data.province + " " + res.data.city + " " + res.data.district;
        }
        common_vendor.index.hideLoading();
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/address-edit.vue:140", "获取地址详情失败", err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      });
    },
    // 显示地区选择器
    showRegionPicker() {
      common_vendor.index.chooseAddress({
        success: (res) => {
          this.addressData.name = res.userName;
          this.addressData.phone = res.telNumber;
          this.addressData.province = res.provinceName;
          this.addressData.city = res.cityName;
          this.addressData.district = res.countyName;
          this.addressData.address = res.detailInfo;
          this.addressData.region = res.provinceName + " " + res.cityName + " " + res.countyName;
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "请选择地区",
            icon: "none"
          });
          common_vendor.index.showModal({
            title: "提示",
            content: "地区选择需要调用原生组件，这里先使用模拟数据",
            showCancel: false,
            success: () => {
              setTimeout(() => {
                this.addressData.province = "广东省";
                this.addressData.city = "深圳市";
                this.addressData.district = "南山区";
                this.addressData.region = this.addressData.province + " " + this.addressData.city + " " + this.addressData.district;
              }, 500);
            }
          });
        }
      });
    },
    // 设置默认地址
    setDefaultChange(e) {
      this.addressData.isDefault = e.detail.value;
    },
    // 验证表单
    validateForm() {
      if (!this.addressData.name) {
        common_vendor.index.showToast({
          title: "请输入收货人姓名",
          icon: "none"
        });
        return false;
      }
      if (!this.addressData.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号码",
          icon: "none"
        });
        return false;
      }
      if (!/^1\d{10}$/.test(this.addressData.phone)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return false;
      }
      if (!this.addressData.province || !this.addressData.city || !this.addressData.district) {
        common_vendor.index.showToast({
          title: "请选择所在地区",
          icon: "none"
        });
        return false;
      }
      if (!this.addressData.address) {
        common_vendor.index.showToast({
          title: "请输入详细地址",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    // 保存地址
    saveAddress() {
      if (!this.validateForm())
        return;
      common_vendor.index.showLoading({
        title: "保存中..."
      });
      const db = common_vendor.wx$1.cloud.database();
      const addressData = {
        userId: this.userId,
        name: this.addressData.name,
        phone: this.addressData.phone,
        province: this.addressData.province,
        city: this.addressData.city,
        district: this.addressData.district,
        address: this.addressData.address,
        isDefault: this.addressData.isDefault,
        updateTime: /* @__PURE__ */ new Date()
      };
      const updateDefaultPromise = this.addressData.isDefault ? this.updateOtherAddressDefault() : Promise.resolve();
      updateDefaultPromise.then(() => {
        if (this.addressId) {
          return db.collection("address").doc(this.addressId).update({
            data: addressData
          });
        } else {
          addressData.createTime = /* @__PURE__ */ new Date();
          return db.collection("address").add({
            data: addressData
          });
        }
      }).then(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/address-edit.vue:302", "保存地址失败", err);
        common_vendor.index.hideLoading();
        if (err.errCode === -502005 || err.errMsg && err.errMsg.includes("collection not exists")) {
          this.createCollectionAndSave(addressData);
        } else {
          common_vendor.index.showToast({
            title: "保存失败",
            icon: "none"
          });
        }
      });
    },
    // 更新其他地址为非默认
    updateOtherAddressDefault() {
      const db = common_vendor.wx$1.cloud.database();
      const _ = db.command;
      return db.collection("address").where({
        userId: this.userId,
        isDefault: true,
        _id: _.neq(this.addressId || "")
      }).update({
        data: {
          isDefault: false
        }
      }).catch((err) => {
        if (err.errCode === -502005 || err.errMsg && err.errMsg.includes("collection not exists")) {
          return Promise.resolve();
        }
        return Promise.reject(err);
      });
    },
    // 创建集合并保存地址
    createCollectionAndSave(addressData) {
      common_vendor.index.showModal({
        title: "提示",
        content: "正在初始化地址数据，请稍候...",
        showCancel: false,
        success: () => {
          setTimeout(() => {
            const db = common_vendor.wx$1.cloud.database();
            addressData.createTime = /* @__PURE__ */ new Date();
            db.collection("address").add({
              data: addressData
            }).then(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "保存成功",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            }).catch((err) => {
              common_vendor.index.__f__("error", "at pages/user/address-edit.vue:381", "二次尝试保存地址失败", err);
              common_vendor.index.showToast({
                title: "保存失败，请联系客服",
                icon: "none"
              });
            });
          }, 1e3);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.addressData.name,
    b: common_vendor.o(($event) => $data.addressData.name = $event.detail.value),
    c: $data.addressData.phone,
    d: common_vendor.o(($event) => $data.addressData.phone = $event.detail.value),
    e: common_vendor.t($data.addressData.region || "请选择省/市/区"),
    f: !$data.addressData.region ? 1 : "",
    g: common_vendor.o((...args) => $options.showRegionPicker && $options.showRegionPicker(...args)),
    h: $data.addressData.address,
    i: common_vendor.o(($event) => $data.addressData.address = $event.detail.value),
    j: $data.addressData.isDefault,
    k: common_vendor.o((...args) => $options.setDefaultChange && $options.setDefaultChange(...args)),
    l: common_vendor.o((...args) => $options.saveAddress && $options.saveAddress(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/address-edit.js.map
