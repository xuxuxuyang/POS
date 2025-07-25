"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKey: "",
      activeCategory: "all",
      loading: false,
      hasMore: true,
      categories: [
        {
          id: "all",
          name: "全部",
          icon: "https://cdn-icons-png.flaticon.com/128/471/471662.png"
        },
        {
          id: "newbie",
          name: "新手入门",
          icon: "https://cdn-icons-png.flaticon.com/128/2618/2618477.png"
        },
        {
          id: "basic",
          name: "基础操作",
          icon: "https://cdn-icons-png.flaticon.com/128/1001/1001371.png"
        },
        {
          id: "advanced",
          name: "高级功能",
          icon: "https://cdn-icons-png.flaticon.com/128/9464/9464085.png"
        },
        {
          id: "payment",
          name: "收款管理",
          icon: "https://cdn-icons-png.flaticon.com/128/2331/2331941.png"
        },
        {
          id: "settlement",
          name: "结算教程",
          icon: "https://cdn-icons-png.flaticon.com/128/3310/3310624.png"
        },
        {
          id: "security",
          name: "安全指南",
          icon: "https://cdn-icons-png.flaticon.com/128/2853/2853426.png"
        }
      ],
      hotGuides: [
        {
          id: "g001",
          title: "POS机激活教程 - 快速上手",
          description: "详细讲解POS机首次激活流程及注意事项",
          cover: "https://cdn-icons-png.flaticon.com/128/7011/7011432.png",
          category: "newbie",
          views: 1245,
          duration: "5分钟",
          isNew: true,
          isRecommend: true
        },
        {
          id: "g002",
          title: "如何处理刷卡失败问题",
          description: "解决POS机常见的刷卡失败问题及解决方法",
          cover: "https://cdn-icons-png.flaticon.com/128/2161/2161491.png",
          category: "basic",
          views: 986,
          duration: "3分钟",
          isNew: false,
          isRecommend: true
        },
        {
          id: "g003",
          title: "商户结算周期与费率说明",
          description: "了解商户结算周期与费率计算方式",
          cover: "https://cdn-icons-png.flaticon.com/128/2965/2965267.png",
          category: "settlement",
          views: 759,
          duration: "7分钟",
          isNew: false,
          isRecommend: false
        }
      ],
      guides: [
        {
          id: "g001",
          title: "POS机激活教程 - 快速上手",
          description: "详细讲解POS机首次激活流程及注意事项",
          cover: "https://cdn-icons-png.flaticon.com/128/7011/7011432.png",
          category: "newbie",
          views: 1245,
          duration: "5分钟",
          isNew: true,
          isRecommend: true
        },
        {
          id: "g002",
          title: "如何处理刷卡失败问题",
          description: "解决POS机常见的刷卡失败问题及解决方法",
          cover: "https://cdn-icons-png.flaticon.com/128/2161/2161491.png",
          category: "basic",
          views: 986,
          duration: "3分钟",
          isNew: false,
          isRecommend: true
        },
        {
          id: "g003",
          title: "商户结算周期与费率说明",
          description: "了解商户结算周期与费率计算方式",
          cover: "https://cdn-icons-png.flaticon.com/128/2965/2965267.png",
          category: "settlement",
          views: 759,
          duration: "7分钟",
          isNew: false,
          isRecommend: false
        },
        {
          id: "g004",
          title: "POS机日常维护指南",
          description: "教您如何正确维护POS机，延长使用寿命",
          cover: "https://cdn-icons-png.flaticon.com/128/2421/2421989.png",
          category: "basic",
          views: 632,
          duration: "4分钟",
          isNew: false,
          isRecommend: false
        },
        {
          id: "g005",
          title: "如何使用NFC非接触支付",
          description: "详解NFC非接触式支付的设置与使用方法",
          cover: "https://cdn-icons-png.flaticon.com/128/2504/2504763.png",
          category: "advanced",
          views: 487,
          duration: "3分钟",
          isNew: true,
          isRecommend: false
        },
        {
          id: "g006",
          title: "POS机交易明细查询与导出",
          description: "学习如何查询和导出POS机交易记录",
          cover: "https://cdn-icons-png.flaticon.com/128/9464/9464989.png",
          category: "basic",
          views: 412,
          duration: "6分钟",
          isNew: false,
          isRecommend: false
        },
        {
          id: "g007",
          title: "商户结算账户设置指南",
          description: "正确设置和管理您的结算账户",
          cover: "https://cdn-icons-png.flaticon.com/128/6731/6731626.png",
          category: "settlement",
          views: 368,
          duration: "5分钟",
          isNew: false,
          isRecommend: true
        },
        {
          id: "g008",
          title: "POS机安全使用守则",
          description: "了解POS机安全使用的注意事项与防范措施",
          cover: "https://cdn-icons-png.flaticon.com/128/1785/1785274.png",
          category: "security",
          views: 329,
          duration: "8分钟",
          isNew: false,
          isRecommend: false
        },
        {
          id: "g009",
          title: "如何设置商户信息",
          description: "详细指导商户信息的设置步骤与注意事项",
          cover: "https://cdn-icons-png.flaticon.com/128/686/686352.png",
          category: "newbie",
          views: 295,
          duration: "4分钟",
          isNew: false,
          isRecommend: false
        },
        {
          id: "g010",
          title: "移动支付与扫码收款教程",
          description: "掌握移动支付和扫码收款的完整操作流程",
          cover: "https://cdn-icons-png.flaticon.com/128/2645/2645233.png",
          category: "payment",
          views: 278,
          duration: "6分钟",
          isNew: true,
          isRecommend: true
        }
      ],
      faqs: [
        {
          id: "f001",
          question: "POS机无法连接网络怎么办？",
          answer: "请检查网络设置是否正确，Wi-Fi信号是否正常，或尝试重启POS机。如果问题依然存在，请联系客服。"
        },
        {
          id: "f002",
          question: "交易成功但未收到款项怎么处理？",
          answer: "请查看交易记录确认交易是否成功，检查结算账户信息是否正确，并联系客服提供交易凭证进行核查。"
        },
        {
          id: "f003",
          question: "POS机打印纸如何更换？",
          answer: "打开POS机顶部打印仓盖，取出用完的纸卷芯，装入新纸卷，保持纸面朝上，合上打印仓盖，拉出少量纸张即可。"
        },
        {
          id: "f004",
          question: "如何申请POS机退款？",
          answer: "在交易记录中找到需要退款的订单，点击退款操作，按照提示完成验证，系统将在1-3个工作日内处理退款。"
        },
        {
          id: "f005",
          question: "POS机电池续航时间短怎么解决？",
          answer: "请降低屏幕亮度，关闭不必要的功能，避免在极端温度环境使用，并定期校准电池。如问题严重，可能需要更换电池。"
        }
      ]
    };
  },
  computed: {
    // 根据当前分类和搜索关键词过滤教程
    filteredGuides() {
      let result = this.guides;
      if (this.activeCategory !== "all") {
        result = result.filter((item) => item.category === this.activeCategory);
      }
      if (this.searchKey.trim()) {
        const key = this.searchKey.trim().toLowerCase();
        result = result.filter(
          (item) => item.title.toLowerCase().includes(key) || item.description.toLowerCase().includes(key)
        );
      }
      return result;
    }
  },
  onLoad() {
    this.loadGuideData();
  },
  onPullDownRefresh() {
    this.refreshData();
  },
  methods: {
    // 加载教程数据
    loadGuideData() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        this.loading = false;
        this.hasMore = false;
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    },
    // 刷新数据
    refreshData() {
      this.searchKey = "";
      this.activeCategory = "all";
      this.loadGuideData();
    },
    // 切换分类
    switchCategory(categoryId) {
      this.activeCategory = categoryId;
      this.searchKey = "";
      this.loadGuideData();
    },
    // 获取当前分类名称
    getCurrentCategoryName() {
      if (this.activeCategory === "all") {
        if (this.searchKey.trim()) {
          return "搜索结果";
        }
        return "全部教程";
      }
      const category = this.categories.find(
        (item) => item.id === this.activeCategory
      );
      return category ? category.name : "全部教程";
    },
    // 搜索教程
    searchGuides() {
      if (!this.searchKey.trim()) {
        this.showToast("请输入搜索关键词");
        return;
      }
      this.activeCategory = "all";
      common_vendor.index.hideKeyboard();
    },
    // 加载更多
    loadMore() {
      if (this.loading || !this.hasMore)
        return;
      this.loading = true;
      this.loadGuideData();
    },
    // 查看教程详情
    viewGuide(guide) {
      common_vendor.index.navigateTo({
        url: `/pages/guide/detail?id=${guide.id}`
      });
    },
    // 查看FAQ详情
    viewFaq(faq) {
      common_vendor.index.navigateTo({
        url: `/pages/help/detail?id=${faq.id}&type=faq`
      });
    },
    // 导航到指定页面
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    // 联系客服
    contactCustomerService() {
      common_vendor.index.showActionSheet({
        itemList: ["在线客服", "电话客服"],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.showToast("正在接入在线客服...");
          } else if (res.tapIndex === 1) {
            common_vendor.index.makePhoneCall({
              phoneNumber: "400-123-4567",
              fail: () => {
                this.showToast("拨打失败");
              }
            });
          }
        }
      });
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
    a: common_vendor.o((...args) => $options.searchGuides && $options.searchGuides(...args)),
    b: $data.searchKey,
    c: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    d: common_vendor.o((...args) => $options.searchGuides && $options.searchGuides(...args)),
    e: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: $data.activeCategory === item.id ? 1 : "",
        d: item.id,
        e: common_vendor.o(($event) => $options.switchCategory(item.id), item.id)
      };
    }),
    f: $data.activeCategory === "all"
  }, $data.activeCategory === "all" ? {
    g: common_vendor.f($data.hotGuides, (item, index, i0) => {
      return common_vendor.e({
        a: item.cover,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.views),
        d: item.isNew
      }, item.isNew ? {} : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.viewGuide(item), index)
      });
    })
  } : {}, {
    h: common_vendor.t($options.getCurrentCategoryName()),
    i: $data.activeCategory === "all"
  }, $data.activeCategory === "all" ? {
    j: common_vendor.o(($event) => $options.switchCategory("all"))
  } : {}, {
    k: common_vendor.f($options.filteredGuides, (item, index, i0) => {
      return common_vendor.e({
        a: item.cover,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.description),
        d: common_vendor.t(item.views),
        e: common_vendor.t(item.duration),
        f: item.isNew
      }, item.isNew ? {} : {}, {
        g: item.isRecommend
      }, item.isRecommend ? {} : {}, {
        h: index,
        i: common_vendor.o(($event) => $options.viewGuide(item), index)
      });
    }),
    l: $options.filteredGuides.length === 0
  }, $options.filteredGuides.length === 0 ? {} : {}, {
    m: $data.hasMore && $options.filteredGuides.length > 0
  }, $data.hasMore && $options.filteredGuides.length > 0 ? {
    n: common_vendor.t($data.loading ? "加载中..." : "加载更多"),
    o: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    p: $data.activeCategory === "all"
  }, $data.activeCategory === "all" ? {
    q: common_vendor.o(($event) => $options.navigateTo("/pages/help/index")),
    r: common_vendor.f($data.faqs, (item, index, i0) => {
      return {
        a: common_vendor.t(item.question),
        b: index,
        c: common_vendor.o(($event) => $options.viewFaq(item), index)
      };
    })
  } : {}, {
    s: common_vendor.o((...args) => $options.contactCustomerService && $options.contactCustomerService(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/index.js.map
