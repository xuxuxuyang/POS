"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKey: "",
      activeTab: "all",
      tabs: [
        { id: "all", name: "全部" },
        { id: "manual", name: "用户手册" },
        { id: "tutorial", name: "操作教程" },
        { id: "form", name: "表格模板" },
        { id: "software", name: "软件工具" }
      ],
      documents: [
        {
          id: "d001",
          title: "POS机用户使用手册",
          description: "详细介绍POS机的功能、操作方法及注意事项",
          fileType: "pdf",
          fileSize: "2.5MB",
          updateTime: "2023-10-15",
          downloads: 1245,
          category: "manual",
          url: "https://example.com/files/pos_manual.pdf"
        },
        {
          id: "d002",
          title: "收款交易操作指南",
          description: "包含各种收款方式的详细操作流程",
          fileType: "pdf",
          fileSize: "1.8MB",
          updateTime: "2023-09-25",
          downloads: 986,
          category: "tutorial",
          url: "https://example.com/files/payment_guide.pdf"
        },
        {
          id: "d003",
          title: "商户结算对账表",
          description: "标准商户结算对账表格模板",
          fileType: "excel",
          fileSize: "568KB",
          updateTime: "2023-11-05",
          downloads: 752,
          category: "form",
          url: "https://example.com/files/settlement_template.xlsx"
        },
        {
          id: "d004",
          title: "POS机故障排查手册",
          description: "常见故障原因分析与解决方案",
          fileType: "pdf",
          fileSize: "3.2MB",
          updateTime: "2023-10-28",
          downloads: 645,
          category: "manual",
          url: "https://example.com/files/troubleshooting_guide.pdf"
        },
        {
          id: "d005",
          title: "POS机系统升级工具",
          description: "用于升级POS机系统版本的PC端工具",
          fileType: "exe",
          fileSize: "12.5MB",
          updateTime: "2023-11-10",
          downloads: 423,
          category: "software",
          url: "https://example.com/files/pos_updater.exe"
        },
        {
          id: "d006",
          title: "商户日常交易记录表",
          description: "用于记录日常交易流水的Excel模板",
          fileType: "excel",
          fileSize: "425KB",
          updateTime: "2023-09-18",
          downloads: 389,
          category: "form",
          url: "https://example.com/files/transaction_record.xlsx"
        },
        {
          id: "d007",
          title: "POS机收银员培训教程",
          description: "面向收银员的POS机操作培训教程",
          fileType: "ppt",
          fileSize: "5.7MB",
          updateTime: "2023-08-20",
          downloads: 347,
          category: "tutorial",
          url: "https://example.com/files/cashier_training.pptx"
        },
        {
          id: "d008",
          title: "交易数据导出工具",
          description: "用于导出POS机交易数据的小工具",
          fileType: "zip",
          fileSize: "4.3MB",
          updateTime: "2023-10-05",
          downloads: 298,
          category: "software",
          url: "https://example.com/files/data_export_tool.zip"
        },
        {
          id: "d009",
          title: "POS机硬件规格说明书",
          description: "详细介绍POS机硬件参数与接口说明",
          fileType: "pdf",
          fileSize: "1.5MB",
          updateTime: "2023-07-15",
          downloads: 276,
          category: "manual",
          url: "https://example.com/files/hardware_specs.pdf"
        },
        {
          id: "d010",
          title: "商户进件资料清单",
          description: "商户申请所需提交的资料清单",
          fileType: "word",
          fileSize: "325KB",
          updateTime: "2023-11-02",
          downloads: 254,
          category: "form",
          url: "https://example.com/files/merchant_checklist.docx"
        }
      ],
      applyForm: {
        title: "",
        description: "",
        contact: ""
      }
    };
  },
  computed: {
    // 根据当前分类和搜索关键词过滤文档
    filteredDocs() {
      let result = this.documents;
      if (this.activeTab !== "all") {
        result = result.filter((item) => item.category === this.activeTab);
      }
      if (this.searchKey.trim()) {
        const key = this.searchKey.trim().toLowerCase();
        result = result.filter(
          (item) => item.title.toLowerCase().includes(key) || item.description.toLowerCase().includes(key)
        );
      }
      return result;
    },
    // 热门文档列表
    hotDocs() {
      return [...this.documents].sort((a, b) => b.downloads - a.downloads).slice(0, 5);
    }
  },
  onLoad() {
    this.getDocumentList();
    this.getUserInfo();
  },
  methods: {
    // 获取文档列表
    getDocumentList() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
      }, 500);
    },
    // 获取用户信息
    getUserInfo() {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo && userInfo.phone) {
            this.applyForm.contact = userInfo.phone;
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/guide/download.vue:332", "解析用户信息失败", e);
        }
      }
    },
    // 切换分类标签
    switchTab(tabId) {
      this.activeTab = tabId;
      this.searchKey = "";
    },
    // 搜索文档
    searchDocs() {
      if (!this.searchKey.trim()) {
        this.showToast("请输入搜索关键词");
        return;
      }
      common_vendor.index.hideKeyboard();
    },
    // 获取文件图标
    getFileIcon(fileType) {
      const iconMap = {
        pdf: "https://cdn-icons-png.flaticon.com/128/337/337946.png",
        word: "https://cdn-icons-png.flaticon.com/128/337/337932.png",
        excel: "https://cdn-icons-png.flaticon.com/128/337/337958.png",
        ppt: "https://cdn-icons-png.flaticon.com/128/337/337949.png",
        zip: "https://cdn-icons-png.flaticon.com/128/337/337960.png",
        exe: "https://cdn-icons-png.flaticon.com/128/337/337940.png",
        img: "https://cdn-icons-png.flaticon.com/128/337/337942.png",
        txt: "https://cdn-icons-png.flaticon.com/128/337/337956.png"
      };
      return iconMap[fileType] || "https://cdn-icons-png.flaticon.com/128/337/337937.png";
    },
    // 查看文档详情
    viewDocument(doc) {
      common_vendor.index.showActionSheet({
        itemList: ["查看详情", "立即下载", "分享文档"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.navigateTo({
              url: `/pages/guide/document-detail?id=${doc.id}`
            });
          } else if (res.tapIndex === 1) {
            this.downloadFile(doc);
          } else if (res.tapIndex === 2) {
            this.shareDocument(doc);
          }
        }
      });
    },
    // 下载文件
    downloadFile(doc) {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再下载文档",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/user/index"
              });
            }
          }
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "准备下载...",
        mask: true
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "文件下载",
          content: `是否下载"${doc.title}"(${doc.fileSize})？`,
          success: (res) => {
            if (res.confirm) {
              this.showToast("开始下载，请稍候...");
              doc.downloads += 1;
              setTimeout(() => {
                this.showToast("下载完成");
              }, 2e3);
            }
          }
        });
      }, 500);
    },
    // 分享文档
    shareDocument(doc) {
      common_vendor.index.showToast({
        title: "分享功能开发中",
        icon: "none"
      });
    },
    // 提交资料申请
    submitApply() {
      if (!this.applyForm.title) {
        this.showToast("请输入资料名称");
        return;
      }
      if (!this.applyForm.description) {
        this.showToast("请描述需要的资料内容");
        return;
      }
      if (!this.applyForm.contact) {
        this.showToast("请输入联系方式");
        return;
      }
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再提交申请",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/user/index"
              });
            }
          }
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中...",
        mask: true
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "申请提交成功",
          content: "您的资料申请已提交，我们会尽快处理并与您联系",
          showCancel: false,
          success: () => {
            this.applyForm = {
              title: "",
              description: "",
              contact: this.applyForm.contact
            };
          }
        });
      }, 1e3);
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
    a: common_vendor.o((...args) => $options.searchDocs && $options.searchDocs(...args)),
    b: $data.searchKey,
    c: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    d: common_vendor.o((...args) => $options.searchDocs && $options.searchDocs(...args)),
    e: common_vendor.f($data.tabs, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.activeTab === item.id ? 1 : "",
        c: item.id,
        d: common_vendor.o(($event) => $options.switchTab(item.id), item.id)
      };
    }),
    f: common_vendor.f($options.filteredDocs, (item, index, i0) => {
      return {
        a: $options.getFileIcon(item.fileType),
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.description),
        d: common_vendor.t(item.fileSize),
        e: common_vendor.t(item.updateTime),
        f: common_vendor.t(item.downloads),
        g: common_vendor.o(($event) => $options.downloadFile(item), index),
        h: index,
        i: common_vendor.o(($event) => $options.viewDocument(item), index)
      };
    }),
    g: $options.filteredDocs.length === 0
  }, $options.filteredDocs.length === 0 ? {} : {}, {
    h: $options.filteredDocs.length > 0
  }, $options.filteredDocs.length > 0 ? {
    i: common_vendor.f($options.hotDocs, (item, index, i0) => {
      return {
        a: $options.getFileIcon(item.fileType),
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.downloads),
        d: index,
        e: common_vendor.o(($event) => $options.viewDocument(item), index)
      };
    })
  } : {}, {
    j: $data.applyForm.title,
    k: common_vendor.o(($event) => $data.applyForm.title = $event.detail.value),
    l: $data.applyForm.description,
    m: common_vendor.o(($event) => $data.applyForm.description = $event.detail.value),
    n: $data.applyForm.contact,
    o: common_vendor.o(($event) => $data.applyForm.contact = $event.detail.value),
    p: common_vendor.o((...args) => $options.submitApply && $options.submitApply(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/download.js.map
