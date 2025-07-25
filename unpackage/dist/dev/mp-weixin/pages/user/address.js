"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      addressList: [],
      userId: ""
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.fetchAddressList();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        this.userId = parsedInfo._id;
        this.fetchAddressList();
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
    // 获取地址列表
    fetchAddressList() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      const db = common_vendor.wx$1.cloud.database();
      db.collection("address").where({
        userId: this.userId
      }).get().then((res) => {
        this.addressList = res.data;
        common_vendor.index.hideLoading();
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/address.vue:110", "获取地址列表失败", err);
        common_vendor.index.hideLoading();
        if (err.errCode === -502005 || err.errMsg && err.errMsg.includes("collection not exists")) {
          this.addressList = [];
          this.createAddressCollection();
        } else {
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      });
    },
    // 创建地址集合
    createAddressCollection() {
      common_vendor.index.showModal({
        title: "提示",
        content: "地址数据初始化中，请添加您的第一个收货地址",
        showCancel: false,
        success: () => {
        }
      });
    },
    // 选择地址
    selectAddress(address) {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("selectAddress", address);
      common_vendor.index.navigateBack();
    },
    // 编辑地址
    editAddress(address) {
      common_vendor.index.navigateTo({
        url: "/pages/user/address-edit?id=" + address._id
      });
    },
    // 删除地址
    deleteAddress(address) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该地址吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "删除中..."
            });
            const db = common_vendor.wx$1.cloud.database();
            db.collection("address").doc(address._id).remove().then(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              this.fetchAddressList();
            }).catch((err) => {
              common_vendor.index.__f__("error", "at pages/user/address.vue:188", "删除地址失败", err);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            });
          }
        }
      });
    },
    // 新增地址
    addNewAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/user/address-edit"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.addressList.length > 0
  }, $data.addressList.length > 0 ? {
    b: common_vendor.f($data.addressList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: item.isDefault
      }, item.isDefault ? {} : {}, {
        d: common_vendor.t(item.province),
        e: common_vendor.t(item.city),
        f: common_vendor.t(item.district),
        g: common_vendor.t(item.address),
        h: common_vendor.o(($event) => $options.editAddress(item), index),
        i: common_vendor.o(($event) => $options.deleteAddress(item), index),
        j: index,
        k: common_vendor.o(($event) => $options.selectAddress(item), index)
      });
    })
  } : {}, {
    c: common_vendor.o((...args) => $options.addNewAddress && $options.addNewAddress(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/address.js.map
