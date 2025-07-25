"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentTab: 0,
      tabs: [
        { name: "全部活动", value: "all" },
        { name: "进行中", value: "ongoing" },
        { name: "即将开始", value: "upcoming" },
        { name: "已结束", value: "expired" }
      ],
      activities: [
        {
          id: 1,
          name: "新人特惠",
          description: "新用户首次申请POS机，享受押金减免50%，还有多重好礼相送！",
          dateRange: "2023.6.1-2023.12.31",
          status: "ongoing",
          image: "https://img01.yzcdn.cn/vant/cat.jpeg"
        },
        {
          id: 2,
          name: "618促销季",
          description: "年中大促，全场POS机押金立减100元，限时优惠不容错过！",
          dateRange: "2023.6.1-2023.6.18",
          status: "expired",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
        },
        {
          id: 3,
          name: "夏日大促",
          description: "炎炎夏日，清凉福利来袭，申请指定机型享受交易费率优惠！",
          dateRange: "2023.7.1-2023.7.31",
          status: "upcoming",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"
        },
        {
          id: 4,
          name: "商家福利计划",
          description: "成为我们的合作商家，享受专属服务和优惠政策，共创双赢！",
          dateRange: "2023.6.1-2023.12.31",
          status: "ongoing",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg"
        }
      ]
    };
  },
  computed: {
    filteredActivities() {
      const tabValue = this.tabs[this.currentTab].value;
      if (tabValue === "all") {
        return this.activities;
      } else {
        return this.activities.filter((item) => item.status === tabValue);
      }
    }
  },
  onLoad() {
    this.fetchActivities();
  },
  methods: {
    fetchActivities() {
      common_vendor.index.__f__("log", "at pages/activity/list.vue:128", "获取活动列表");
    },
    switchTab(index) {
      this.currentTab = index;
    },
    goToActivityDetail(activity) {
      common_vendor.index.navigateTo({
        url: "/pages/activity/detail?id=" + activity.id
      });
    },
    getStatusText(status) {
      switch (status) {
        case "ongoing":
          return "进行中";
        case "upcoming":
          return "即将开始";
        case "expired":
          return "已结束";
        default:
          return "";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    b: $options.filteredActivities.length === 0
  }, $options.filteredActivities.length === 0 ? {} : {}, {
    c: common_vendor.f($options.filteredActivities, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t($options.getStatusText(item.status)),
        c: item.status === "expired" ? 1 : "",
        d: common_vendor.t(item.name),
        e: common_vendor.t(item.dateRange),
        f: common_vendor.t(item.description),
        g: index,
        h: common_vendor.o(($event) => $options.goToActivityDetail(item), index)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/activity/list.js.map
