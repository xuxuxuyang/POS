"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      id: null,
      activity: {
        id: 1,
        name: "新人特惠",
        description: "新用户首次申请POS机，享受押金减免50%，还有多重好礼相送！",
        dateRange: "2023.6.1-2023.12.31",
        status: "ongoing",
        image: "https://img01.yzcdn.cn/vant/cat.jpeg",
        target: "首次申请POS机的新用户",
        content: '<p style="text-indent:2em;margin-bottom:15px;">为回馈广大新用户对我们的支持与信任，特推出"新人特惠"活动，让您以更低的成本体验优质的POS机服务。</p><p style="text-indent:2em;margin-bottom:15px;">活动期间，新用户首次申请POS机，可享受押金减免50%的优惠，最高可省500元！同时，还可获得多重好礼：</p><p style="margin-bottom:15px;font-weight:bold;">活动福利：</p><p style="margin-left:20px;margin-bottom:10px;">1. POS机押金减免50%，最高可省500元</p><p style="margin-left:20px;margin-bottom:10px;">2. 首月交易免手续费</p><p style="margin-left:20px;margin-bottom:10px;">3. 精美收银盒一个</p><p style="margin-left:20px;margin-bottom:10px;">4. 热敏纸5卷</p><p style="text-indent:2em;margin-top:20px;">心动不如行动，立即申请，享受新人特惠吧！</p>',
        rules: [
          "活动时间：2023年6月1日至2023年12月31日",
          "活动对象：首次申请POS机的新用户",
          "押金减免活动仅限首次申请，每个用户仅可参与一次",
          "首月交易免手续费指自设备激活之日起30天内",
          "活动礼品将随设备一起寄出",
          "本公司保留对活动的最终解释权"
        ],
        products: [
          {
            id: 1,
            name: "智能POS机A1 Pro",
            price: "1580",
            image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png"
          },
          {
            id: 2,
            name: "移动POS机B2 Plus",
            price: "980",
            image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png"
          },
          {
            id: 3,
            name: "多功能收款机C3",
            price: "2680",
            image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png"
          }
        ]
      }
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.fetchActivityDetail();
    }
  },
  methods: {
    fetchActivityDetail() {
      common_vendor.index.__f__("log", "at pages/activity/detail.vue:151", "获取活动详情，ID:", this.id);
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
      }, 500);
    },
    getStatusText(status) {
      switch (status) {
        case "ongoing":
          return "进行中";
        case "upcoming":
          return "即将开始";
        case "expired":
          return "已结束";
        default:
          return "";
      }
    },
    goToProductDetail(product) {
      common_vendor.index.navigateTo({
        url: "/pages/product/detail?id=" + product.id
      });
    },
    shareActivity() {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    },
    joinActivity() {
      if (this.activity.status === "expired") {
        common_vendor.index.showToast({
          title: "活动已结束",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/apply/index?activityId=" + this.activity.id
      });
    }
  },
  // 分享功能
  onShareAppMessage() {
    return {
      title: this.activity.name,
      path: "/pages/activity/detail?id=" + this.activity.id,
      imageUrl: this.activity.image
    };
  },
  onShareTimeline() {
    return {
      title: this.activity.name,
      query: "id=" + this.activity.id,
      imageUrl: this.activity.image
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.activity.image,
    b: common_vendor.t($options.getStatusText($data.activity.status)),
    c: $data.activity.status === "expired" ? 1 : "",
    d: common_vendor.t($data.activity.name),
    e: common_vendor.t($data.activity.dateRange),
    f: common_vendor.t($data.activity.target),
    g: $data.activity.content,
    h: common_vendor.f($data.activity.rules, (rule, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(rule),
        c: index
      };
    }),
    i: $data.activity.products && $data.activity.products.length > 0
  }, $data.activity.products && $data.activity.products.length > 0 ? {
    j: common_vendor.f($data.activity.products, (product, index, i0) => {
      return {
        a: product.image,
        b: common_vendor.t(product.name),
        c: common_vendor.t(product.price),
        d: index,
        e: common_vendor.o(($event) => $options.goToProductDetail(product), index)
      };
    })
  } : {}, {
    k: common_vendor.o((...args) => $options.shareActivity && $options.shareActivity(...args)),
    l: common_vendor.t($data.activity.status === "expired" ? "活动已结束" : "立即参与"),
    m: $data.activity.status === "expired" ? 1 : "",
    n: $data.activity.status === "expired",
    o: common_vendor.o((...args) => $options.joinActivity && $options.joinActivity(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/activity/detail.js.map
