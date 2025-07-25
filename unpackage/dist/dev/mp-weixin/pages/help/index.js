"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKey: "",
      currentCategory: "all",
      categories: [
        { id: "all", name: "全部" },
        { id: "product", name: "产品" },
        { id: "order", name: "订单" },
        { id: "payment", name: "支付" },
        { id: "service", name: "售后" }
      ],
      faqs: [
        {
          id: 1,
          category: "product",
          tag: "热门",
          question: "如何选择合适的POS机型号？",
          answer: "选择POS机需要考虑以下因素：<br>1. 业务类型：不同行业需要不同类型的POS机<br>2. 交易量：大交易量需要更稳定的设备<br>3. 功能需求：是否需要打印小票、扫码支付等<br>4. 移动需求：是否需要便携式POS机<br><br>建议您联系客服，我们会根据您的具体需求推荐合适的机型。",
          expanded: false
        },
        {
          id: 2,
          category: "order",
          question: "下单后多久能收到POS机？",
          answer: "正常情况下，订单审核通过后1-3个工作日内发货，快递送达时间一般为1-3天，总计2-6个工作日可收到。<br><br>特殊地区可能需要更长时间，您可以在订单页面实时查看物流状态。",
          expanded: false
        },
        {
          id: 3,
          category: "payment",
          question: "支持哪些付款方式？",
          answer: "目前支持以下付款方式：<br>1. 微信支付<br>2. 支付宝<br>3. 银行卡支付<br>4. 货到付款（部分地区）<br><br>押金支付也支持分期付款，可在结算页面选择。",
          expanded: false
        },
        {
          id: 4,
          category: "service",
          question: "POS机出现故障怎么办？",
          answer: '如果您的POS机出现故障，可以：<br>1. 查看<a href="/pages/guide/index">使用教程</a>中的常见问题解决方案<br>2. 联系客服热线：400-123-4567<br>3. 提交<a href="/pages/service/repair">维修申请</a><br><br>我们会在24小时内响应您的维修需求。',
          expanded: false
        },
        {
          id: 5,
          category: "product",
          question: "POS机支持哪些支付方式？",
          answer: "我们的POS机支持以下支付方式：<br>1. 银联刷卡<br>2. 微信扫码支付<br>3. 支付宝扫码支付<br>4. 云闪付<br>5. NFC非接触式支付（部分机型）<br><br>具体支持的支付方式以您选购的机型为准。",
          expanded: false
        },
        {
          id: 6,
          category: "payment",
          question: "押金可以退还吗？",
          answer: "是的，押金可以退还。<br><br>在设备正常归还且无损坏的情况下，押金将在确认设备状态后的7个工作日内退还到您的原支付账户。<br><br>如有特殊情况，请联系客服处理。",
          expanded: false
        },
        {
          id: 7,
          category: "order",
          question: "如何取消订单？",
          answer: '您可以在订单状态为"待审核"时取消订单：<br>1. 进入"我的"-"全部订单"<br>2. 找到需要取消的订单<br>3. 点击"取消订单"按钮<br><br>如订单已审核通过，请联系客服协助取消。',
          expanded: false
        },
        {
          id: 8,
          category: "service",
          tag: "重要",
          question: "如何激活新POS机？",
          answer: '收到POS机后，请按以下步骤激活：<br>1. 登录小程序<br>2. 进入"我的服务"-"激活POS机"<br>3. 扫描机器背面的二维码或输入SN号<br>4. 按照页面提示完成激活流程<br><br>激活过程中如遇问题，可联系客服协助。',
          expanded: false
        }
      ]
    };
  },
  computed: {
    filteredFaqs() {
      return this.faqs.filter((item) => {
        const categoryMatch = this.currentCategory === "all" || item.category === this.currentCategory;
        const searchMatch = !this.searchKey || item.question.toLowerCase().includes(this.searchKey.toLowerCase()) || item.answer.toLowerCase().includes(this.searchKey.toLowerCase());
        return categoryMatch && searchMatch;
      });
    }
  },
  methods: {
    // 选择分类
    selectCategory(categoryId) {
      this.currentCategory = categoryId;
    },
    // 展开/折叠FAQ
    toggleFaq(index) {
      const faq = this.filteredFaqs[index];
      const originalIndex = this.faqs.findIndex((item) => item.id === faq.id);
      if (originalIndex !== -1) {
        this.$set(
          this.faqs[originalIndex],
          "expanded",
          !this.faqs[originalIndex].expanded
        );
      }
    },
    // 搜索问题
    searchQuestions() {
      common_vendor.index.__f__("log", "at pages/help/index.vue:211", "搜索:", this.searchKey);
    },
    // 清空搜索
    clearSearch() {
      this.searchKey = "";
    },
    // 联系客服
    contactService() {
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
    },
    // 提交反馈
    submitFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/help/feedback"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.searchQuestions && $options.searchQuestions(...args)),
    b: $data.searchKey,
    c: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    d: $data.searchKey
  }, $data.searchKey ? {
    e: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    f: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: $data.currentCategory === item.id ? 1 : "",
        d: common_vendor.o(($event) => $options.selectCategory(item.id), index)
      };
    }),
    g: $options.filteredFaqs.length > 0
  }, $options.filteredFaqs.length > 0 ? {
    h: common_vendor.f($options.filteredFaqs, (item, index, i0) => {
      return common_vendor.e({
        a: item.tag
      }, item.tag ? {
        b: common_vendor.t(item.tag)
      } : {}, {
        c: common_vendor.t(item.question),
        d: item.expanded ? 1 : "",
        e: item.expanded
      }, item.expanded ? {
        f: item.answer
      } : {}, {
        g: index,
        h: common_vendor.o(($event) => $options.toggleFaq(index), index)
      });
    })
  } : {}, {
    i: common_vendor.o((...args) => $options.contactService && $options.contactService(...args)),
    j: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/help/index.js.map
