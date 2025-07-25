"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        points: 0
      },
      taskList: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2997/2997933.png",
          name: "每日签到",
          desc: "完成每日签到任务",
          points: 10,
          completed: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1968/1968666.png",
          name: "浏览商品",
          desc: "浏览5个商品详情",
          points: 5,
          completed: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3898/3898082.png",
          name: "分享商品",
          desc: "分享商品给好友",
          points: 2,
          completed: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2361/2361728.png",
          name: "评价订单",
          desc: "评价已完成的订单",
          points: 5,
          completed: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/9464/9464086.png",
          name: "完善资料",
          desc: "完善个人资料",
          points: 20,
          completed: true
        }
      ]
    };
  },
  onLoad() {
    const userInfoStr = common_vendor.index.getStorageSync("userInfo");
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr);
    }
    this.loadTaskStatus();
  },
  methods: {
    // 导航到指定页面
    navigateTo(url) {
      if (url.includes("points-history") || url.includes("points-exchange") || url.includes("points-task")) {
        common_vendor.index.showToast({
          title: "功能开发中...",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url
      });
    },
    // 加载任务状态
    loadTaskStatus() {
      const taskStatus = common_vendor.index.getStorageSync("pointsTaskStatus");
      if (taskStatus) {
        const taskData = JSON.parse(taskStatus);
        const today = (/* @__PURE__ */ new Date()).toDateString();
        if (taskData.date === today) {
          this.taskList.forEach((task, index) => {
            if (taskData.completed && taskData.completed.includes(index)) {
              this.taskList[index].completed = true;
            }
          });
        } else {
          this.taskList[4].completed = true;
          this.saveTaskStatus();
        }
      }
    },
    // 保存任务状态
    saveTaskStatus() {
      const completed = this.taskList.map((task, index) => task.completed ? index : -1).filter((index) => index !== -1);
      const taskStatus = {
        date: (/* @__PURE__ */ new Date()).toDateString(),
        completed
      };
      common_vendor.index.setStorageSync("pointsTaskStatus", JSON.stringify(taskStatus));
    },
    // 完成任务
    completeTask(index) {
      if (this.taskList[index].completed) {
        return;
      }
      switch (index) {
        case 0:
          this.signIn();
          break;
        case 1:
        case 2:
        case 3:
          common_vendor.index.showToast({
            title: "请在对应页面完成任务",
            icon: "none"
          });
          break;
      }
    },
    // 签到功能
    signIn() {
      common_vendor.index.showLoading({
        title: "签到中..."
      });
      setTimeout(() => {
        const points = this.userInfo.points || 0;
        this.userInfo.points = points + 10;
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(this.userInfo));
        this.taskList[0].completed = true;
        this.saveTaskStatus();
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "签到成功 +10积分",
          icon: "success"
        });
        if (this.userInfo._id) {
          const db = common_vendor.wx$1.cloud.database();
          db.collection("userinfo").doc(this.userInfo._id).update({
            data: {
              points: this.userInfo.points
            }
          }).then(() => {
            common_vendor.index.__f__("log", "at pages/user/points.vue:273", "积分更新成功");
          }).catch((err) => {
            common_vendor.index.__f__("error", "at pages/user/points.vue:276", "积分更新失败", err);
          });
        }
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.userInfo.points || 0),
    b: common_vendor.o(($event) => $options.navigateTo("/pages/user/points-history")),
    c: common_vendor.o(($event) => $options.navigateTo("/pages/user/points-exchange")),
    d: common_vendor.o(($event) => $options.navigateTo("/pages/user/points-task")),
    e: common_vendor.f($data.taskList, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.desc),
        d: common_vendor.t(item.completed ? "已完成" : "+" + item.points),
        e: common_vendor.n(item.completed ? "completed" : ""),
        f: common_vendor.o(($event) => $options.completeTask(index), index),
        g: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/points.js.map
