"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orderId: "",
      orderInfo: {
        productName: "",
        productImage: "",
        deposit: 0,
        applyTime: "",
        name: "",
        phone: "",
        receiver: "",
        contactPhone: "",
        deliveryAddress: ""
      },
      logisticsInfo: {
        status: 1,
        approveTime: "",
        shipTime: "",
        company: "",
        trackingNumber: "",
        details: [],
        deliveryTime: "",
        updateTime: ""
      }
    };
  },
  onShow() {
    const savedOrderId = common_vendor.index.getStorageSync("currentOrderId");
    if (savedOrderId && (!this.orderId || this.orderId !== savedOrderId)) {
      this.orderId = savedOrderId;
      this.loadOrderInfo();
    }
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/order/index.vue:226", "订单页面加载，参数：", options);
    common_vendor.index.__f__("log", "at pages/order/index.vue:227", "本地存储的订单ID：", common_vendor.index.getStorageSync("currentOrderId"));
    if (options && options.id) {
      this.orderId = options.id;
      this.loadOrderInfo();
    } else {
      const savedOrderId = common_vendor.index.getStorageSync("currentOrderId");
      if (savedOrderId) {
        this.orderId = savedOrderId;
        this.loadOrderInfo();
      } else {
        common_vendor.index.__f__("log", "at pages/order/index.vue:240", "未找到订单ID");
        this.loadDemoData();
      }
    }
  },
  onPullDownRefresh() {
    this.loadOrderInfo(() => {
      common_vendor.index.stopPullDownRefresh();
    });
  },
  methods: {
    // 加载演示数据（当没有找到订单ID时使用）
    loadDemoData() {
      common_vendor.index.__f__("log", "at pages/order/index.vue:256", "加载演示数据");
      const currentTime = /* @__PURE__ */ new Date();
      const oneDay = 24 * 60 * 60 * 1e3;
      const createTime = new Date(currentTime - oneDay * 2);
      this.orderInfo = {
        productName: "智能POS机",
        productImage: "/static/banner/99-2.jpg",
        deposit: 99,
        applyTime: this.formatDate(createTime),
        name: "测试用户",
        phone: "138****8888",
        receiver: "测试用户",
        contactPhone: "138****8888",
        deliveryAddress: "广东省深圳市南山区科技园南区8栋101"
      };
      this.loadLogisticsDemoData(createTime, 2);
      common_vendor.index.hideLoading();
    },
    // 加载演示物流数据
    loadLogisticsDemoData(createTime, defaultStatus) {
      const currentTime = /* @__PURE__ */ new Date();
      const oneDay = 24 * 60 * 60 * 1e3;
      const timeDiff = currentTime - createTime;
      let status = defaultStatus || 1;
      if (!defaultStatus) {
        if (timeDiff > oneDay * 3) {
          status = 4;
        } else if (timeDiff > oneDay * 1.5) {
          status = 3;
        } else if (timeDiff > oneDay * 0.5) {
          status = 2;
        } else {
          status = 1;
        }
      }
      this.logisticsInfo.status = status;
      if (status >= 1) {
        this.logisticsInfo.approveTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 0.2)
        );
      }
      if (status >= 2) {
        this.logisticsInfo.shipTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 0.5)
        );
        this.logisticsInfo.company = "顺丰速运";
        this.logisticsInfo.trackingNumber = "SF" + Math.floor(1e9 + Math.random() * 9e9);
        this.logisticsInfo.details = [
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 0.5)
            ),
            message: "您的快递已由【深圳发货中心】揽收，开始分拣"
          }
        ];
      }
      if (status >= 3) {
        this.logisticsInfo.updateTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 1)
        );
        this.logisticsInfo.details.unshift(
          {
            time: this.formatDate(new Date(createTime.getTime() + oneDay * 1)),
            message: "快递已从【深圳集散中心】发出，下一站【广州转运中心】"
          },
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 0.7)
            ),
            message: "快递到达【深圳集散中心】，正在分拣"
          }
        );
      }
      if (status >= 4) {
        this.logisticsInfo.deliveryTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 2.5)
        );
        this.logisticsInfo.details.unshift(
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 2.5)
            ),
            message: "您的快递已签收，签收人：本人"
          },
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 2.2)
            ),
            message: "快递已到达【广州市天河区网点】，快递员【李师傅，电话：13800138000】正在派送"
          },
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 1.5)
            ),
            message: "快递已到达【广州转运中心】，准备发往下一站"
          }
        );
      }
    },
    // 加载订单信息
    loadOrderInfo(callback) {
      common_vendor.index.__f__("log", "at pages/order/index.vue:381", "开始加载订单信息:", this.orderId);
      if (!this.orderId) {
        common_vendor.index.__f__("log", "at pages/order/index.vue:385", "没有订单ID，加载演示数据");
        this.loadDemoData();
        if (typeof callback === "function") {
          callback();
        }
        return;
      }
      try {
        if (!common_vendor.wx$1.cloud || !common_vendor.wx$1.cloud.$isInitialized) {
          common_vendor.wx$1.cloud.init({
            env: "cloud1-9grox8bwd6dbce0c",
            traceUser: true
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/index.vue:402", "初始化云环境失败:", error);
        this.loadDemoData();
        if (typeof callback === "function") {
          callback();
        }
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        const db = common_vendor.wx$1.cloud.database();
        db.collection("user").doc(this.orderId).get({
          success: async (res) => {
            var _a, _b;
            common_vendor.index.__f__("log", "at pages/order/index.vue:421", "获取到的订单数据:", res.data);
            if (!res.data) {
              common_vendor.index.__f__("log", "at pages/order/index.vue:423", "未找到订单数据，加载演示数据");
              this.loadDemoData();
              common_vendor.index.hideLoading();
              if (typeof callback === "function") {
                callback();
              }
              return;
            }
            const orderData = res.data;
            this.orderInfo = {
              productName: orderData.productName || "智能POS机",
              productImage: orderData.productImage || "/static/banner/99-2.jpg",
              deposit: orderData.deposit || 99,
              applyTime: this.formatDate(orderData.createTime) || (/* @__PURE__ */ new Date()).toLocaleString(),
              name: orderData.name || "",
              phone: orderData.phone || "",
              receiver: orderData.receiver || orderData.name || "",
              contactPhone: orderData.contactPhone || orderData.phone || "",
              deliveryAddress: orderData.deliveryAddress || "未提供地址"
            };
            if (orderData.logisticsTrackingNumber && orderData.logisticsCompany) {
              try {
                const logisticsResult = await common_vendor.wx$1.cloud.callFunction({
                  name: "getLogistics",
                  data: {
                    trackingNumber: orderData.logisticsTrackingNumber,
                    company: orderData.logisticsCompany
                  }
                });
                if (logisticsResult.result.code === 0) {
                  const realLogistics = logisticsResult.result.data;
                  const statusMap = {
                    0: 2,
                    // 在途
                    1: 4,
                    // 已签收
                    2: 2,
                    // 疑难
                    3: 2,
                    // 已退签
                    4: 2,
                    // 已退回
                    5: 2,
                    // 派送中
                    6: 2
                    // 退回中
                  };
                  this.logisticsInfo = {
                    status: statusMap[realLogistics.status] || 2,
                    approveTime: this.formatDate(
                      orderData.logisticsApproveTime
                    ),
                    shipTime: this.formatDate(orderData.logisticsShipTime),
                    company: realLogistics.company,
                    trackingNumber: realLogistics.trackingNumber,
                    details: realLogistics.traces.map((item) => ({
                      time: item.time,
                      message: item.context
                    })).reverse(),
                    deliveryTime: realLogistics.status === "1" ? (_a = realLogistics.traces[0]) == null ? void 0 : _a.time : "",
                    updateTime: (_b = realLogistics.traces[0]) == null ? void 0 : _b.time
                  };
                } else {
                  common_vendor.index.__f__(
                    "error",
                    "at pages/order/index.vue:499",
                    "获取物流信息失败:",
                    logisticsResult.result.msg
                  );
                  this.loadLogisticsDemoData(new Date(orderData.createTime));
                }
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/order/index.vue:506", "查询物流信息失败:", error);
                this.loadLogisticsDemoData(new Date(orderData.createTime));
              }
            } else {
              this.loadLogisticsDemoData(new Date(orderData.createTime));
            }
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("log", "at pages/order/index.vue:515", "订单数据加载完成");
            if (typeof callback === "function") {
              callback();
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/order/index.vue:522", "获取订单数据失败:", err);
            this.loadDemoData();
            common_vendor.index.hideLoading();
            if (typeof callback === "function") {
              callback();
            }
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/index.vue:531", "查询订单数据异常:", error);
        this.loadDemoData();
        common_vendor.index.hideLoading();
        if (typeof callback === "function") {
          callback();
        }
      }
    },
    // 格式化日期
    formatDate(date) {
      if (!date)
        return "";
      if (typeof date === "string") {
        date = new Date(date);
      } else if (date.toDate && typeof date.toDate === "function") {
        date = date.toDate();
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 复制地址
    copyAddress() {
      common_vendor.index.setClipboardData({
        data: this.orderInfo.deliveryAddress,
        success: () => {
          common_vendor.index.showToast({
            title: "地址已复制",
            icon: "success"
          });
        }
      });
    },
    // 复制物流单号
    copyTrackingNumber() {
      common_vendor.index.setClipboardData({
        data: this.logisticsInfo.trackingNumber,
        success: () => {
          common_vendor.index.showToast({
            title: "物流单号已复制",
            icon: "success"
          });
        }
      });
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.orderInfo.productImage,
    b: common_vendor.t($data.orderInfo.productName),
    c: common_vendor.t($data.orderInfo.deposit),
    d: common_vendor.t($data.orderInfo.applyTime),
    e: $data.logisticsInfo.status >= 1
  }, $data.logisticsInfo.status >= 1 ? {
    f: common_vendor.t($data.logisticsInfo.approveTime || "")
  } : {}, {
    g: $data.logisticsInfo.status >= 1 ? 1 : "",
    h: $data.logisticsInfo.status === 1 ? 1 : "",
    i: $data.logisticsInfo.status >= 2
  }, $data.logisticsInfo.status >= 2 ? {
    j: common_vendor.t($data.logisticsInfo.shipTime || "")
  } : {}, {
    k: $data.logisticsInfo.status >= 2 ? 1 : "",
    l: $data.logisticsInfo.status === 2 ? 1 : "",
    m: $data.logisticsInfo.status >= 3
  }, $data.logisticsInfo.status >= 3 ? {
    n: common_vendor.t($data.logisticsInfo.updateTime || "")
  } : {}, {
    o: $data.logisticsInfo.status >= 3 ? 1 : "",
    p: $data.logisticsInfo.status === 3 ? 1 : "",
    q: $data.logisticsInfo.status === 4
  }, $data.logisticsInfo.status === 4 ? {
    r: common_vendor.t($data.logisticsInfo.deliveryTime || "")
  } : {}, {
    s: $data.logisticsInfo.status >= 4 ? 1 : "",
    t: $data.logisticsInfo.status === 4 ? 1 : "",
    v: $data.logisticsInfo.status >= 2
  }, $data.logisticsInfo.status >= 2 ? {
    w: common_vendor.t($data.logisticsInfo.company || "顺丰速运"),
    x: common_vendor.t($data.logisticsInfo.trackingNumber || ""),
    y: common_vendor.o((...args) => $options.copyTrackingNumber && $options.copyTrackingNumber(...args))
  } : {}, {
    z: $data.logisticsInfo.status >= 2 && $data.logisticsInfo.details && $data.logisticsInfo.details.length
  }, $data.logisticsInfo.status >= 2 && $data.logisticsInfo.details && $data.logisticsInfo.details.length ? {
    A: common_vendor.f($data.logisticsInfo.details, (item, index, i0) => {
      return {
        a: common_vendor.t(item.message),
        b: common_vendor.t(item.time),
        c: index,
        d: index === 0 ? 1 : ""
      };
    })
  } : {}, {
    B: $data.logisticsInfo.status < 2
  }, $data.logisticsInfo.status < 2 ? {} : {}, {
    C: common_vendor.t($data.orderInfo.receiver),
    D: common_vendor.t($data.orderInfo.contactPhone),
    E: common_vendor.t($data.orderInfo.deliveryAddress),
    F: common_vendor.o((...args) => $options.copyAddress && $options.copyAddress(...args)),
    G: common_vendor.o((...args) => $options.contactService && $options.contactService(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/index.js.map
