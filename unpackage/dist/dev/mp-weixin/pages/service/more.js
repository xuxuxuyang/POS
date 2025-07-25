"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      deviceServices: [
        {
          name: "设备激活",
          icon: "https://cdn-icons-png.flaticon.com/128/1728/1728853.png",
          url: "/pages/service/activate"
        },
        {
          name: "设备更换",
          icon: "https://cdn-icons-png.flaticon.com/128/2972/2972528.png",
          url: "/pages/service/replace"
        },
        {
          name: "维修申请",
          icon: "https://cdn-icons-png.flaticon.com/128/1584/1584812.png",
          url: "/pages/service/repair"
        },
        {
          name: "固件升级",
          icon: "https://cdn-icons-png.flaticon.com/128/2991/2991112.png",
          url: "/pages/service/upgrade"
        }
      ],
      merchantServices: [
        {
          name: "商户入网",
          icon: "https://cdn-icons-png.flaticon.com/128/2897/2897785.png",
          url: "/pages/merchant/register"
        },
        {
          name: "资料变更",
          icon: "https://cdn-icons-png.flaticon.com/128/686/686589.png",
          url: "/pages/merchant/update"
        },
        {
          name: "结算查询",
          icon: "https://cdn-icons-png.flaticon.com/128/6569/6569264.png",
          url: "/pages/merchant/settlement"
        },
        {
          name: "费率查询",
          icon: "https://cdn-icons-png.flaticon.com/128/9394/9394580.png",
          url: "/pages/merchant/rate"
        }
      ],
      valueAddedServices: [
        {
          name: "流量充值",
          icon: "https://cdn-icons-png.flaticon.com/128/1968/1968666.png",
          url: "/pages/value/recharge"
        },
        {
          name: "保险服务",
          icon: "https://cdn-icons-png.flaticon.com/128/2279/2279710.png",
          url: "/pages/value/insurance"
        },
        {
          name: "SaaS服务",
          icon: "https://cdn-icons-png.flaticon.com/128/7518/7518748.png",
          url: "/pages/value/saas"
        },
        {
          name: "增值代理",
          icon: "https://cdn-icons-png.flaticon.com/128/3347/3347960.png",
          url: "/pages/value/agent"
        }
      ],
      recommendServices: [
        {
          name: "聚合收款解决方案",
          desc: "支持微信、支付宝、银联等多种支付方式",
          banner: "https://cdn-icons-png.flaticon.com/128/9358/9358847.png",
          url: "/pages/solution/payment",
          tag: "热门"
        },
        {
          name: "商户管理系统",
          desc: "一站式商户管理平台，提高运营效率",
          banner: "https://cdn-icons-png.flaticon.com/128/7268/7268615.png",
          url: "/pages/solution/management"
        },
        {
          name: "POS机租赁服务",
          desc: "低门槛享受专业POS服务",
          banner: "https://cdn-icons-png.flaticon.com/128/5673/5673159.png",
          url: "/pages/solution/rental"
        }
      ]
    };
  },
  methods: {
    // 页面导航
    navigateTo(url) {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo && !url.includes("/pages/help/") && !url.includes("/pages/guide/")) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再使用该服务",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.switchTab({
                url: "/pages/user/index"
              });
            }
          }
        });
        return;
      }
      if (url.includes("/pages/merchant/") || url.includes("/pages/value/") || url.includes("/pages/solution/")) {
        common_vendor.index.showToast({
          title: "该功能正在开发中，敬请期待",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/service/more.vue:224", "导航失败", err);
          common_vendor.index.showToast({
            title: "页面不存在或正在开发中",
            icon: "none"
          });
        }
      });
    },
    // 联系客服
    contactCustomerService() {
      common_vendor.index.showActionSheet({
        itemList: ["在线客服", "电话客服"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.showToast({
              title: "正在接入在线客服...",
              icon: "none"
            });
          } else if (res.tapIndex === 1) {
            common_vendor.index.makePhoneCall({
              phoneNumber: "400-123-4567",
              fail: () => {
                common_vendor.index.showToast({
                  title: "拨打失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.deviceServices, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      };
    }),
    b: common_vendor.f($data.merchantServices, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      };
    }),
    c: common_vendor.f($data.valueAddedServices, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      };
    }),
    d: common_vendor.f($data.recommendServices, (item, index, i0) => {
      return common_vendor.e({
        a: item.banner,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.desc),
        d: item.tag
      }, item.tag ? {
        e: common_vendor.t(item.tag)
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      });
    }),
    e: common_vendor.o((...args) => $options.contactCustomerService && $options.contactCustomerService(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/more.js.map
