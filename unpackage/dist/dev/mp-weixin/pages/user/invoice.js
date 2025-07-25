"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeTab: "all",
      showModal: false,
      invoiceTypes: ["增值税电子普通发票", "增值税专用发票"],
      invoiceTypeIndex: 0,
      orderOptions: [
        { id: 0, text: "请选择订单", value: "" },
        {
          id: 1,
          text: "订单号: PO20231001001 - ¥99.00",
          value: "PO20231001001"
        },
        {
          id: 2,
          text: "订单号: PO20231005002 - ¥199.00",
          value: "PO20231005002"
        },
        {
          id: 3,
          text: "订单号: PO20231010003 - ¥299.00",
          value: "PO20231010003"
        }
      ],
      orderIndex: 0,
      applyForm: {
        titleType: "personal",
        title: "",
        taxNumber: "",
        orderId: "",
        email: "",
        remark: ""
      },
      invoices: [
        {
          id: 1,
          title: "张三",
          amount: "99.00",
          date: "2023-10-15",
          orderNo: "PO20231001001",
          status: "completed",
          type: "增值税电子普通发票",
          pdfUrl: "https://example.com/invoice_1.pdf",
          email: "zhangsan@example.com"
        },
        {
          id: 2,
          title: "北京科技有限公司",
          amount: "199.00",
          date: "2023-10-20",
          orderNo: "PO20231005002",
          status: "pending",
          type: "增值税专用发票",
          taxNumber: "91110000123456789A",
          email: "finance@company.com"
        },
        {
          id: 3,
          title: "李四",
          amount: "299.00",
          date: "2023-10-25",
          orderNo: "PO20231010003",
          status: "completed",
          type: "增值税电子普通发票",
          pdfUrl: "https://example.com/invoice_3.pdf",
          email: "lisi@example.com"
        }
      ]
    };
  },
  computed: {
    filteredInvoices() {
      if (this.activeTab === "all") {
        return this.invoices;
      } else if (this.activeTab === "pending") {
        return this.invoices.filter((invoice) => invoice.status === "pending");
      } else if (this.activeTab === "completed") {
        return this.invoices.filter(
          (invoice) => invoice.status === "completed"
        );
      }
      return this.invoices;
    }
  },
  methods: {
    // 切换标签
    switchTab(tab) {
      this.activeTab = tab;
    },
    // 获取状态样式类
    getStatusClass(status) {
      return {
        completed: status === "completed",
        pending: status === "pending"
      };
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        completed: "已开票",
        pending: "开票中"
      };
      return statusMap[status] || status;
    },
    // 查看发票详情
    viewInvoiceDetail(invoice) {
      common_vendor.index.showModal({
        title: "发票详情",
        content: `发票抬头: ${invoice.title}
发票金额: ¥${invoice.amount}
开票日期: ${invoice.date}
发票类型: ${invoice.type}
${invoice.taxNumber ? "税号: " + invoice.taxNumber : ""}`,
        showCancel: false,
        confirmText: "确定"
      });
    },
    // 下载发票
    downloadInvoice(invoice) {
      common_vendor.index.showLoading({
        title: "准备下载..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "下载提示",
          content: `由于微信小程序限制，请复制链接在浏览器中下载发票`,
          confirmText: "复制链接",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.setClipboardData({
                data: invoice.pdfUrl,
                success: () => {
                  common_vendor.index.showToast({
                    title: "链接已复制",
                    icon: "success"
                  });
                }
              });
            }
          }
        });
      }, 1e3);
    },
    // 发送邮箱
    sendEmail(invoice) {
      common_vendor.index.showLoading({
        title: "发送中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发票已发送至邮箱",
          icon: "success"
        });
      }, 1500);
    },
    // 显示申请表单
    showApplyForm() {
      this.showModal = true;
    },
    // 隐藏申请表单
    hideApplyForm() {
      this.showModal = false;
      this.applyForm = {
        titleType: "personal",
        title: "",
        taxNumber: "",
        orderId: "",
        email: "",
        remark: ""
      };
      this.invoiceTypeIndex = 0;
      this.orderIndex = 0;
    },
    // 选择发票类型
    onInvoiceTypeChange(e) {
      this.invoiceTypeIndex = e.detail.value;
    },
    // 选择订单
    onOrderChange(e) {
      this.orderIndex = e.detail.value;
      this.applyForm.orderId = this.orderOptions[this.orderIndex].value;
    },
    // 提交申请
    submitApply() {
      if (!this.applyForm.title) {
        common_vendor.index.showToast({
          title: "请输入发票抬头",
          icon: "none"
        });
        return;
      }
      if (this.applyForm.titleType === "company" && !this.applyForm.taxNumber) {
        common_vendor.index.showToast({
          title: "请输入税号",
          icon: "none"
        });
        return;
      }
      if (!this.applyForm.orderId) {
        common_vendor.index.showToast({
          title: "请选择订单",
          icon: "none"
        });
        return;
      }
      if (!this.applyForm.email) {
        common_vendor.index.showToast({
          title: "请输入收票邮箱",
          icon: "none"
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.applyForm.email)) {
        common_vendor.index.showToast({
          title: "邮箱格式不正确",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const selectedOrder = this.orderOptions.find(
          (order) => order.value === this.applyForm.orderId
        );
        if (selectedOrder) {
          const orderAmount = selectedOrder.text.match(/¥([\d.]+)/)[1];
          const newInvoice = {
            id: this.invoices.length + 1,
            title: this.applyForm.title,
            amount: orderAmount,
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            orderNo: this.applyForm.orderId,
            status: "pending",
            type: this.invoiceTypes[this.invoiceTypeIndex],
            email: this.applyForm.email
          };
          if (this.applyForm.titleType === "company") {
            newInvoice.taxNumber = this.applyForm.taxNumber;
          }
          this.invoices.unshift(newInvoice);
        }
        this.hideApplyForm();
        common_vendor.index.showToast({
          title: "申请提交成功",
          icon: "success"
        });
        this.activeTab = "pending";
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.activeTab === "all" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab("all")),
    c: $data.activeTab === "pending" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("pending")),
    e: $data.activeTab === "completed" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchTab("completed")),
    g: common_vendor.o((...args) => $options.showApplyForm && $options.showApplyForm(...args)),
    h: $options.filteredInvoices.length > 0
  }, $options.filteredInvoices.length > 0 ? {
    i: common_vendor.f($options.filteredInvoices, (invoice, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(invoice.title),
        b: common_vendor.t(invoice.amount),
        c: common_vendor.t(invoice.date),
        d: common_vendor.t(invoice.orderNo),
        e: common_vendor.t($options.getStatusText(invoice.status)),
        f: common_vendor.n($options.getStatusClass(invoice.status)),
        g: invoice.status === "completed"
      }, invoice.status === "completed" ? {
        h: common_vendor.o(($event) => $options.downloadInvoice(invoice), index)
      } : {}, {
        i: invoice.status === "completed"
      }, invoice.status === "completed" ? {
        j: common_vendor.o(($event) => $options.sendEmail(invoice), index)
      } : {}, {
        k: index,
        l: common_vendor.o(($event) => $options.viewInvoiceDetail(invoice), index)
      });
    })
  } : {}, {
    j: $options.filteredInvoices.length === 0
  }, $options.filteredInvoices.length === 0 ? {
    k: common_vendor.o((...args) => $options.showApplyForm && $options.showApplyForm(...args))
  } : {}, {
    l: $data.showModal
  }, $data.showModal ? common_vendor.e({
    m: common_vendor.o((...args) => $options.hideApplyForm && $options.hideApplyForm(...args)),
    n: common_vendor.o((...args) => $options.hideApplyForm && $options.hideApplyForm(...args)),
    o: common_vendor.t($data.invoiceTypes[$data.invoiceTypeIndex]),
    p: $data.invoiceTypes,
    q: common_vendor.o((...args) => $options.onInvoiceTypeChange && $options.onInvoiceTypeChange(...args)),
    r: $data.applyForm.titleType === "personal" ? 1 : "",
    s: common_vendor.o(($event) => $data.applyForm.titleType = "personal"),
    t: $data.applyForm.titleType === "company" ? 1 : "",
    v: common_vendor.o(($event) => $data.applyForm.titleType = "company"),
    w: $data.applyForm.title,
    x: common_vendor.o(($event) => $data.applyForm.title = $event.detail.value),
    y: $data.applyForm.titleType === "company"
  }, $data.applyForm.titleType === "company" ? {
    z: $data.applyForm.taxNumber,
    A: common_vendor.o(($event) => $data.applyForm.taxNumber = $event.detail.value)
  } : {}, {
    B: common_vendor.t($data.orderOptions[$data.orderIndex].text),
    C: $data.orderOptions,
    D: common_vendor.o((...args) => $options.onOrderChange && $options.onOrderChange(...args)),
    E: $data.applyForm.email,
    F: common_vendor.o(($event) => $data.applyForm.email = $event.detail.value),
    G: $data.applyForm.remark,
    H: common_vendor.o(($event) => $data.applyForm.remark = $event.detail.value),
    I: common_vendor.o((...args) => $options.hideApplyForm && $options.hideApplyForm(...args)),
    J: common_vendor.o((...args) => $options.submitApply && $options.submitApply(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/invoice.js.map
