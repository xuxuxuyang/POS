"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      tabs: ["全部", "待审核", "待发货", "已发货", "已完成"],
      currentTab: 0,
      orders: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      isRefreshing: false,
      orderType: "all"
      // 默认加载全部订单
    };
  },
  onLoad(options) {
    if (options.type) {
      switch (options.type) {
        case "pending":
          this.currentTab = 1;
          this.orderType = "pending";
          break;
        case "approved":
          this.currentTab = 2;
          this.orderType = "approved";
          break;
        case "shipped":
          this.currentTab = 3;
          this.orderType = "shipped";
          break;
        case "completed":
          this.currentTab = 4;
          this.orderType = "completed";
          break;
        default:
          this.currentTab = 0;
          this.orderType = "all";
      }
    }
    this.loadOrders();
  },
  methods: {
    // 切换标签
    switchTab(index) {
      if (this.currentTab === index)
        return;
      this.currentTab = index;
      this.page = 1;
      this.orders = [];
      this.hasMore = true;
      switch (index) {
        case 0:
          this.orderType = "all";
          break;
        case 1:
          this.orderType = "pending";
          break;
        case 2:
          this.orderType = "approved";
          break;
        case 3:
          this.orderType = "shipped";
          break;
        case 4:
          this.orderType = "completed";
          break;
      }
      this.loadOrders();
    },
    // 加载订单数据
    loadOrders() {
      if (!this.hasMore || this.isLoading)
        return;
      this.isLoading = true;
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId) {
        this.isLoading = false;
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      let statusCondition = {};
      switch (this.orderType) {
        case "pending":
          statusCondition = "待审核";
          break;
        case "approved":
          statusCondition = "待发货";
          break;
        case "shipped":
          statusCondition = "已发货";
          break;
        case "completed":
          statusCondition = "已完成";
          break;
      }
      setTimeout(() => {
        const mockOrders = this.getMockOrders(statusCondition);
        this.orders = this.page === 1 ? mockOrders : [...this.orders, ...mockOrders];
        this.hasMore = mockOrders.length === this.pageSize;
        this.page++;
        this.isLoading = false;
        if (this.isRefreshing) {
          this.isRefreshing = false;
        }
      }, 800);
    },
    // 获取模拟订单数据
    getMockOrders(status) {
      const mockData = [];
      const startIndex = (this.page - 1) * this.pageSize;
      const maxItems = this.page === 1 ? Math.min(5, this.pageSize) : Math.min(3, this.pageSize);
      for (let i = 0; i < maxItems; i++) {
        const orderIndex = startIndex + i;
        const randomPrice = Math.floor(Math.random() * 1e3 + 500);
        const quantity = Math.floor(Math.random() * 2) + 1;
        let orderStatus = status;
        if (!status) {
          const statuses = ["待审核", "待发货", "已发货", "已完成"];
          orderStatus = statuses[Math.floor(Math.random() * statuses.length)];
        }
        mockData.push({
          _id: "order_" + orderIndex,
          orderNumber: "POS" + (1e6 + orderIndex).toString(),
          status: orderStatus,
          productName: "POS机" + ["标准版", "高级版", "Pro版", "商用版"][Math.floor(Math.random() * 4)],
          productSpec: ["蓝牙连接", "WiFi连接", "4G连接"][Math.floor(Math.random() * 3)],
          productImage: [
            "https://img01.yzcdn.cn/vant/cat.jpeg",
            "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
            "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"
          ][Math.floor(Math.random() * 3)],
          price: randomPrice,
          quantity,
          totalAmount: (randomPrice * quantity).toFixed(2),
          createTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1e3),
          hasReviewed: Math.random() > 0.5
          // 随机是否已评价
        });
      }
      return mockData;
    },
    // 加载更多订单
    loadMoreOrders() {
      this.loadOrders();
    },
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.orders = [];
      this.hasMore = true;
      this.loadOrders();
    },
    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 获取状态对应的样式类
    getStatusClass(status) {
      switch (status) {
        case "待审核":
          return "status-pending";
        case "待发货":
          return "status-approved";
        case "已发货":
          return "status-shipped";
        case "已完成":
          return "status-completed";
        default:
          return "";
      }
    },
    // 跳转到订单详情
    goToOrderDetail(orderId) {
      common_vendor.index.navigateTo({
        url: `/pages/order/detail?id=${orderId}`
      });
    },
    // 取消订单
    cancelOrder(orderId) {
      common_vendor.index.showModal({
        title: "取消订单",
        content: "确定要取消该订单吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
              const orderIndex = this.orders.findIndex((order) => order._id === orderId);
              if (orderIndex !== -1) {
                this.orders.splice(orderIndex, 1);
              }
            }, 1e3);
          }
        }
      });
    },
    // 支付订单
    payOrder(orderId) {
      common_vendor.index.navigateTo({
        url: `/pages/payment/index?orderId=${orderId}`
      });
    },
    // 查看物流
    trackOrder(orderId) {
      common_vendor.index.navigateTo({
        url: `/pages/order/logistics?id=${orderId}`
      });
    },
    // 确认收货
    confirmOrder(orderId) {
      common_vendor.index.showModal({
        title: "确认收货",
        content: "确认已收到商品吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "已确认收货",
                icon: "success"
              });
              const orderIndex = this.orders.findIndex((order) => order._id === orderId);
              if (orderIndex !== -1) {
                this.orders[orderIndex].status = "已完成";
              }
            }, 1e3);
          }
        }
      });
    },
    // 评价订单
    reviewOrder(orderId) {
      common_vendor.index.navigateTo({
        url: `/pages/order/review?id=${orderId}`
      });
    },
    // 再次购买
    rebuyOrder(order) {
      common_vendor.index.showToast({
        title: "正在处理...",
        icon: "none"
      });
    },
    // 浏览POS机
    browsePOS() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab),
        b: $data.currentTab === index
      }, $data.currentTab === index ? {} : {}, {
        c: index,
        d: $data.currentTab === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(index), index)
      });
    }),
    b: $data.orders.length > 0
  }, $data.orders.length > 0 ? {
    c: common_vendor.f($data.orders, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNumber),
        b: common_vendor.t(order.status),
        c: common_vendor.n($options.getStatusClass(order.status)),
        d: order.productImage,
        e: common_vendor.t(order.productName),
        f: common_vendor.t(order.productSpec),
        g: common_vendor.t(order.price),
        h: common_vendor.t(order.quantity),
        i: common_vendor.t($options.formatDate(order.createTime)),
        j: common_vendor.t(order.totalAmount),
        k: order.status === "待审核" || order.status === "待发货"
      }, order.status === "待审核" || order.status === "待发货" ? {
        l: common_vendor.o(($event) => $options.cancelOrder(order._id), index)
      } : {}, {
        m: order.status === "待支付"
      }, order.status === "待支付" ? {
        n: common_vendor.o(($event) => $options.payOrder(order._id), index)
      } : {}, {
        o: order.status === "已发货"
      }, order.status === "已发货" ? {
        p: common_vendor.o(($event) => $options.trackOrder(order._id), index)
      } : {}, {
        q: order.status === "已发货"
      }, order.status === "已发货" ? {
        r: common_vendor.o(($event) => $options.confirmOrder(order._id), index)
      } : {}, {
        s: order.status === "已完成" && !order.hasReviewed
      }, order.status === "已完成" && !order.hasReviewed ? {
        t: common_vendor.o(($event) => $options.reviewOrder(order._id), index)
      } : {}, {
        v: order.status === "已完成"
      }, order.status === "已完成" ? {
        w: common_vendor.o(($event) => $options.rebuyOrder(order), index)
      } : {}, {
        x: index,
        y: common_vendor.o(($event) => $options.goToOrderDetail(order._id), index)
      });
    })
  } : {}, {
    d: $data.orders.length === 0 && !$data.isLoading
  }, $data.orders.length === 0 && !$data.isLoading ? {
    e: common_vendor.o((...args) => $options.browsePOS && $options.browsePOS(...args))
  } : {}, {
    f: $data.isLoading && !$data.isRefreshing
  }, $data.isLoading && !$data.isRefreshing ? {} : {}, {
    g: !$data.hasMore && $data.orders.length > 0 && !$data.isLoading
  }, !$data.hasMore && $data.orders.length > 0 && !$data.isLoading ? {} : {}, {
    h: common_vendor.o((...args) => $options.loadMoreOrders && $options.loadMoreOrders(...args)),
    i: $data.isRefreshing,
    j: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/list.js.map
