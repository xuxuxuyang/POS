"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      deviceModels: [
        "POS-M1",
        "POS-M2",
        "POS-M3 Pro",
        "POS-M4",
        "POS-M5",
        "POS-M6 Plus",
        "POS-S1",
        "POS-S2",
        "POS-S3 Mini"
      ],
      issueTypes: [
        "无法开机",
        "无法充电",
        "屏幕故障",
        "打印故障",
        "网络连接问题",
        "读卡问题",
        "系统故障",
        "按键失灵",
        "其他问题"
      ],
      repairTypes: [
        { label: "寄修（邮寄到维修中心）", value: "mail" },
        { label: "上门维修（仅限部分城市）", value: "onsite" },
        { label: "预约到店（就近服务网点）", value: "store" }
      ],
      formData: {
        model: "",
        serialNumber: "",
        purchaseDate: "",
        issueType: "",
        issueDescription: "",
        images: [],
        repairType: "mail",
        repairAddress: "",
        contactName: "",
        contactPhone: "",
        remark: ""
      },
      userInfo: null
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          this.userInfo = JSON.parse(userInfoStr);
          if (this.userInfo) {
            this.formData.contactName = this.userInfo.nickName || "";
            this.formData.contactPhone = this.userInfo.phone || "";
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/service/repair.vue:278", "解析用户信息失败", e);
        }
      }
    },
    // 型号选择事件
    onModelChange(e) {
      const index = e.detail.value;
      this.formData.model = this.deviceModels[index];
    },
    // 日期选择事件
    onDateChange(e) {
      this.formData.purchaseDate = e.detail.value;
    },
    // 故障类型选择事件
    onIssueTypeChange(e) {
      const index = e.detail.value;
      this.formData.issueType = this.issueTypes[index];
    },
    // 维修方式选择事件
    onRepairTypeChange(e) {
      this.formData.repairType = e.detail.value;
    },
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 3 - this.formData.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.formData.images = [
            ...this.formData.images,
            ...res.tempFilePaths
          ];
        }
      });
    },
    // 删除图片
    deleteImage(index) {
      this.formData.images.splice(index, 1);
    },
    // 表单验证
    validateForm() {
      if (!this.formData.model) {
        this.showToast("请选择设备型号");
        return false;
      }
      if (!this.formData.serialNumber) {
        this.showToast("请输入设备SN码");
        return false;
      }
      if (!this.formData.issueType) {
        this.showToast("请选择故障类型");
        return false;
      }
      if (!this.formData.issueDescription) {
        this.showToast("请描述故障情况");
        return false;
      }
      if (this.formData.repairType === "mail" && !this.formData.repairAddress) {
        this.showToast("请输入收件地址");
        return false;
      }
      if (!this.formData.contactName) {
        this.showToast("请输入联系人姓名");
        return false;
      }
      if (!this.formData.contactPhone) {
        this.showToast("请输入联系电话");
        return false;
      }
      if (!/^1\d{10}$/.test(this.formData.contactPhone)) {
        this.showToast("请输入正确的手机号");
        return false;
      }
      return true;
    },
    // 提交表单
    submitForm() {
      if (!this.validateForm()) {
        return;
      }
      if (!this.userInfo) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再提交维修申请",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/user/index"
              });
            }
          }
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中...",
        mask: true
      });
      const submitData = {
        ...this.formData,
        userId: this.userInfo._id,
        submitTime: /* @__PURE__ */ new Date(),
        status: "待处理",
        repairId: "R" + Date.now()
      };
      setTimeout(() => {
        const db = common_vendor.wx$1.cloud.database();
        db.collection("repair_orders").add({
          data: submitData,
          success: (res) => {
            common_vendor.index.hideLoading();
            common_vendor.index.showModal({
              title: "提交成功",
              content: "您的维修申请已提交，维修单号：" + submitData.repairId + "，我们将尽快处理",
              showCancel: false,
              success: () => {
                common_vendor.index.navigateBack();
              }
            });
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/service/repair.vue:435", "提交维修申请失败", err);
            this.showToast("提交失败，请重试");
          }
        });
      }, 1500);
    },
    // 显示提示
    showToast(title) {
      common_vendor.index.showToast({
        title,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.formData.model || "请选择设备型号"),
    b: $data.deviceModels,
    c: common_vendor.o((...args) => $options.onModelChange && $options.onModelChange(...args)),
    d: $data.formData.serialNumber,
    e: common_vendor.o(($event) => $data.formData.serialNumber = $event.detail.value),
    f: common_vendor.t($data.formData.purchaseDate || "请选择购买日期"),
    g: $data.formData.purchaseDate,
    h: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    i: common_vendor.t($data.formData.issueType || "请选择故障类型"),
    j: $data.issueTypes,
    k: common_vendor.o((...args) => $options.onIssueTypeChange && $options.onIssueTypeChange(...args)),
    l: $data.formData.issueDescription,
    m: common_vendor.o(($event) => $data.formData.issueDescription = $event.detail.value),
    n: common_vendor.f($data.formData.images, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    o: $data.formData.images.length < 3
  }, $data.formData.images.length < 3 ? {
    p: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    q: common_vendor.f($data.repairTypes, (item, index, i0) => {
      return {
        a: item.value,
        b: $data.formData.repairType === item.value,
        c: common_vendor.t(item.label),
        d: index
      };
    }),
    r: common_vendor.o((...args) => $options.onRepairTypeChange && $options.onRepairTypeChange(...args)),
    s: $data.formData.repairType === "mail"
  }, $data.formData.repairType === "mail" ? {
    t: $data.formData.repairAddress,
    v: common_vendor.o(($event) => $data.formData.repairAddress = $event.detail.value)
  } : {}, {
    w: $data.formData.contactName,
    x: common_vendor.o(($event) => $data.formData.contactName = $event.detail.value),
    y: $data.formData.contactPhone,
    z: common_vendor.o(($event) => $data.formData.contactPhone = $event.detail.value),
    A: $data.formData.remark,
    B: common_vendor.o(($event) => $data.formData.remark = $event.detail.value),
    C: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/repair.js.map
