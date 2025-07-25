"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      categories: [
        {
          name: "全部",
          icon: "https://cdn-icons-png.flaticon.com/128/3575/3575992.png"
        },
        {
          name: "传统POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2331/2331717.png"
        },
        {
          name: "智能POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2038/2038792.png"
        },
        {
          name: "移动POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2496/2496153.png"
        },
        {
          name: "刷卡机",
          icon: "https://cdn-icons-png.flaticon.com/128/6475/6475714.png"
        }
      ],
      currentCategory: "全部",
      currentSort: "default",
      priceSortAsc: false,
      showFilter: false,
      priceRanges: [
        { label: "全部", min: 0, max: 99999 },
        { label: "0-500元", min: 0, max: 500 },
        { label: "500-1000元", min: 500, max: 1e3 },
        { label: "1000-2000元", min: 1e3, max: 2e3 },
        { label: "2000元以上", min: 2e3, max: 99999 }
      ],
      selectedPriceRange: 0,
      paymentMethods: ["扫码支付", "刷卡支付", "NFC支付", "人脸支付"],
      selectedPaymentMethods: [],
      productList: [],
      hasMore: true,
      page: 1,
      pageSize: 10
    };
  },
  onLoad(options) {
    if (options.category) {
      this.currentCategory = options.category;
    }
    if (options.categoryName) {
      this.currentCategory = options.categoryName;
    }
    this.loadProducts();
  },
  onReachBottom() {
    if (this.hasMore) {
      this.page++;
      this.loadMoreProducts();
    }
  },
  methods: {
    // 跳转到搜索页
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/index"
      });
    },
    // 切换分类
    changeCategory(category) {
      this.currentCategory = category;
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },
    // 切换排序方式
    changeSort(sortType) {
      if (this.currentSort === sortType) {
        if (sortType === "price") {
          this.priceSortAsc = !this.priceSortAsc;
        }
      } else {
        this.currentSort = sortType;
        if (sortType === "price") {
          this.priceSortAsc = true;
        }
      }
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },
    // 选择价格区间
    selectPriceRange(index) {
      this.selectedPriceRange = index;
    },
    // 切换支付方式选择
    togglePaymentMethod(method) {
      const index = this.selectedPaymentMethods.indexOf(method);
      if (index > -1) {
        this.selectedPaymentMethods.splice(index, 1);
      } else {
        this.selectedPaymentMethods.push(method);
      }
    },
    // 重置筛选条件
    resetFilter() {
      this.selectedPriceRange = 0;
      this.selectedPaymentMethods = [];
    },
    // 应用筛选条件
    applyFilter() {
      this.showFilter = false;
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },
    // 加载产品数据
    loadProducts() {
      common_vendor.index.__f__("log", "at pages/product/list.vue:295", "加载分类:", this.currentCategory, "排序:", this.currentSort);
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        this.productList = [
          {
            id: 1,
            name: "智能POS机A1 Pro",
            desc: "支持扫码/刷卡/NFC，大屏显示，性能稳定",
            image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
            price: "1580",
            rate: "0.38%",
            deposit: 99,
            sales: 2386,
            tags: ["热销", "新品"]
          },
          {
            id: 2,
            name: "移动POS机B2 Plus",
            desc: "便携式，支持4G网络，续航持久",
            image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png",
            price: "980",
            rate: "0.55%",
            deposit: 199,
            sales: 1658,
            tags: ["便携", "4G"]
          },
          {
            id: 3,
            name: "多功能收款机C3",
            desc: "触摸屏操作，支持打印小票，高速结算",
            image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png",
            price: "2680",
            rate: "0.35%",
            deposit: 299,
            sales: 986,
            tags: ["多功能", "打印"]
          },
          {
            id: 4,
            name: "商用收银一体机D5",
            desc: "集成收银系统，大屏触控，多种外设接口",
            image: "https://cdn-icons-png.flaticon.com/128/2897/2897780.png",
            price: "3999",
            rate: "0.32%",
            deposit: 499,
            sales: 568,
            tags: ["商用", "收银"]
          },
          {
            id: 5,
            name: "迷你POS机E1 Mini",
            desc: "小巧便携，蓝牙连接，即插即用",
            image: "https://cdn-icons-png.flaticon.com/128/4361/4361331.png",
            price: "499",
            rate: "0.65%",
            deposit: 99,
            sales: 3752,
            tags: ["迷你", "便携"]
          }
        ];
        common_vendor.index.hideLoading();
      }, 500);
    },
    // 加载更多产品
    loadMoreProducts() {
      if (!this.hasMore)
        return;
      common_vendor.index.showLoading({
        title: "加载更多..."
      });
      setTimeout(() => {
        this.hasMore = false;
        common_vendor.index.hideLoading();
      }, 500);
    },
    // 跳转到产品详情
    goToDetail(item) {
      common_vendor.index.navigateTo({
        url: "/pages/product/detail?id=" + item.id
      });
    },
    // 跳转到申请页面
    goToApply(item) {
      common_vendor.index.navigateTo({
        url: "/pages/apply/index?id=" + item.id
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    b: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: $data.currentCategory === item.name ? 1 : "",
        e: common_vendor.o(($event) => $options.changeCategory(item.name), index)
      };
    }),
    c: common_vendor.o(($event) => $options.changeSort("default")),
    d: $data.currentSort === "default" ? 1 : "",
    e: common_vendor.t($data.currentSort === "sales" ? "↓" : "↑"),
    f: common_vendor.o(($event) => $options.changeSort("sales")),
    g: $data.currentSort === "sales" ? 1 : "",
    h: common_vendor.t($data.currentSort === "price" && $data.priceSortAsc ? "↑" : "↓"),
    i: common_vendor.o(($event) => $options.changeSort("price")),
    j: $data.currentSort === "price" ? 1 : "",
    k: common_vendor.o(($event) => $data.showFilter = !$data.showFilter),
    l: $data.showFilter
  }, $data.showFilter ? {
    m: common_vendor.f($data.priceRanges, (range, index, i0) => {
      return {
        a: common_vendor.t(range.label),
        b: index,
        c: $data.selectedPriceRange === index ? 1 : "",
        d: common_vendor.o(($event) => $options.selectPriceRange(index), index)
      };
    }),
    n: common_vendor.f($data.paymentMethods, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: $data.selectedPaymentMethods.includes(item) ? 1 : "",
        d: common_vendor.o(($event) => $options.togglePaymentMethod(item), index)
      };
    }),
    o: common_vendor.o((...args) => $options.resetFilter && $options.resetFilter(...args)),
    p: common_vendor.o((...args) => $options.applyFilter && $options.applyFilter(...args))
  } : {}, {
    q: common_vendor.f($data.productList, (item, index, i0) => {
      return {
        a: item.image || "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
        b: common_vendor.t(item.name),
        c: common_vendor.f(item.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        d: common_vendor.t(item.desc),
        e: common_vendor.t(item.price),
        f: common_vendor.t(item.rate),
        g: common_vendor.t(item.sales),
        h: common_vendor.t(item.deposit),
        i: common_vendor.o(($event) => $options.goToApply(item), index),
        j: index,
        k: common_vendor.o(($event) => $options.goToDetail(item), index)
      };
    }),
    r: $data.productList.length === 0
  }, $data.productList.length === 0 ? {} : {}, {
    s: $data.productList.length > 0
  }, $data.productList.length > 0 ? common_vendor.e({
    t: $data.hasMore
  }, $data.hasMore ? {} : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/list.js.map
