"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    const today = /* @__PURE__ */ new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 30);
    return {
      serviceTypes: [
        {
          name: "安装调试",
          desc: "专业安装调试POS机",
          icon: "https://cdn-icons-png.flaticon.com/128/3176/3176355.png"
        },
        {
          name: "培训指导",
          desc: "提供POS机使用培训",
          icon: "https://cdn-icons-png.flaticon.com/128/3050/3050374.png"
        },
        {
          name: "故障检修",
          desc: "解决POS机使用故障",
          icon: "https://cdn-icons-png.flaticon.com/128/6308/6308034.png"
        },
        {
          name: "系统升级",
          desc: "升级POS机软件系统",
          icon: "https://cdn-icons-png.flaticon.com/128/6348/6348650.png"
        }
      ],
      selectedType: 0,
      deviceModels: ["P1系列", "P2系列", "P3系列", "P4系列", "其他型号"],
      timeSlots: ["上午 9:00-12:00", "下午 13:00-16:00", "傍晚 16:00-18:00"],
      minDate: this.formatDate(tomorrow),
      maxDate: this.formatDate(maxDay),
      appointmentInfo: {
        name: "",
        phone: "",
        merchant: "",
        deviceModelIndex: 0,
        date: "",
        timeSlotIndex: 0,
        remark: ""
      }
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
      if (userInfoObj.nickName) {
        this.appointmentInfo.name = userInfoObj.nickName;
      }
      if (userInfoObj.phone) {
        this.appointmentInfo.phone = userInfoObj.phone;
      }
      if (userInfoObj.merchantName) {
        this.appointmentInfo.merchant = userInfoObj.merchantName;
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at pages/service/appointment.vue:232", "解析用户信息失败", e);
    }
    this.appointmentInfo.date = this.minDate;
  },
  methods: {
    // 选择服务类型
    selectServiceType(index) {
      this.selectedType = index;
    },
    // 设备型号选择
    onDeviceModelChange(e) {
      this.appointmentInfo.deviceModelIndex = e.detail.value;
    },
    // 日期选择
    onDateChange(e) {
      this.appointmentInfo.date = e.detail.value;
    },
    // 时间段选择
    onTimeSlotChange(e) {
      this.appointmentInfo.timeSlotIndex = e.detail.value;
    },
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 提交预约
    submitAppointment() {
      if (!this.appointmentInfo.name) {
        this.showToast("请输入联系人姓名");
        return;
      }
      if (!this.appointmentInfo.phone) {
        this.showToast("请输入联系电话");
        return;
      }
      if (!/^1\d{10}$/.test(this.appointmentInfo.phone)) {
        this.showToast("请输入正确的手机号");
        return;
      }
      if (!this.appointmentInfo.merchant) {
        this.showToast("请输入商户名称");
        return;
      }
      if (!this.appointmentInfo.date) {
        this.showToast("请选择预约日期");
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      const appointmentData = {
        serviceType: this.serviceTypes[this.selectedType].name,
        name: this.appointmentInfo.name,
        phone: this.appointmentInfo.phone,
        merchant: this.appointmentInfo.merchant,
        deviceModel: this.deviceModels[this.appointmentInfo.deviceModelIndex],
        appointmentDate: this.appointmentInfo.date,
        appointmentTime: this.timeSlots[this.appointmentInfo.timeSlotIndex],
        remark: this.appointmentInfo.remark,
        createTime: /* @__PURE__ */ new Date(),
        status: "pending"
        // 待确认状态
      };
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pages/service/appointment.vue:320", "提交预约信息", appointmentData);
        common_vendor.index.showModal({
          title: "预约提交成功",
          content: "您的服务预约已提交成功，工作人员将会在1个工作日内与您联系确认详情。",
          showCancel: false,
          confirmText: "我知道了",
          success: () => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
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
  return {
    a: common_vendor.f($data.serviceTypes, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.desc),
        d: index,
        e: $data.selectedType === index ? 1 : "",
        f: common_vendor.o(($event) => $options.selectServiceType(index), index)
      };
    }),
    b: $data.appointmentInfo.name,
    c: common_vendor.o(($event) => $data.appointmentInfo.name = $event.detail.value),
    d: $data.appointmentInfo.phone,
    e: common_vendor.o(($event) => $data.appointmentInfo.phone = $event.detail.value),
    f: $data.appointmentInfo.merchant,
    g: common_vendor.o(($event) => $data.appointmentInfo.merchant = $event.detail.value),
    h: common_vendor.t($data.deviceModels[$data.appointmentInfo.deviceModelIndex] || "请选择设备型号"),
    i: $data.deviceModels,
    j: common_vendor.o((...args) => $options.onDeviceModelChange && $options.onDeviceModelChange(...args)),
    k: common_vendor.t($data.appointmentInfo.date || "请选择日期"),
    l: $data.appointmentInfo.date,
    m: $data.minDate,
    n: $data.maxDate,
    o: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    p: common_vendor.t($data.timeSlots[$data.appointmentInfo.timeSlotIndex] || "请选择时间段"),
    q: $data.timeSlots,
    r: common_vendor.o((...args) => $options.onTimeSlotChange && $options.onTimeSlotChange(...args)),
    s: !$data.appointmentInfo.date,
    t: $data.appointmentInfo.remark,
    v: common_vendor.o(($event) => $data.appointmentInfo.remark = $event.detail.value),
    w: common_vendor.o((...args) => $options.submitAppointment && $options.submitAppointment(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/appointment.js.map
