"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      banners: [
        {
          id: 1,
          image: "/static/banner/lb1.png",
          url: "/pages/activity/detail?id=1"
        },
        {
          id: 2,
          image: "/static/banner/lb2.png",
          url: "/pages/activity/detail?id=2"
        }
      ],
      notices: [
        { id: 1, content: "新品上市：智能POS机A2，支持人脸识别支付" },
        { id: 2, content: "活动公告：新用户首次申请，押金减免50%" },
        { id: 3, content: "累计装机10000台，感谢您的支持" }
      ],
      categories: [
        {
          id: 1,
          name: "传统POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2331/2331717.png"
        },
        {
          id: 2,
          name: "智能POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2038/2038792.png"
        },
        {
          id: 3,
          name: "移动POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2496/2496153.png"
        },
        {
          id: 4,
          name: "刷卡机",
          icon: "https://cdn-icons-png.flaticon.com/128/6475/6475714.png"
        }
      ],
      hotProducts: [
        {
          id: 1,
          name: "智能POS机A1 Pro",
          desc: "激活退押金",
          price: "99",
          tags: ["秒到账", "轻薄小巧", "彩色液晶"],
          image: "/static/banner/99.png"
        },
        {
          id: 2,
          name: "乐积分4G传统199版A",
          desc: "激活退押金",
          price: "199",
          tags: ["秒到账", "可出票", "屏幕手写"],
          image: "/static/banner/199-2.png"
        },
        {
          id: 3,
          name: "乐积分微智能电签199版A",
          desc: "激活退押金",
          price: "199",
          tags: ["秒到账", "3.5寸大屏", "支持触控"],
          image: "/static/banner/199.png"
        }
      ],
      activities: [
        {
          id: 1,
          title: "新人特惠",
          dateRange: "2023.6.1-2023.6.30",
          image: "https://img01.yzcdn.cn/vant/cat.jpeg"
        },
        {
          id: 2,
          title: "618促销季",
          dateRange: "2023.6.1-2023.6.18",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
        },
        {
          id: 3,
          title: "夏日大促",
          dateRange: "2023.7.1-2023.7.31",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"
        }
      ],
      guideItems: [
        {
          name: "申请流程",
          icon: "/static/banner/sqlc.png",
          url: "/pages/guide/apply"
        },
        {
          name: "使用教程",
          icon: "/static/banner/syjc.png",
          url: "/pages/guide/usage"
        },
        {
          name: "售后服务",
          icon: "/static/banner/shfw.png",
          url: "/pages/service/after-sale"
        },
        {
          name: "常见问题",
          icon: "/static/banner/cjwt.png",
          url: "/pages/help/index"
        }
      ]
    };
  },
  onLoad() {
    this.fetchHomeData();
  },
  onPullDownRefresh() {
    this.fetchHomeData();
    setTimeout(() => {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  },
  methods: {
    fetchHomeData() {
      common_vendor.index.__f__("log", "at pages/index/index.vue:301", "获取首页数据");
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:304", "数据加载完成");
      }, 500);
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/index"
      });
    },
    goToBannerDetail(banner) {
      common_vendor.index.navigateTo({
        url: "/pages/apply/index?bannerId=" + banner.id
      });
    },
    goToCategory(category) {
      common_vendor.index.navigateTo({
        url: "/pages/product/list?category=" + category.id + "&categoryName=" + category.name
      });
    },
    goToProductList() {
      common_vendor.index.switchTab({
        url: "/pages/product/list"
      });
    },
    goToProductDetail(product) {
      common_vendor.index.navigateTo({
        url: "/pages/apply/index?productId=" + product.id
      });
    },
    goToActivityList() {
      common_vendor.index.navigateTo({
        url: "/pages/activity/list"
      });
    },
    goToActivity(activity) {
      common_vendor.index.navigateTo({
        url: "/pages/activity/detail?id=" + activity.id
      });
    },
    goToApply() {
      common_vendor.index.navigateTo({
        url: "/pages/apply/index"
      });
    },
    goToHelp() {
      common_vendor.index.navigateTo({
        url: "/pages/help/index"
      });
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    quickApply(product) {
      common_vendor.index.navigateTo({
        url: "/pages/apply/index?productId=" + product.id
      });
    },
    goToPromoter() {
      common_vendor.index.navigateTo({
        url: "/pages/promoter/index"
      });
    },
    contactService() {
      common_vendor.index.showToast({
        title: "正在连接客服...",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    b: common_vendor.f($data.banners, (item, index, i0) => {
      return {
        a: item.image,
        b: index,
        c: common_vendor.o(($event) => $options.goToBannerDetail(item), index)
      };
    }),
    c: common_vendor.f($data.notices, (notice, index, i0) => {
      return {
        a: common_vendor.t(notice.content),
        b: index
      };
    }),
    d: common_vendor.f($data.hotProducts, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        d: common_vendor.t(item.desc),
        e: common_vendor.t(item.price),
        f: common_vendor.o(($event) => $options.quickApply(item), index),
        g: index,
        h: common_vendor.o(($event) => $options.goToProductDetail(item), index)
      };
    }),
    e: common_vendor.f($data.guideItems, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      };
    }),
    f: common_assets._imports_0,
    g: common_vendor.o((...args) => $options.contactService && $options.contactService(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
