"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      steps: [
        {
          title: "选择产品",
          desc: "浏览POS机产品，根据自身需求选择合适的机型。",
          image: "https://cdn-icons-png.flaticon.com/128/10701/10701415.png"
        },
        {
          title: "填写信息",
          desc: "填写个人或企业信息，上传必要的证件照片。",
          image: "https://cdn-icons-png.flaticon.com/128/2666/2666505.png"
        },
        {
          title: "支付押金",
          desc: "根据所选产品支付相应的押金费用。",
          image: "https://cdn-icons-png.flaticon.com/128/4221/4221837.png"
        },
        {
          title: "等待审核",
          desc: "我们将在1-3个工作日内完成审核。",
          image: "https://cdn-icons-png.flaticon.com/128/8312/8312499.png"
        },
        {
          title: "等待发货",
          desc: "审核通过后，我们将为您安排发货。",
          image: "https://cdn-icons-png.flaticon.com/128/2463/2463498.png"
        }
      ],
      tips: [
        "准备好有效的身份证件，确保信息真实有效",
        "企业申请需要提供营业执照等相关资质",
        "押金将在设备归还后返还给您",
        "如有疑问可随时联系在线客服"
      ]
    };
  },
  methods: {
    goToApply() {
      common_vendor.index.navigateTo({
        url: "/pages/apply/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.steps, (step, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: common_vendor.t(step.title),
        c: common_vendor.t(step.desc),
        d: step.image
      }, step.image ? {
        e: step.image
      } : {}, {
        f: index
      });
    }),
    b: common_vendor.f($data.tips, (tip, index, i0) => {
      return {
        a: common_vendor.t(tip),
        b: index
      };
    }),
    c: common_vendor.o((...args) => $options.goToApply && $options.goToApply(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/apply.js.map
