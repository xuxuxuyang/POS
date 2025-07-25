"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      orderId: "",
      productName: "POS机A1",
      amount: 99,
      refundMethod: "wechat",
      serialNumber: "",
      machineImage: "",
      machineImageCloud: "",
      // 云存储路径
      showResult: false,
      paymentSuccess: false,
      orderInfo: {},
      // 存储订单详情
      hasRefundRequest: false,
      // 是否已申请退款
      refundStatus: "",
      // 退款状态
      refundInfo: {},
      // 退款申请信息
      isDetailMode: false,
      // 是否是详情查看模式
      statusMap: {
        "待审核": "审核中",
        "已通过": "审核通过，退款处理中",
        "已拒绝": "审核未通过",
        "已退款": "退款已完成"
      }
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/deposit/pay.vue:203", "页面加载，参数:", options);
    if (options.id) {
      this.orderId = options.id;
    }
    if (options.type === "detail") {
      common_vendor.index.__f__("log", "at pages/deposit/pay.vue:212", "进入详情模式");
      this.isDetailMode = true;
      this.hasRefundRequest = true;
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
      common_vendor.wx$1.cloud.init({
        env: "cloud1-9grox8bwd6dbce0c",
        traceUser: true
      });
      const db = common_vendor.wx$1.cloud.database();
      common_vendor.index.__f__("log", "at pages/deposit/pay.vue:232", "开始查询记录:", options.id);
      db.collection("refund_requests").doc(options.id).get().then((res) => {
        common_vendor.index.__f__("log", "at pages/deposit/pay.vue:236", "查询结果:", res);
        if (res.data) {
          const record = res.data;
          this.refundInfo = record;
          this.refundStatus = record.status || "待审核";
          this.productName = record.productName || "POS机";
          this.amount = record.amount || 99;
          this.serialNumber = record.serialNumber || "";
          common_vendor.index.hideLoading();
        } else {
          throw new Error("未找到记录");
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/deposit/pay.vue:251", "查询失败:", err);
        this.refundInfo = {
          status: "待审核",
          serialNumber: "加载失败",
          applyTime: /* @__PURE__ */ new Date()
        };
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "加载详情失败",
          icon: "none"
        });
      });
      return;
    }
    common_vendor.wx$1.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true
    });
    this.loadOrderInfo();
    this.checkRefundRequest();
  },
  // 加载退款记录详情
  loadRefundDetailById(refundId, fromRecords = false) {
    common_vendor.index.__f__("log", "at pages/deposit/pay.vue:283", "尝试加载退款记录详情:", refundId, "来自列表:", fromRecords);
    this.hasRefundRequest = true;
    this.isDetailMode = true;
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    common_vendor.wx$1.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true
    });
    const db = common_vendor.wx$1.cloud.database();
    db.collection("refund_requests").doc(refundId).get({
      success: (res) => {
        common_vendor.index.__f__("log", "at pages/deposit/pay.vue:306", "直接通过ID查询退款记录成功:", res.data);
        common_vendor.index.hideLoading();
        if (res.data) {
          const refundData = res.data;
          this.refundInfo = refundData;
          this.refundStatus = refundData.status || "待审核";
          this.orderId = refundData.orderId || this.orderId;
          this.productName = refundData.productName || "POS机";
          this.amount = refundData.amount || 99;
          this.serialNumber = refundData.serialNumber || "";
          if (refundData.orderId) {
            this.loadOriginalOrder(refundData.orderId);
          }
        } else {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:324", "查询结果为空");
          common_vendor.index.showToast({
            title: "找不到退款记录",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at pages/deposit/pay.vue:332", "直接查询退款记录失败:", err);
        common_vendor.index.hideLoading();
        this.tryWhereQuery(refundId);
      }
    });
  },
  // 使用where条件查询
  tryWhereQuery(refundId) {
    common_vendor.index.__f__("log", "at pages/deposit/pay.vue:343", "尝试使用where条件查询:", refundId);
    common_vendor.index.showLoading({
      title: "重试查询...",
      mask: true
    });
    const db = common_vendor.wx$1.cloud.database();
    db.collection("refund_requests").where({
      _id: refundId
    }).get({
      success: (res) => {
        common_vendor.index.__f__("log", "at pages/deposit/pay.vue:356", "where查询结果:", res.data);
        common_vendor.index.hideLoading();
        if (res.data && res.data.length > 0) {
          const refundData = res.data[0];
          this.refundInfo = refundData;
          this.refundStatus = refundData.status || "待审核";
          this.orderId = refundData.orderId || this.orderId;
          this.productName = refundData.productName || "POS机";
          this.amount = refundData.amount || 99;
          this.serialNumber = refundData.serialNumber || "";
          if (refundData.orderId) {
            this.loadOriginalOrder(refundData.orderId);
          }
        } else {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:374", "where查询没有结果");
          common_vendor.index.showToast({
            title: "找不到退款记录",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at pages/deposit/pay.vue:382", "where查询失败:", err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "加载记录失败",
          icon: "none"
        });
      }
    });
  },
  methods: {
    // 加载订单信息
    loadOrderInfo() {
      if (!this.orderId) {
        common_vendor.index.__f__("log", "at pages/deposit/pay.vue:397", "未找到订单ID");
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      const db = common_vendor.wx$1.cloud.database();
      db.collection("refund_requests").where({
        _id: this.orderId
      }).get({
        success: (res) => {
          if (res.data && res.data.length > 0) {
            common_vendor.index.__f__("log", "at pages/deposit/pay.vue:415", "找到退款记录:", res.data[0]);
            const refundData = res.data[0];
            this.hasRefundRequest = true;
            this.refundInfo = refundData;
            this.refundStatus = refundData.status || "待审核";
            this.orderId = refundData.orderId || "";
            this.productName = refundData.productName || "POS机";
            this.amount = refundData.amount || 99;
            this.serialNumber = refundData.serialNumber || "";
            this.isDetailMode = true;
            if (refundData.orderId) {
              this.loadOriginalOrder(refundData.orderId);
            } else {
              common_vendor.index.hideLoading();
            }
          } else {
            this.loadOrderFromId();
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:440", "查询退款记录失败:", err);
          this.loadOrderFromId();
        }
      });
    },
    // 根据ID直接从订单表加载数据
    loadOrderFromId() {
      const db = common_vendor.wx$1.cloud.database();
      db.collection("user").doc(this.orderId).get({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deposit/pay.vue:452", "获取订单信息成功:", res.data);
          this.orderInfo = res.data;
          this.productName = res.data.productName || "POS机";
          this.amount = res.data.deposit || 99;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:459", "获取订单信息失败:", err);
          this.productName = "POS机";
          this.amount = 99;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "订单信息加载失败",
            icon: "none"
          });
        }
      });
    },
    // 加载原始订单信息
    loadOriginalOrder(originalOrderId) {
      if (!originalOrderId) {
        common_vendor.index.hideLoading();
        return;
      }
      const db = common_vendor.wx$1.cloud.database();
      db.collection("user").doc(originalOrderId).get({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deposit/pay.vue:483", "获取原始订单成功:", res.data);
          this.orderInfo = res.data;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:488", "获取原始订单失败:", err);
          common_vendor.index.hideLoading();
        }
      });
    },
    // 上传机器照片
    uploadImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["camera", "album"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.machineImage = tempFilePath;
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          const cloudPath = `refund/${this.orderId}_${(/* @__PURE__ */ new Date()).getTime()}${tempFilePath.match(/\.[^.]+?$/)[0]}`;
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath,
            filePath: tempFilePath,
            success: (res2) => {
              common_vendor.index.__f__("log", "at pages/deposit/pay.vue:517", "上传成功", res2);
              this.machineImageCloud = res2.fileID;
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "上传成功",
                icon: "success"
              });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/deposit/pay.vue:526", "上传失败", err);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "上传失败，请重试",
                icon: "none"
              });
            }
          });
        }
      });
    },
    // 返回上一页
    goBack() {
      if (this.isDetailMode) {
        common_vendor.index.navigateBack({
          delta: 1
        });
      } else {
        common_vendor.index.navigateBack();
      }
    },
    // 处理退款申请
    handleAction() {
      if (!this.serialNumber) {
        common_vendor.index.showToast({
          title: "请输入POS机序列号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "申请中..."
      });
      common_vendor.index.__f__("log", "at pages/deposit/pay.vue:568", "准备提交退款申请，订单ID:", this.orderId);
      common_vendor.index.__f__("log", "at pages/deposit/pay.vue:569", "订单信息:", this.orderInfo);
      const refundData = {
        orderId: this.orderId,
        serialNumber: this.serialNumber,
        amount: this.amount,
        refundMethod: this.refundMethod,
        machineImage: this.machineImageCloud,
        applyTime: /* @__PURE__ */ new Date(),
        status: "待审核",
        // 待审核、已通过、已拒绝
        productName: this.productName,
        userId: common_vendor.index.getStorageSync("userId") || this.orderInfo.userId || "",
        // 优先使用本地存储的用户ID
        refundReason: "机器已激活",
        // 退款原因
        contactPhone: this.orderInfo.phone || this.orderInfo.contactPhone || "",
        // 联系电话
        name: this.orderInfo.name || this.orderInfo.receiver || "",
        // 申请人姓名
        // 添加更多关联信息，方便查询
        orderInfo: {
          id: this.orderId,
          productName: this.productName,
          deposit: this.amount
        }
      };
      const db = common_vendor.wx$1.cloud.database();
      db.collection("refund_requests").add({
        data: refundData,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deposit/pay.vue:597", "申请提交成功", res);
          common_vendor.index.__f__("log", "at pages/deposit/pay.vue:598", "生成的记录ID:", res._id);
          common_vendor.index.setStorageSync("lastRefundId", res._id);
          common_vendor.index.setStorageSync("lastRefundOrderId", this.orderId);
          common_vendor.index.hideLoading();
          this.paymentSuccess = true;
          this.showResult = true;
          this.refundInfo = {
            ...refundData,
            _id: res._id
          };
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:615", "申请提交失败", err);
          common_vendor.index.hideLoading();
          this.paymentSuccess = false;
          this.showResult = true;
          common_vendor.index.showModal({
            title: "提交失败",
            content: "错误详情: " + JSON.stringify(err),
            showCancel: false
          });
        }
      });
    },
    // 处理结果弹窗操作
    handleResultAction() {
      if (this.paymentSuccess) {
        this.showResult = false;
        this.hasRefundRequest = true;
        this.isDetailMode = true;
        this.refundInfo = {
          serialNumber: this.serialNumber,
          machineImage: this.machineImageCloud,
          status: "待审核",
          applyTime: /* @__PURE__ */ new Date()
        };
        common_vendor.wx$1.cloud.init({
          env: "cloud1-9grox8bwd6dbce0c",
          traceUser: true
        });
        setTimeout(() => {
          this.checkRefundRequest();
        }, 1e3);
      } else {
        this.showResult = false;
      }
    },
    // 检查是否已申请退款
    checkRefundRequest() {
      if (!this.orderId) {
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      const db = common_vendor.wx$1.cloud.database();
      db.collection("refund_requests").where({
        orderId: this.orderId
      }).orderBy("applyTime", "desc").limit(1).get({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deposit/pay.vue:681", "退款申请查询结果:", res.data);
          if (res.data && res.data.length > 0) {
            this.hasRefundRequest = true;
            this.refundInfo = res.data[0];
            this.refundStatus = res.data[0].status || "待审核";
          } else {
            this.hasRefundRequest = false;
          }
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:692", "查询退款申请失败:", err);
          this.hasRefundRequest = false;
          common_vendor.index.hideLoading();
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
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 预览图片
    previewImage(fileID) {
      common_vendor.wx$1.cloud.getTempFileURL({
        fileList: [fileID],
        success: (res) => {
          const tempUrl = res.fileList[0].tempFileURL;
          common_vendor.index.previewImage({
            urls: [tempUrl],
            current: tempUrl
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deposit/pay.vue:734", "获取图片链接失败:", err);
          common_vendor.index.showToast({
            title: "图片加载失败",
            icon: "none"
          });
        }
      });
    },
    // 重置申请（当申请被拒绝时）
    resetApplication() {
      this.hasRefundRequest = false;
      this.serialNumber = this.refundInfo.serialNumber || "";
      this.machineImage = "";
      this.machineImageCloud = "";
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
    // 跳转到退款记录页面
    goToRefundOrders() {
      common_vendor.index.navigateTo({
        url: "/pages/deposit/refund-orders"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isDetailMode
  }, !$data.isDetailMode ? {
    b: common_vendor.o((...args) => $options.goToRefundOrders && $options.goToRefundOrders(...args))
  } : {}, {
    c: common_vendor.t($data.amount),
    d: common_vendor.t($data.orderId),
    e: common_vendor.t($data.productName),
    f: $data.hasRefundRequest
  }, $data.hasRefundRequest ? common_vendor.e({
    g: common_vendor.t($options.formatDate($data.refundInfo.applyTime)),
    h: $data.refundInfo.status !== "已拒绝" ? 1 : "",
    i: $data.refundInfo.status === "待审核" ? 1 : "",
    j: common_vendor.t($data.refundInfo.approveTime ? $options.formatDate($data.refundInfo.approveTime) : ""),
    k: ["已通过", "已退款"].includes($data.refundInfo.status) ? 1 : "",
    l: $data.refundInfo.status === "已通过" ? 1 : "",
    m: common_vendor.t($data.refundInfo.refundTime ? $options.formatDate($data.refundInfo.refundTime) : ""),
    n: $data.refundInfo.status === "已退款" ? 1 : "",
    o: $data.refundInfo.status === "已退款" ? 1 : "",
    p: common_vendor.t($data.statusMap[$data.refundInfo.status] || "处理中"),
    q: common_vendor.n({
      "status-rejected": $data.refundInfo.status === "已拒绝"
    }),
    r: $data.refundInfo.status === "已拒绝"
  }, $data.refundInfo.status === "已拒绝" ? {
    s: common_vendor.t($data.refundInfo.rejectReason || "序列号验证失败，请确认POS机是否已激活")
  } : {}, {
    t: common_vendor.t($data.refundInfo.serialNumber),
    v: $data.refundInfo.machineImage
  }, $data.refundInfo.machineImage ? {
    w: common_vendor.o(($event) => $options.previewImage($data.refundInfo.machineImage))
  } : {}, {
    x: common_vendor.t($options.formatDate($data.refundInfo.applyTime)),
    y: $data.refundInfo.status === "已拒绝"
  }, $data.refundInfo.status === "已拒绝" ? {
    z: common_vendor.o((...args) => $options.resetApplication && $options.resetApplication(...args))
  } : {}) : {}, {
    A: !$data.hasRefundRequest
  }, !$data.hasRefundRequest ? common_vendor.e({
    B: $data.serialNumber,
    C: common_vendor.o(($event) => $data.serialNumber = $event.detail.value),
    D: $data.machineImage
  }, $data.machineImage ? {
    E: $data.machineImage
  } : {}, {
    F: common_vendor.o((...args) => $options.uploadImage && $options.uploadImage(...args))
  }) : {}, {
    G: !$data.hasRefundRequest
  }, !$data.hasRefundRequest ? {
    H: common_assets._imports_0$1,
    I: $data.refundMethod === "wechat" ? 1 : "",
    J: common_vendor.o(($event) => $data.refundMethod = "wechat")
  } : {}, {
    K: !$data.hasRefundRequest
  }, !$data.hasRefundRequest ? {} : {}, {
    L: common_vendor.t($data.isDetailMode ? "返回列表" : "返回"),
    M: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    N: !$data.hasRefundRequest
  }, !$data.hasRefundRequest ? {
    O: common_vendor.o((...args) => $options.handleAction && $options.handleAction(...args))
  } : {}, {
    P: $data.hasRefundRequest
  }, $data.hasRefundRequest ? {
    Q: common_vendor.o((...args) => $options.contactService && $options.contactService(...args))
  } : {}, {
    R: $data.showResult
  }, $data.showResult ? {
    S: common_vendor.t($data.paymentSuccess ? "√" : "×"),
    T: $data.paymentSuccess ? 1 : "",
    U: common_vendor.t($data.paymentSuccess ? "申请成功" : "申请失败"),
    V: common_vendor.t($data.paymentSuccess ? "您的退款申请已提交，将在1-3个工作日内处理" : "请稍后重试或联系客服"),
    W: common_vendor.t($data.paymentSuccess ? "确定" : "重试"),
    X: common_vendor.o((...args) => $options.handleResultAction && $options.handleResultAction(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/deposit/pay.js.map
