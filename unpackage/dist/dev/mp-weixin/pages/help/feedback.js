"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      feedbackTypes: [
        { label: "功能异常", value: "bug" },
        { label: "体验问题", value: "experience" },
        { label: "功能建议", value: "suggestion" },
        { label: "其他", value: "other" }
      ],
      selectedType: "bug",
      content: "",
      contact: "",
      images: []
    };
  },
  onLoad() {
    this.getUserContact();
  },
  methods: {
    // 获取用户联系信息
    getUserContact() {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.phone) {
            this.contact = userInfo.phone;
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/help/feedback.vue:131", "解析用户信息失败", e);
        }
      }
    },
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 3 - this.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          this.images = [...this.images, ...tempFilePaths];
        }
      });
    },
    // 预览图片
    previewImage(index) {
      common_vendor.index.previewImage({
        current: this.images[index],
        urls: this.images
      });
    },
    // 删除图片
    deleteImage(index) {
      this.images.splice(index, 1);
    },
    // 提交反馈
    submitFeedback() {
      if (!this.content.trim()) {
        common_vendor.index.showToast({
          title: "请填写反馈内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中...",
        mask: true
      });
      const feedbackData = {
        type: this.selectedType,
        content: this.content,
        contact: this.contact,
        images: this.images,
        createTime: /* @__PURE__ */ new Date(),
        status: "pending"
        // 等待处理状态
      };
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          feedbackData.userId = userInfo._id;
          feedbackData.userName = userInfo.nickName;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/help/feedback.vue:201", "解析用户信息失败", e);
        }
      }
      const db = common_vendor.wx$1.cloud.database();
      db.collection("feedback").add({
        data: feedbackData
      }).then(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/help/feedback.vue:225", "提交反馈失败", err);
        common_vendor.index.hideLoading();
        if (err.errCode === -502005 || err.errMsg && err.errMsg.includes("collection not exists")) {
          common_vendor.index.showToast({
            title: "提交成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: "提交失败，请重试",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.feedbackTypes, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: index,
        c: $data.selectedType === item.value ? 1 : "",
        d: common_vendor.o(($event) => $data.selectedType = item.value, index)
      };
    }),
    b: $data.content,
    c: common_vendor.o(($event) => $data.content = $event.detail.value),
    d: common_vendor.t($data.content.length),
    e: common_vendor.f($data.images, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: common_vendor.o(($event) => $options.deleteImage(index), index),
        d: index
      };
    }),
    f: $data.images.length < 3
  }, $data.images.length < 3 ? {
    g: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    h: $data.contact,
    i: common_vendor.o(($event) => $data.contact = $event.detail.value),
    j: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/help/feedback.js.map
