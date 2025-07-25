"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      promotionData: {
        inviteCount: 12,
        successCount: 8,
        totalReward: 120.5,
        promotionId: "P" + (/* @__PURE__ */ new Date()).getTime().toString().slice(-6)
      },
      rules: [
        "邀请好友注册并实名认证，双方各获得5元现金奖励",
        "好友成功申请POS机并激活，您将获得20元现金奖励",
        "好友每成功推荐一位新用户，您将额外获得5元奖励",
        "奖励金额将在3个工作日内自动发放至您的账户余额",
        "本活动最终解释权归平台所有"
      ],
      promotionRecords: [
        {
          avatar: "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
          username: "用户1358***",
          time: "2023-06-15 14:30",
          reward: 5,
          status: "success",
          statusText: "已到账"
        },
        {
          avatar: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
          username: "用户2468***",
          time: "2023-06-10 09:15",
          reward: 20,
          status: "success",
          statusText: "已到账"
        },
        {
          avatar: "https://cdn-icons-png.flaticon.com/128/4140/4140061.png",
          username: "用户7890***",
          time: "2023-06-05 16:45",
          reward: 5,
          status: "pending",
          statusText: "处理中"
        }
      ]
    };
  },
  onLoad() {
    this.getPromotionData();
  },
  methods: {
    // 获取推广数据
    getPromotionData() {
      common_vendor.index.__f__("log", "at pages/activity/promotion.vue:217", "获取推广数据");
    },
    // 分享到微信好友
    shareToWechat() {
      common_vendor.index.showToast({
        title: "请点击右上角分享",
        icon: "none"
      });
    },
    // 分享到朋友圈
    shareToMoments() {
      common_vendor.index.showToast({
        title: "请点击右上角分享",
        icon: "none"
      });
    },
    // 生成海报
    generatePoster() {
      common_vendor.index.showLoading({
        title: "生成中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "海报已生成",
          icon: "success"
        });
      }, 1500);
    },
    // 复制推广链接
    copyLink() {
      common_vendor.index.setClipboardData({
        data: "https://example.com/promotion?id=" + this.promotionData.promotionId,
        success: () => {
          common_vendor.index.showToast({
            title: "链接已复制",
            icon: "success"
          });
        }
      });
    },
    // 查看全部记录
    viewAllRecords() {
      common_vendor.index.navigateTo({
        url: "/pages/activity/promotion-records"
      });
    },
    // 邀请好友
    inviteFriends() {
      common_vendor.index.showToast({
        title: "请点击右上角分享",
        icon: "none"
      });
    }
  },
  // 设置分享信息
  onShareAppMessage() {
    return {
      title: "邀请您加入POS机申请平台，双方各得5元奖励！",
      path: "/pages/index/index?promotionId=" + this.promotionData.promotionId,
      imageUrl: "https://cdn-icons-png.flaticon.com/128/3406/3406886.png"
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.promotionData.inviteCount),
    b: common_vendor.t($data.promotionData.successCount),
    c: common_vendor.t($data.promotionData.totalReward),
    d: common_vendor.f($data.rules, (rule, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(rule),
        c: index
      };
    }),
    e: common_vendor.o((...args) => $options.shareToWechat && $options.shareToWechat(...args)),
    f: common_vendor.o((...args) => $options.shareToMoments && $options.shareToMoments(...args)),
    g: common_vendor.o((...args) => $options.generatePoster && $options.generatePoster(...args)),
    h: common_vendor.o((...args) => $options.copyLink && $options.copyLink(...args)),
    i: common_vendor.t($data.promotionData.promotionId),
    j: common_vendor.o((...args) => $options.viewAllRecords && $options.viewAllRecords(...args)),
    k: $data.promotionRecords.length > 0
  }, $data.promotionRecords.length > 0 ? {
    l: common_vendor.f($data.promotionRecords, (record, index, i0) => {
      return {
        a: record.avatar,
        b: common_vendor.t(record.username),
        c: common_vendor.t(record.time),
        d: common_vendor.t(record.reward),
        e: common_vendor.t(record.statusText),
        f: common_vendor.n(record.status),
        g: index
      };
    })
  } : {}, {
    m: common_vendor.o((...args) => $options.inviteFriends && $options.inviteFriends(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/activity/promotion.js.map
