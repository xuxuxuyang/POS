"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentTab: 0,
      tabs: [{ name: "服务政策" }, { name: "维修申请" }, { name: "维修网点" }],
      policies: [
        {
          name: "全国联保",
          desc: "全国范围内享受统一的售后服务",
          icon: "https://cdn-icons-png.flaticon.com/128/1255/1255391.png"
        },
        {
          name: "免费保修",
          desc: "标准一年保修，部分产品延长至两年",
          icon: "https://cdn-icons-png.flaticon.com/128/2942/2942834.png"
        },
        {
          name: "7天包换",
          desc: "设备非人为损坏，7天内可申请更换",
          icon: "https://cdn-icons-png.flaticon.com/128/5639/5639670.png"
        },
        {
          name: "上门服务",
          desc: "特定区域可提供免费上门维修服务",
          icon: "https://cdn-icons-png.flaticon.com/128/2830/2830178.png"
        }
      ],
      warrantyInfo: [
        { label: "保修期限", value: "整机1年，主板2年" },
        { label: "电池保修", value: "6个月" },
        { label: "配件保修", value: "3个月（电源适配器、数据线等）" },
        { label: "延保服务", value: "可选购1-2年延长保修服务" }
      ],
      repairForm: {
        model: "",
        sn: "",
        purchaseDate: "",
        problem: "",
        contact: "",
        serviceType: "mail"
      },
      serviceTypes: [
        { name: "邮寄维修", value: "mail" },
        { name: "网点自送", value: "self" },
        { name: "上门服务（仅限特定区域）", value: "door" }
      ],
      selectedRegion: ["广东省", "广州市", "天河区"],
      serviceLocations: [
        {
          name: "广州天河服务中心",
          address: "广州市天河区天河路385号太古汇商场4楼401室",
          phone: "020-88889999",
          businessHours: "10:00-21:00",
          latitude: 23.132324,
          longitude: 113.327104
        },
        {
          name: "广州越秀服务中心",
          address: "广州市越秀区中山五路68号正佳广场5楼506室",
          phone: "020-88889998",
          businessHours: "10:00-21:00",
          latitude: 23.128596,
          longitude: 113.320204
        }
      ]
    };
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
    },
    onDateChange(e) {
      this.repairForm.purchaseDate = e.detail.value;
    },
    onServiceTypeChange(e) {
      this.repairForm.serviceType = e.detail.value;
    },
    submitRepairForm() {
      if (!this.repairForm.model) {
        common_vendor.index.showToast({
          title: "请输入设备型号",
          icon: "none"
        });
        return;
      }
      if (!this.repairForm.sn) {
        common_vendor.index.showToast({
          title: "请输入设备SN码",
          icon: "none"
        });
        return;
      }
      if (!this.repairForm.purchaseDate) {
        common_vendor.index.showToast({
          title: "请选择购买日期",
          icon: "none"
        });
        return;
      }
      if (!this.repairForm.problem) {
        common_vendor.index.showToast({
          title: "请描述设备问题",
          icon: "none"
        });
        return;
      }
      if (!this.repairForm.contact) {
        common_vendor.index.showToast({
          title: "请输入联系方式",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        this.repairForm = {
          model: "",
          sn: "",
          purchaseDate: "",
          problem: "",
          contact: "",
          serviceType: "mail"
        };
      }, 1500);
    },
    onRegionChange(e) {
      this.selectedRegion = e.detail.value;
      if (this.selectedRegion[1] === "广州市") {
        this.serviceLocations = [
          {
            name: "广州天河服务中心",
            address: "广州市天河区天河路385号太古汇商场4楼401室",
            phone: "020-88889999",
            businessHours: "10:00-21:00",
            latitude: 23.132324,
            longitude: 113.327104
          },
          {
            name: "广州越秀服务中心",
            address: "广州市越秀区中山五路68号正佳广场5楼506室",
            phone: "020-88889998",
            businessHours: "10:00-21:00",
            latitude: 23.128596,
            longitude: 113.320204
          }
        ];
      } else {
        this.serviceLocations = [];
      }
    },
    callPhone(phone) {
      common_vendor.index.makePhoneCall({
        phoneNumber: phone
      });
    },
    openMap(location) {
      common_vendor.index.openLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        address: location.address,
        scale: 18
      });
    },
    callServicePhone() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "4008888888"
      });
    },
    contactOnlineService() {
      common_vendor.index.showToast({
        title: "正在连接客服...",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    b: $data.currentTab === 0
  }, $data.currentTab === 0 ? {
    c: common_vendor.f($data.policies, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.desc),
        d: index
      };
    }),
    d: common_vendor.f($data.warrantyInfo, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: common_vendor.t(item.value),
        c: index
      };
    })
  } : {}, {
    e: $data.currentTab === 1
  }, $data.currentTab === 1 ? {
    f: $data.repairForm.model,
    g: common_vendor.o(($event) => $data.repairForm.model = $event.detail.value),
    h: $data.repairForm.sn,
    i: common_vendor.o(($event) => $data.repairForm.sn = $event.detail.value),
    j: common_vendor.t($data.repairForm.purchaseDate || "请选择购买日期"),
    k: $data.repairForm.purchaseDate,
    l: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    m: $data.repairForm.problem,
    n: common_vendor.o(($event) => $data.repairForm.problem = $event.detail.value),
    o: $data.repairForm.contact,
    p: common_vendor.o(($event) => $data.repairForm.contact = $event.detail.value),
    q: common_vendor.f($data.serviceTypes, (item, index, i0) => {
      return {
        a: item.value,
        b: $data.repairForm.serviceType === item.value,
        c: common_vendor.t(item.name),
        d: index
      };
    }),
    r: common_vendor.o((...args) => $options.onServiceTypeChange && $options.onServiceTypeChange(...args)),
    s: common_vendor.o((...args) => $options.submitRepairForm && $options.submitRepairForm(...args))
  } : {}, {
    t: $data.currentTab === 2
  }, $data.currentTab === 2 ? common_vendor.e({
    v: common_vendor.t($data.selectedRegion[0]),
    w: common_vendor.t($data.selectedRegion[1]),
    x: common_vendor.t($data.selectedRegion[2]),
    y: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args)),
    z: $data.selectedRegion,
    A: $data.serviceLocations.length === 0
  }, $data.serviceLocations.length === 0 ? {} : {}, {
    B: common_vendor.f($data.serviceLocations, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.address),
        c: common_vendor.t(item.phone),
        d: common_vendor.t(item.businessHours),
        e: common_vendor.o(($event) => $options.callPhone(item.phone), index),
        f: common_vendor.o(($event) => $options.openMap(item), index),
        g: index
      };
    })
  }) : {}, {
    C: common_vendor.o((...args) => $options.callServicePhone && $options.callServicePhone(...args)),
    D: common_vendor.o((...args) => $options.contactOnlineService && $options.contactOnlineService(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/after-sale.js.map
