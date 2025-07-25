"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        avatar: "",
        nickName: "",
        userId: "",
        vipLevel: "",
        wallet: "￥99",
        couponCount: 2,
        points: 356
      },
      orderMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2441/2441009.png",
          text: "待审核",
          url: "/pages/order/list?type=pending",
          badge: 0
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/4521/4521931.png",
          text: "待发货",
          url: "/pages/order/list?type=approved",
          badge: 1
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2203/2203145.png",
          text: "已发货",
          url: "/pages/order/list?type=shipped",
          badge: 0
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/4406/4406665.png",
          text: "已完成",
          url: "/pages/order/list?type=completed",
          badge: 0
        }
      ],
      toolsMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1728/1728853.png",
          text: "激活POS机",
          url: "/pages/service/activate",
          isNew: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3349/3349234.png",
          text: "在线预约",
          url: "/pages/service/appointment",
          isNew: true
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1584/1584812.png",
          text: "维修申请",
          url: "/pages/service/repair",
          isNew: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2991/2991251.png",
          text: "使用教程",
          url: "/pages/guide/index",
          isNew: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/4149/4149888.png",
          text: "资料下载",
          url: "/pages/guide/download",
          isNew: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3371/3371540.png",
          text: "查看发票",
          url: "/pages/user/invoice",
          isNew: false
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2258/2258843.png",
          text: "码商加盟",
          url: "/pages/promoter/join",
          isNew: true
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2099/2099203.png",
          text: "更多服务",
          url: "/pages/service/more",
          isNew: false
        }
      ],
      functionMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2474/2474450.png",
          text: "我的押金",
          url: "/pages/deposit/pay"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
          text: "收货地址",
          url: "/pages/user/address"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3781/3781605.png",
          text: "账户安全",
          url: "/pages/user/security",
          tag: "重要"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1384/1384023.png",
          text: "推广中心",
          url: "/pages/promoter/index"
        }
      ],
      supportMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1671/1671060.png",
          text: "在线客服",
          url: "customer_service"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/471/471664.png",
          text: "常见问题",
          url: "/pages/help/index"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2521/2521826.png",
          text: "意见反馈",
          url: "/pages/help/feedback"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1028/1028908.png",
          text: "关于我们",
          url: "/pages/help/about"
        }
      ]
    };
  },
  onLoad() {
    if (!common_vendor.wx$1.cloud.$isInitialized) {
      common_vendor.wx$1.cloud.init({
        env: "cloud1-9grox8bwd6dbce0c",
        traceUser: true
      });
    }
    this.checkLoginStatus();
  },
  onShow() {
    this.checkLoginStatus();
    this.fetchUserData();
  },
  onPullDownRefresh() {
    this.checkLoginStatus();
    this.fetchUserData();
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
        const userId = common_vendor.index.getStorageSync("userId");
        if (userId) {
          const db = common_vendor.wx$1.cloud.database();
          db.collection("userinfo").doc(userId).get({
            success: (res) => {
              if (res.data) {
                common_vendor.index.__f__("log", "at pages/user/index.vue:376", "用户验证成功");
                this.userInfo = res.data;
                common_vendor.index.setStorageSync("userInfo", JSON.stringify(res.data));
              } else {
                common_vendor.index.__f__("log", "at pages/user/index.vue:381", "用户信息已失效，清除登录状态");
                this.clearUserInfo();
              }
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/user/index.vue:386", "验证用户状态失败", err);
              if (err.errCode === -1 || err.errMsg.includes("not exist")) {
                this.clearUserInfo();
              }
            }
          });
        }
      }
    },
    // 清除用户信息
    clearUserInfo() {
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.removeStorageSync("userId");
      this.userInfo = {
        avatar: "",
        nickName: "",
        userId: "",
        vipLevel: "",
        wallet: "",
        couponCount: 0,
        points: 0
      };
    },
    // 获取用户数据
    fetchUserData() {
      if (this.userInfo.nickName && this.userInfo._id) {
        common_vendor.index.showLoading({
          title: "刷新中...",
          mask: false
        });
        const db = common_vendor.wx$1.cloud.database();
        db.collection("userinfo").doc(this.userInfo._id).get({
          success: (res) => {
            if (res.data) {
              common_vendor.index.__f__("log", "at pages/user/index.vue:427", "获取最新用户数据成功");
              this.userInfo = res.data;
              common_vendor.index.setStorageSync("userInfo", JSON.stringify(this.userInfo));
              this.fetchUserOrderCount();
            }
            common_vendor.index.hideLoading();
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/user/index.vue:441", "获取用户数据失败", err);
            common_vendor.index.hideLoading();
          }
        });
      }
    },
    // 获取用户订单数量
    fetchUserOrderCount() {
      if (!this.userInfo._id)
        return;
      const db = common_vendor.wx$1.cloud.database();
      db.command;
      db.collection("user").where({
        userId: this.userInfo._id,
        status: "待审核"
      }).count().then((res) => {
        this.orderMenus[0].badge = res.total || 0;
      });
      db.collection("user").where({
        userId: this.userInfo._id,
        status: "待发货"
      }).count().then((res) => {
        this.orderMenus[1].badge = res.total || 0;
      });
      db.collection("user").where({
        userId: this.userInfo._id,
        status: "已发货"
      }).count().then((res) => {
        this.orderMenus[2].badge = res.total || 0;
      });
      db.collection("user").where({
        userId: this.userInfo._id,
        status: "已完成"
      }).count().then((res) => {
        this.orderMenus[3].badge = res.total || 0;
      });
    },
    // 跳转到设置页面
    goToSettings() {
      if (!this.userInfo.nickName) {
        this.handleWxLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/user/settings"
      });
    },
    // 跳转到订单列表
    goToOrderList() {
      if (!this.userInfo.nickName) {
        this.handleWxLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/order/list"
      });
    },
    // 导航到指定页面
    navigateTo(url) {
      if (url === "customer_service") {
        this.contactCustomerService();
        return;
      }
      if (!this.userInfo.nickName && !url.includes("/pages/help/") && !url.includes("/pages/guide/")) {
        this.handleWxLogin();
        return;
      }
      common_vendor.index.navigateTo({
        url
      });
    },
    // 微信登录方法
    handleWxLogin() {
      common_vendor.index.showLoading({
        title: "登录中...",
        mask: true
      });
      common_vendor.wx$1.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          if (res.userInfo) {
            common_vendor.wx$1.login({
              success: (loginRes) => {
                if (loginRes.code) {
                  const userInfo = {
                    avatar: res.userInfo.avatarUrl || "https://cdn-icons-png.flaticon.com/128/924/924915.png",
                    nickName: res.userInfo.nickName || "微信用户",
                    userId: "U" + (/* @__PURE__ */ new Date()).getTime(),
                    openId: "",
                    // 将由服务器返回
                    vipLevel: "普通用户",
                    wallet: "￥0",
                    couponCount: 0,
                    points: 100,
                    gender: res.userInfo.gender,
                    country: res.userInfo.country,
                    province: res.userInfo.province,
                    city: res.userInfo.city,
                    language: res.userInfo.language,
                    createTime: /* @__PURE__ */ new Date(),
                    lastLoginTime: /* @__PURE__ */ new Date(),
                    phone: "",
                    // 添加手机号字段
                    isPhoneVerified: false,
                    // 是否已验证手机号
                    isProfileCompleted: false
                    // 是否已完善个人资料
                  };
                  const db = common_vendor.wx$1.cloud.database();
                  db.collection("userinfo").where({
                    nickName: userInfo.nickName
                    // 实际项目中应该使用openid查询
                  }).get().then((queryRes) => {
                    if (queryRes.data && queryRes.data.length > 0) {
                      const existUser = queryRes.data[0];
                      const userId = existUser._id;
                      db.collection("userinfo").doc(userId).update({
                        data: {
                          avatar: userInfo.avatar,
                          lastLoginTime: /* @__PURE__ */ new Date()
                          // 更新其他可能变化的信息
                        }
                      }).then(() => {
                        common_vendor.index.__f__("log", "at pages/user/index.vue:613", "用户信息更新成功");
                        userInfo._id = userId;
                        userInfo.points = existUser.points || userInfo.points;
                        userInfo.vipLevel = existUser.vipLevel || userInfo.vipLevel;
                        userInfo.wallet = existUser.wallet || userInfo.wallet;
                        userInfo.couponCount = existUser.couponCount || userInfo.couponCount;
                        userInfo.phone = existUser.phone || "";
                        userInfo.isPhoneVerified = existUser.isPhoneVerified || false;
                        userInfo.isProfileCompleted = existUser.isProfileCompleted || false;
                        this.finishLogin(userInfo);
                        this.checkUserInfoCompletion(userInfo);
                      }).catch((err) => {
                        common_vendor.index.__f__("error", "at pages/user/index.vue:638", "更新用户信息失败", err);
                        this.finishLogin(userInfo);
                        this.checkUserInfoCompletion(userInfo);
                      });
                    } else {
                      db.collection("userinfo").add({
                        data: userInfo
                      }).then((addRes) => {
                        common_vendor.index.__f__("log", "at pages/user/index.vue:649", "用户信息存储成功", addRes);
                        userInfo._id = addRes._id;
                        this.finishLogin(userInfo);
                        this.checkUserInfoCompletion(userInfo);
                      }).catch((err) => {
                        common_vendor.index.__f__("error", "at pages/user/index.vue:657", "存储用户信息失败", err);
                        this.finishLogin(userInfo);
                        this.checkUserInfoCompletion(userInfo);
                      });
                    }
                  }).catch((err) => {
                    common_vendor.index.__f__("error", "at pages/user/index.vue:664", "查询用户信息失败", err);
                    this.finishLogin(userInfo);
                    this.checkUserInfoCompletion(userInfo);
                  });
                } else {
                  common_vendor.index.hideLoading();
                  common_vendor.index.__f__("error", "at pages/user/index.vue:670", "wx.login 失败", loginRes);
                  common_vendor.index.showToast({
                    title: "登录失败",
                    icon: "none"
                  });
                }
              },
              fail: (err) => {
                common_vendor.index.hideLoading();
                common_vendor.index.__f__("error", "at pages/user/index.vue:679", "wx.login 接口调用失败", err);
                common_vendor.index.showToast({
                  title: "网络错误，请重试",
                  icon: "none"
                });
              }
            });
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/user/index.vue:690", "微信登录失败:", err);
          common_vendor.index.showToast({
            title: "您取消了授权",
            icon: "none"
          });
        }
      });
    },
    // 完成登录流程
    finishLogin(userInfo) {
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
      common_vendor.index.setStorageSync("userId", userInfo._id);
      this.userInfo = userInfo;
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "登录成功",
        icon: "success"
      });
    },
    // 检查用户信息完善状态
    checkUserInfoCompletion(userInfo) {
      if (!userInfo.isPhoneVerified) {
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/user/phone-verify?userId=" + userInfo._id
          });
        }, 1e3);
      } else if (!userInfo.isProfileCompleted) {
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/user/profile-setup?userId=" + userInfo._id
          });
        }, 1e3);
      }
    },
    // 验证手机号
    verifyPhoneNumber(phone, code, userId) {
      common_vendor.index.showLoading({
        title: "验证中...",
        mask: true
      });
      const db = common_vendor.wx$1.cloud.database();
      db.collection("userinfo").doc(userId).update({
        data: {
          phone,
          isPhoneVerified: true
        }
      }).then(() => {
        common_vendor.index.__f__("log", "at pages/user/index.vue:759", "手机号验证成功");
        let userInfo = JSON.parse(common_vendor.index.getStorageSync("userInfo") || "{}");
        userInfo.phone = phone;
        userInfo.isPhoneVerified = true;
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        this.userInfo.phone = phone;
        this.userInfo.isPhoneVerified = true;
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "验证成功",
          icon: "success"
        });
        if (!userInfo.isProfileCompleted) {
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/user/profile-setup"
            });
          }, 1e3);
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/index.vue:787", "手机号验证失败", err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "验证失败",
          icon: "none"
        });
      });
    },
    // 完善用户资料
    completeUserProfile(profileData, userId) {
      common_vendor.index.showLoading({
        title: "保存中...",
        mask: true
      });
      const db = common_vendor.wx$1.cloud.database();
      db.collection("userinfo").doc(userId).update({
        data: {
          ...profileData,
          isProfileCompleted: true
        }
      }).then(() => {
        common_vendor.index.__f__("log", "at pages/user/index.vue:814", "用户资料完善成功");
        let userInfo = JSON.parse(common_vendor.index.getStorageSync("userInfo") || "{}");
        userInfo = { ...userInfo, ...profileData, isProfileCompleted: true };
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        this.userInfo = {
          ...this.userInfo,
          ...profileData,
          isProfileCompleted: true
        };
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/user/index.vue:840", "保存用户资料失败", err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      });
    },
    // 联系客服
    contactCustomerService() {
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
    // 显示优惠券提示
    showCouponTip() {
      if (!this.userInfo.nickName) {
        this.handleWxLogin();
        return;
      }
      common_vendor.index.showToast({
        title: "优惠券功能开发中...",
        icon: "none",
        duration: 2e3
      });
    },
    // 退出登录
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            this.clearUserInfo();
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar || "https://cdn-icons-png.flaticon.com/128/847/847969.png",
    b: $data.userInfo.nickName
  }, $data.userInfo.nickName ? {} : {}, {
    c: common_vendor.o(($event) => !$data.userInfo.nickName && $options.handleWxLogin()),
    d: common_vendor.t($data.userInfo.nickName || "点击微信登录"),
    e: $data.userInfo.nickName
  }, $data.userInfo.nickName ? {
    f: common_vendor.t($data.userInfo.userId)
  } : {}, {
    g: $data.userInfo.nickName
  }, $data.userInfo.nickName ? {
    h: common_vendor.t($data.userInfo.vipLevel || "普通用户")
  } : {}, {
    i: common_vendor.o(($event) => !$data.userInfo.nickName && $options.handleWxLogin()),
    j: common_vendor.t($data.userInfo.nickName ? $data.userInfo.wallet || "￥0" : "--"),
    k: common_vendor.o(($event) => $options.navigateTo("/pages/deposit/pay")),
    l: common_vendor.t($data.userInfo.nickName ? $data.userInfo.couponCount || 0 : "--"),
    m: common_vendor.o(($event) => $options.showCouponTip()),
    n: common_vendor.t($data.userInfo.nickName ? $data.userInfo.points || 0 : "--"),
    o: common_vendor.o(($event) => $options.navigateTo("/pages/user/points")),
    p: common_vendor.o((...args) => $options.goToOrderList && $options.goToOrderList(...args)),
    q: common_vendor.f($data.orderMenus, (item, index, i0) => {
      return common_vendor.e({
        a: item.icon,
        b: common_vendor.t(item.text),
        c: item.badge
      }, item.badge ? {
        d: common_vendor.t(item.badge)
      } : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      });
    }),
    r: common_vendor.f($data.toolsMenus, (item, index, i0) => {
      return common_vendor.e({
        a: item.icon,
        b: common_vendor.t(item.text),
        c: item.isNew
      }, item.isNew ? {} : {}, {
        d: index,
        e: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      });
    }),
    s: common_vendor.f($data.functionMenus, (item, index, i0) => {
      return common_vendor.e({
        a: item.icon,
        b: common_vendor.t(item.text),
        c: item.tag
      }, item.tag ? {
        d: common_vendor.t(item.tag)
      } : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      });
    }),
    t: common_vendor.f($data.supportMenus, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.text),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.url), index)
      };
    }),
    v: common_vendor.o(($event) => $options.navigateTo("/pages/activity/promotion")),
    w: $data.userInfo.nickName
  }, $data.userInfo.nickName ? {
    x: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
