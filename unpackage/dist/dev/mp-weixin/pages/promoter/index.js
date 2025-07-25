"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        avatar: "",
        nickName: ""
      },
      promoterInfo: {
        level: "初级推广员",
        balance: "0.00",
        totalIncome: "0.00"
      },
      statsData: [
        { label: "团队人数", value: "0" },
        { label: "今日收益", value: "0.00" },
        { label: "本月收益", value: "0.00" },
        { label: "已提现金额", value: "0.00" }
      ],
      timeTabs: ["今日", "本周", "本月", "全部"],
      activeTimeTab: 2,
      menuItems: [
        {
          text: "收益明细",
          url: "/pages/promoter/income",
          icon: "https://cdn-icons-png.flaticon.com/128/2529/2529396.png"
        },
        {
          text: "团队管理",
          url: "/pages/promoter/team",
          icon: "https://cdn-icons-png.flaticon.com/128/476/476863.png"
        },
        {
          text: "提现记录",
          url: "/pages/promoter/withdraw",
          icon: "https://cdn-icons-png.flaticon.com/128/1611/1611179.png"
        },
        {
          text: "推广海报",
          url: "/pages/promoter/poster",
          icon: "https://cdn-icons-png.flaticon.com/128/3658/3658773.png"
        }
      ],
      promotionTips: [
        "向有POS机需求的商户推荐我们的产品",
        "通过朋友圈分享产品优势和推广码",
        "加入本地商户交流群进行推广",
        "利用节假日活动期间进行促销推广"
      ]
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.checkLoginStatus();
    this.loadPromoterData();
  },
  onPullDownRefresh() {
    this.checkLoginStatus();
    this.loadPromoterData();
    setTimeout(() => {
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      } else {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          showCancel: false,
          success: () => {
            common_vendor.index.switchTab({
              url: "/pages/user/index"
            });
          }
        });
      }
    },
    // 加载推广员数据
    loadPromoterData() {
      if (!this.userInfo.nickName)
        return;
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        this.promoterInfo = {
          level: "初级推广员",
          balance: "0.00",
          totalIncome: "0.00"
        };
        this.statsData = [
          { label: "团队人数", value: "0" },
          { label: "今日收益", value: "0.00" },
          { label: "本月收益", value: "0.00" },
          { label: "已提现金额", value: "0.00" }
        ];
        common_vendor.index.hideLoading();
      }, 500);
    },
    // 切换时间标签
    switchTimeTab(index) {
      this.activeTimeTab = index;
    },
    // 处理提现
    handleWithdraw() {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }
      if (parseFloat(this.promoterInfo.balance) <= 0) {
        common_vendor.index.showToast({
          title: "暂无可提现金额",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/promoter/withdraw"
      });
    },
    // 页面导航
    navigateTo(url) {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }
      common_vendor.index.navigateTo({
        url
      });
    },
    // 保存二维码
    saveQRCode() {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }
      common_vendor.index.showToast({
        title: "二维码保存成功",
        icon: "success"
      });
    },
    // 分享给好友
    shareToFriends() {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatar || "https://cdn-icons-png.flaticon.com/128/847/847969.png",
    b: common_vendor.t($data.userInfo.nickName || "请先登录"),
    c: common_vendor.t($data.promoterInfo.level || "普通用户"),
    d: common_vendor.t($data.promoterInfo.balance || "0.00"),
    e: common_vendor.t($data.promoterInfo.totalIncome || "0.00"),
    f: common_vendor.o((...args) => $options.handleWithdraw && $options.handleWithdraw(...args)),
    g: common_vendor.o(($event) => $options.navigateTo("/pages/promoter/join")),
    h: common_vendor.f($data.statsData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.value),
        b: common_vendor.t(item.label),
        c: index
      };
    }),
    i: common_vendor.f($data.timeTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: $data.activeTimeTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTimeTab(index), index)
      };
    }),
    j: common_vendor.f($data.menuItems, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.text),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      };
    }),
    k: common_vendor.o((...args) => $options.saveQRCode && $options.saveQRCode(...args)),
    l: common_vendor.o((...args) => $options.shareToFriends && $options.shareToFriends(...args)),
    m: common_vendor.f($data.promotionTips, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/promoter/index.js.map
