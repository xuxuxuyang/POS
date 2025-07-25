"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      searching: false,
      historyKeywords: [],
      hotKeywords: [
        "智能POS",
        "刷卡机",
        "银联POS",
        "移动POS",
        "mPOS",
        "扫码支付"
      ],
      searchResults: []
    };
  },
  onLoad() {
    const history = common_vendor.index.getStorageSync("searchHistory");
    if (history) {
      this.historyKeywords = JSON.parse(history);
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    clearKeyword() {
      this.keyword = "";
      this.searchResults = [];
    },
    useHistoryKeyword(keyword) {
      this.keyword = keyword;
      this.handleSearch();
    },
    clearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除所有历史记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.historyKeywords = [];
            common_vendor.index.removeStorageSync("searchHistory");
          }
        }
      });
    },
    handleSearch() {
      if (!this.keyword.trim())
        return;
      if (!this.historyKeywords.includes(this.keyword)) {
        this.historyKeywords.unshift(this.keyword);
        if (this.historyKeywords.length > 10) {
          this.historyKeywords.pop();
        }
        common_vendor.index.setStorageSync(
          "searchHistory",
          JSON.stringify(this.historyKeywords)
        );
      }
      this.searching = true;
      this.searchResults = [];
      setTimeout(() => {
        this.searching = false;
        if (this.keyword.includes("POS") || this.keyword.includes("pos")) {
          this.searchResults = [
            {
              id: 1,
              name: "智能POS机A1 Pro",
              desc: "全能收款，支持扫码/刷卡/NFC",
              price: "1580",
              image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png"
            },
            {
              id: 2,
              name: "移动POS机B2 Plus",
              desc: "便携式，支持4G网络，续航持久",
              price: "980",
              image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png"
            },
            {
              id: 3,
              name: "多功能收款机C3",
              desc: "触摸屏操作，支持打印小票，高速结算",
              price: "2680",
              image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png"
            }
          ];
        }
      }, 1e3);
    },
    goToProductDetail(product) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${product.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.keyword,
    c: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    d: $data.keyword
  }, $data.keyword ? {
    e: common_vendor.o((...args) => $options.clearKeyword && $options.clearKeyword(...args))
  } : {}, {
    f: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    g: !$data.keyword && $data.historyKeywords.length > 0
  }, !$data.keyword && $data.historyKeywords.length > 0 ? {
    h: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    i: common_vendor.f($data.historyKeywords, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.useHistoryKeyword(item), index)
      };
    })
  } : {}, {
    j: !$data.keyword
  }, !$data.keyword ? {
    k: common_vendor.f($data.hotKeywords, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.useHistoryKeyword(item), index)
      };
    })
  } : {}, {
    l: $data.keyword && $data.searching
  }, $data.keyword && $data.searching ? {} : $data.keyword && $data.searchResults.length > 0 ? {
    n: common_vendor.f($data.searchResults, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.desc),
        d: common_vendor.t(item.price),
        e: index,
        f: common_vendor.o(($event) => $options.goToProductDetail(item), index)
      };
    })
  } : $data.keyword && !$data.searching && $data.searchResults.length === 0 ? {} : {}, {
    m: $data.keyword && $data.searchResults.length > 0,
    o: $data.keyword && !$data.searching && $data.searchResults.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/index.js.map
