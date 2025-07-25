"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      loading: true,
      refundOrders: [],
      userId: ""
      // 用户ID
    };
  },
  onLoad() {
    common_vendor.wx$1.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true
    });
    this.userId = common_vendor.index.getStorageSync("userId") || "";
    this.loadRefundOrders();
  },
  onShow() {
    this.loadRefundOrders();
    common_vendor.index.removeStorageSync("current_refund_detail");
  },
  onPullDownRefresh() {
    this.loadRefundOrders(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  methods: {
    // 加载退款记录
    loadRefundOrders(callback) {
      this.loading = true;
      const db = common_vendor.wx$1.cloud.database();
      db.collection("refund_requests").orderBy("applyTime", "desc").get({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deposit/refund-orders.vue:99", "退款记录查询结果:", res.data);
          this.refundOrders = res.data;
          this.loading = false;
          if (typeof callback === "function") {
            callback();
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/refund-orders.vue:108", "查询退款记录失败:", err);
          this.loading = false;
          common_vendor.index.showToast({
            title: "加载记录失败",
            icon: "none"
          });
          if (typeof callback === "function") {
            callback();
          }
        }
      });
    },
    // 格式化日期
    formatDate(dateObj) {
      if (!dateObj)
        return "";
      let date;
      if (typeof dateObj === "object" && dateObj.toDate) {
        date = dateObj.toDate();
      } else if (typeof dateObj === "string") {
        date = new Date(dateObj);
      } else {
        date = new Date(dateObj);
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        "待审核": "审核中",
        "已通过": "已通过",
        "已拒绝": "未通过",
        "已退款": "已退款"
      };
      return statusMap[status] || "处理中";
    },
    // 获取状态对应的样式类
    getStatusClass(status) {
      if (status === "待审核") {
        return "status-pending";
      } else if (status === "已通过") {
        return "status-approved";
      } else if (status === "已拒绝") {
        return "status-rejected";
      } else if (status === "已退款") {
        return "status-refunded";
      }
      return "";
    },
    // 跳转到退押金详情进度页面
    goToDetail(refundId, item) {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      common_vendor.index.__f__("log", "at pages/deposit/refund-orders.vue:176", "准备跳转到退款详情页，ID:", refundId);
      if (!refundId) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "无效的记录ID",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/deposit/pay?id=${refundId}&type=detail&from=records&t=${Date.now()}`,
        success: () => {
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/refund-orders.vue:196", "跳转失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    },
    // 跳转到新建退款页
    goToNewRefund() {
      common_vendor.index.navigateTo({
        url: "/pages/order/list?type=refundable"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : $data.refundOrders.length === 0 ? {
    c: common_assets._imports_0$2
  } : {
    d: common_vendor.f($data.refundOrders, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.amount),
        c: common_vendor.t(item.orderId),
        d: common_vendor.t($options.formatDate(item.applyTime)),
        e: common_vendor.t($options.getStatusText(item.status)),
        f: common_vendor.n($options.getStatusClass(item.status)),
        g: index,
        h: common_vendor.o(($event) => {
          var _a;
          return $options.goToDetail(item._id || item.orderId || ((_a = item.orderInfo) == null ? void 0 : _a.id), item);
        }, index)
      };
    })
  }, {
    b: $data.refundOrders.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/deposit/refund-orders.js.map
