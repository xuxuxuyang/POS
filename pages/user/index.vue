<template>
  <view class="user-container">
    <!-- 用户信息 -->
    <view class="user-info-section">
      <view class="user-info-bg">
        <image
          src="https://cdn-icons-png.flaticon.com/128/7505/7505765.png"
          mode="aspectFill"
          class="bg-image"
        ></image>
      </view>
      <view class="user-info-content">
        <view
          class="user-avatar"
          @click="!userInfo.nickName && handleWxLogin()"
        >
          <image
            :src="
              userInfo.avatar ||
              'https://cdn-icons-png.flaticon.com/128/847/847969.png'
            "
            mode="aspectFill"
          ></image>
          <view class="avatar-edit" v-if="userInfo.nickName">
            <text class="edit-icon">✏️</text>
          </view>
        </view>
        <view
          class="user-detail"
          @click="!userInfo.nickName && handleWxLogin()"
        >
          <view class="user-name">{{
            userInfo.nickName || "点击微信登录"
          }}</view>
          <view class="user-id" v-if="userInfo.nickName"
            >ID: {{ userInfo.userId }}</view
          >
          <view class="vip-tag" v-if="userInfo.nickName">{{
            userInfo.vipLevel || "普通用户"
          }}</view>
        </view>
      </view>
    </view>

    <!-- 用户数据概览 -->
    <view class="stats-card">
      <view class="stats-item" @click="navigateTo('/pages/deposit/pay')">
        <view class="stats-value">{{
          userInfo.nickName ? userInfo.wallet || "￥0" : "--"
        }}</view>
        <view class="stats-label">我的押金</view>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item" @click="showCouponTip()">
        <view class="stats-value">{{
          userInfo.nickName ? userInfo.couponCount || 0 : "--"
        }}</view>
        <view class="stats-label">优惠券</view>
      </view>
      <view class="stats-divider"></view>
      <view class="stats-item" @click="navigateTo('/pages/user/points')">
        <view class="stats-value">{{
          userInfo.nickName ? userInfo.points || 0 : "--"
        }}</view>
        <view class="stats-label">积分</view>
      </view>
    </view>

    <!-- 订单管理 -->
    <view class="menu-card">
      <view class="menu-header">
        <view class="header-title-wrap">
          <image
            src="https://cdn-icons-png.flaticon.com/128/3500/3500833.png"
            class="header-icon"
          ></image>
          <text class="header-title">我的订单</text>
        </view>
        <view class="header-more" @click="goToOrderList">
          <text>全部订单</text>
          <image
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            class="arrow-icon"
          ></image>
        </view>
      </view>
      <view class="menu-content">
        <view
          class="menu-item"
          v-for="(item, index) in orderMenus"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.icon" class="item-icon"></image>
          <text class="menu-text">{{ item.text }}</text>
          <view class="badge" v-if="item.badge">{{ item.badge }}</view>
        </view>
      </view>
    </view>

    <!-- 常用工具 -->
    <view class="menu-card">
      <view class="menu-header">
        <view class="header-title-wrap">
          <image
            src="https://cdn-icons-png.flaticon.com/128/2917/2917242.png"
            class="header-icon"
          ></image>
          <text class="header-title">我的服务</text>
        </view>
      </view>
      <view class="tools-grid">
        <view
          class="tool-item"
          v-for="(item, index) in toolsMenus"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.icon" class="tool-icon"></image>
          <text class="tool-text">{{ item.text }}</text>
          <text class="tool-new" v-if="item.isNew">New</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-card">
      <view class="menu-list">
        <view
          class="menu-list-item"
          v-for="(item, index) in functionMenus"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <view class="list-item-left">
            <image :src="item.icon" class="list-item-icon"></image>
            <text class="list-item-text">{{ item.text }}</text>
            <view class="tag" v-if="item.tag">{{ item.tag }}</view>
          </view>
          <image
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            class="arrow-icon"
          ></image>
        </view>
      </view>
    </view>

    <!-- 客服与反馈 -->
    <view class="menu-card">
      <view class="menu-list">
        <view
          class="menu-list-item"
          v-for="(item, index) in supportMenus"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <view class="list-item-left">
            <image :src="item.icon" class="list-item-icon"></image>
            <text class="list-item-text">{{ item.text }}</text>
          </view>
          <image
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            class="arrow-icon"
          ></image>
        </view>
      </view>
    </view>

    <!-- 广告卡片 -->
    <view class="promo-card" @click="navigateTo('/pages/activity/promotion')">
      <image
        src="https://cdn-icons-png.flaticon.com/128/1048/1048332.png"
        class="promo-icon"
      ></image>
      <view class="promo-content">
        <view class="promo-title">推广返现活动</view>
        <view class="promo-desc">邀请新用户，享受推广奖励</view>
      </view>
      <image
        src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
        class="arrow-icon"
      ></image>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn" v-if="userInfo.nickName" @click="logout">
      退出登录
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本 1.1.0</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: "",
        nickName: "",
        userId: "",
        vipLevel: "",
        wallet: "￥99",
        couponCount: 2,
        points: 356,
      },
      orderMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2441/2441009.png",
          text: "待审核",
          url: "/pages/order/list?type=pending",
          badge: 0,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/4521/4521931.png",
          text: "待发货",
          url: "/pages/order/list?type=approved",
          badge: 1,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2203/2203145.png",
          text: "已发货",
          url: "/pages/order/list?type=shipped",
          badge: 0,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/4406/4406665.png",
          text: "已完成",
          url: "/pages/order/list?type=completed",
          badge: 0,
        },
      ],
      toolsMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1728/1728853.png",
          text: "激活POS机",
          url: "/pages/service/activate",
          isNew: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3349/3349234.png",
          text: "在线预约",
          url: "/pages/service/appointment",
          isNew: true,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1584/1584812.png",
          text: "维修申请",
          url: "/pages/service/repair",
          isNew: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2991/2991251.png",
          text: "使用教程",
          url: "/pages/guide/index",
          isNew: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/4149/4149888.png",
          text: "资料下载",
          url: "/pages/guide/download",
          isNew: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3371/3371540.png",
          text: "查看发票",
          url: "/pages/user/invoice",
          isNew: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2258/2258843.png",
          text: "码商加盟",
          url: "/pages/promoter/join",
          isNew: true,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2099/2099203.png",
          text: "更多服务",
          url: "/pages/service/more",
          isNew: false,
        },
      ],
      functionMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2474/2474450.png",
          text: "我的押金",
          url: "/pages/deposit/pay",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
          text: "收货地址",
          url: "/pages/user/address",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3781/3781605.png",
          text: "账户安全",
          url: "/pages/user/security",
          tag: "重要",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1384/1384023.png",
          text: "推广中心",
          url: "/pages/promoter/index",
        },
      ],
      supportMenus: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1671/1671060.png",
          text: "在线客服",
          url: "customer_service",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/471/471664.png",
          text: "常见问题",
          url: "/pages/help/index",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2521/2521826.png",
          text: "意见反馈",
          url: "/pages/help/feedback",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1028/1028908.png",
          text: "关于我们",
          url: "/pages/help/about",
        },
      ],
    };
  },
  onLoad() {
    // 初始化云环境
    if (!wx.cloud.$isInitialized) {
      wx.cloud.init({
        env: "cloud1-9grox8bwd6dbce0c",
        traceUser: true,
      });
    }

    // 页面加载时检查登录状态
    this.checkLoginStatus();
  },
  onShow() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
    this.fetchUserData();
  },
  onPullDownRefresh() {
    // 支持下拉刷新
    this.checkLoginStatus();
    this.fetchUserData();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      // 从本地缓存获取用户信息
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);

        // 获取存储的用户ID
        const userId = uni.getStorageSync("userId");
        if (userId) {
          // 通过ID从云数据库验证用户登录状态
          const db = wx.cloud.database();
          db.collection("userinfo")
            .doc(userId)
            .get({
              success: (res) => {
                if (res.data) {
                  console.log("用户验证成功");
                  // 更新本地用户信息
                  this.userInfo = res.data;
                  uni.setStorageSync("userInfo", JSON.stringify(res.data));
                } else {
                  console.log("用户信息已失效，清除登录状态");
                  this.clearUserInfo();
                }
              },
              fail: (err) => {
                console.error("验证用户状态失败", err);
                // 如果错误是因为记录不存在，清除登录状态
                if (err.errCode === -1 || err.errMsg.includes("not exist")) {
                  this.clearUserInfo();
                }
              },
            });
        }
      }
    },

    // 清除用户信息
    clearUserInfo() {
      uni.removeStorageSync("userInfo");
      uni.removeStorageSync("userId");
      this.userInfo = {
        avatar: "",
        nickName: "",
        userId: "",
        vipLevel: "",
        wallet: "",
        couponCount: 0,
        points: 0,
      };
    },

    // 获取用户数据
    fetchUserData() {
      // 如果用户已登录，获取最新的用户数据
      if (this.userInfo.nickName && this.userInfo._id) {
        uni.showLoading({
          title: "刷新中...",
          mask: false,
        });

        const db = wx.cloud.database();
        db.collection("userinfo")
          .doc(this.userInfo._id)
          .get({
            success: (res) => {
              if (res.data) {
                console.log("获取最新用户数据成功");

                // 更新用户信息
                this.userInfo = res.data;

                // 更新存储
                uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));

                // 查询用户的订单数量
                this.fetchUserOrderCount();
              }
              uni.hideLoading();
            },
            fail: (err) => {
              console.error("获取用户数据失败", err);
              uni.hideLoading();
            },
          });
      }
    },

    // 获取用户订单数量
    fetchUserOrderCount() {
      if (!this.userInfo._id) return;

      const db = wx.cloud.database();
      const _ = db.command;

      // 获取待审核订单数量
      db.collection("user")
        .where({
          userId: this.userInfo._id,
          status: "待审核",
        })
        .count()
        .then((res) => {
          this.orderMenus[0].badge = res.total || 0;
        });

      // 获取待发货订单数量
      db.collection("user")
        .where({
          userId: this.userInfo._id,
          status: "待发货",
        })
        .count()
        .then((res) => {
          this.orderMenus[1].badge = res.total || 0;
        });

      // 获取已发货订单数量
      db.collection("user")
        .where({
          userId: this.userInfo._id,
          status: "已发货",
        })
        .count()
        .then((res) => {
          this.orderMenus[2].badge = res.total || 0;
        });

      // 获取已完成订单数量
      db.collection("user")
        .where({
          userId: this.userInfo._id,
          status: "已完成",
        })
        .count()
        .then((res) => {
          this.orderMenus[3].badge = res.total || 0;
        });
    },

    // 跳转到设置页面
    goToSettings() {
      if (!this.userInfo.nickName) {
        this.handleWxLogin();
        return;
      }
      uni.navigateTo({
        url: "/pages/user/settings",
      });
    },

    // 跳转到订单列表
    goToOrderList() {
      if (!this.userInfo.nickName) {
        this.handleWxLogin();
        return;
      }
      uni.navigateTo({
        url: "/pages/order/list",
      });
    },

    // 导航到指定页面
    navigateTo(url) {
      // 如果是客服，调用客服功能
      if (url === "customer_service") {
        this.contactCustomerService();
        return;
      }

      // 如果用户未登录且不是帮助/关于页面，先去登录
      if (
        !this.userInfo.nickName &&
        !url.includes("/pages/help/") &&
        !url.includes("/pages/guide/")
      ) {
        this.handleWxLogin();
        return;
      }

      uni.navigateTo({
        url: url,
      });
    },

    // 微信登录方法
    handleWxLogin() {
      // 显示加载中
      uni.showLoading({
        title: "登录中...",
        mask: true,
      });

      // 调用微信登录
      wx.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          if (res.userInfo) {
            // 获取登录凭证
            wx.login({
              success: (loginRes) => {
                if (loginRes.code) {
                  // 获取到用户信息
                  const userInfo = {
                    avatar:
                      res.userInfo.avatarUrl ||
                      "https://cdn-icons-png.flaticon.com/128/924/924915.png",
                    nickName: res.userInfo.nickName || "微信用户",
                    userId: "U" + new Date().getTime(),
                    openId: "", // 将由服务器返回
                    vipLevel: "普通用户",
                    wallet: "￥0",
                    couponCount: 0,
                    points: 100,
                    gender: res.userInfo.gender,
                    country: res.userInfo.country,
                    province: res.userInfo.province,
                    city: res.userInfo.city,
                    language: res.userInfo.language,
                    createTime: new Date(),
                    lastLoginTime: new Date(),
                    phone: "", // 添加手机号字段
                    isPhoneVerified: false, // 是否已验证手机号
                    isProfileCompleted: false, // 是否已完善个人资料
                  };

                  // 调用云函数获取openid（真实项目中需要云函数，这里直接存储模拟数据）
                  // 获取云数据库实例
                  const db = wx.cloud.database();

                  // 查询是否已经存在该用户信息
                  db.collection("userinfo")
                    .where({
                      nickName: userInfo.nickName,
                      // 实际项目中应该使用openid查询
                    })
                    .get()
                    .then((queryRes) => {
                      if (queryRes.data && queryRes.data.length > 0) {
                        // 已存在该用户，更新信息
                        const existUser = queryRes.data[0];
                        const userId = existUser._id;

                        db.collection("userinfo")
                          .doc(userId)
                          .update({
                            data: {
                              avatar: userInfo.avatar,
                              lastLoginTime: new Date(),
                              // 更新其他可能变化的信息
                            },
                          })
                          .then(() => {
                            console.log("用户信息更新成功");

                            // 合并已有信息和新信息
                            userInfo._id = userId;
                            userInfo.points =
                              existUser.points || userInfo.points;
                            userInfo.vipLevel =
                              existUser.vipLevel || userInfo.vipLevel;
                            userInfo.wallet =
                              existUser.wallet || userInfo.wallet;
                            userInfo.couponCount =
                              existUser.couponCount || userInfo.couponCount;
                            userInfo.phone = existUser.phone || "";
                            userInfo.isPhoneVerified =
                              existUser.isPhoneVerified || false;
                            userInfo.isProfileCompleted =
                              existUser.isProfileCompleted || false;

                            // 完成登录流程
                            this.finishLogin(userInfo);

                            // 检查是否需要验证手机号或完善资料
                            this.checkUserInfoCompletion(userInfo);
                          })
                          .catch((err) => {
                            console.error("更新用户信息失败", err);
                            this.finishLogin(userInfo);
                            this.checkUserInfoCompletion(userInfo);
                          });
                      } else {
                        // 不存在则添加新用户
                        db.collection("userinfo")
                          .add({
                            data: userInfo,
                          })
                          .then((addRes) => {
                            console.log("用户信息存储成功", addRes);
                            userInfo._id = addRes._id;
                            this.finishLogin(userInfo);

                            // 新用户需要验证手机号和完善资料
                            this.checkUserInfoCompletion(userInfo);
                          })
                          .catch((err) => {
                            console.error("存储用户信息失败", err);
                            this.finishLogin(userInfo);
                            this.checkUserInfoCompletion(userInfo);
                          });
                      }
                    })
                    .catch((err) => {
                      console.error("查询用户信息失败", err);
                      this.finishLogin(userInfo);
                      this.checkUserInfoCompletion(userInfo);
                    });
                } else {
                  uni.hideLoading();
                  console.error("wx.login 失败", loginRes);
                  uni.showToast({
                    title: "登录失败",
                    icon: "none",
                  });
                }
              },
              fail: (err) => {
                uni.hideLoading();
                console.error("wx.login 接口调用失败", err);
                uni.showToast({
                  title: "网络错误，请重试",
                  icon: "none",
                });
              },
            });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          console.error("微信登录失败:", err);
          uni.showToast({
            title: "您取消了授权",
            icon: "none",
          });
        },
      });
    },

    // 完成登录流程
    finishLogin(userInfo) {
      // 存储用户信息到本地缓存
      uni.setStorageSync("userInfo", JSON.stringify(userInfo));

      // 存储用户ID，用于关联订单
      uni.setStorageSync("userId", userInfo._id);

      // 更新当前页面数据
      this.userInfo = userInfo;

      // 隐藏加载框并提示登录成功
      uni.hideLoading();
      uni.showToast({
        title: "登录成功",
        icon: "success",
      });
    },

    // 检查用户信息完善状态
    checkUserInfoCompletion(userInfo) {
      if (!userInfo.isPhoneVerified) {
        // 未验证手机号，跳转到手机号验证页面
        setTimeout(() => {
          // 直接通过URL参数传递用户ID
          uni.navigateTo({
            url: "/pages/user/phone-verify?userId=" + userInfo._id,
          });
        }, 1000);
      } else if (!userInfo.isProfileCompleted) {
        // 未完善个人资料，跳转到资料完善页面
        setTimeout(() => {
          // 直接通过URL参数传递用户ID
          uni.navigateTo({
            url: "/pages/user/profile-setup?userId=" + userInfo._id,
          });
        }, 1000);
      }
    },

    // 验证手机号
    verifyPhoneNumber(phone, code, userId) {
      // 显示加载中
      uni.showLoading({
        title: "验证中...",
        mask: true,
      });

      // 实际项目中应该调用云函数验证验证码
      // 这里模拟验证成功
      const db = wx.cloud.database();
      db.collection("userinfo")
        .doc(userId)
        .update({
          data: {
            phone: phone,
            isPhoneVerified: true,
          },
        })
        .then(() => {
          console.log("手机号验证成功");

          // 更新本地用户信息
          let userInfo = JSON.parse(uni.getStorageSync("userInfo") || "{}");
          userInfo.phone = phone;
          userInfo.isPhoneVerified = true;
          uni.setStorageSync("userInfo", JSON.stringify(userInfo));

          // 更新当前页面数据
          this.userInfo.phone = phone;
          this.userInfo.isPhoneVerified = true;

          uni.hideLoading();
          uni.showToast({
            title: "验证成功",
            icon: "success",
          });

          // 如果个人资料未完善，引导去完善
          if (!userInfo.isProfileCompleted) {
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages/user/profile-setup",
              });
            }, 1000);
          }
        })
        .catch((err) => {
          console.error("手机号验证失败", err);
          uni.hideLoading();
          uni.showToast({
            title: "验证失败",
            icon: "none",
          });
        });
    },

    // 完善用户资料
    completeUserProfile(profileData, userId) {
      // 显示加载中
      uni.showLoading({
        title: "保存中...",
        mask: true,
      });

      const db = wx.cloud.database();
      db.collection("userinfo")
        .doc(userId)
        .update({
          data: {
            ...profileData,
            isProfileCompleted: true,
          },
        })
        .then(() => {
          console.log("用户资料完善成功");

          // 更新本地用户信息
          let userInfo = JSON.parse(uni.getStorageSync("userInfo") || "{}");
          userInfo = { ...userInfo, ...profileData, isProfileCompleted: true };
          uni.setStorageSync("userInfo", JSON.stringify(userInfo));

          // 更新当前页面数据
          this.userInfo = {
            ...this.userInfo,
            ...profileData,
            isProfileCompleted: true,
          };

          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success",
          });

          // 返回到个人中心页面
          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        })
        .catch((err) => {
          console.error("保存用户资料失败", err);
          uni.hideLoading();
          uni.showToast({
            title: "保存失败",
            icon: "none",
          });
        });
    },

    // 联系客服
    contactCustomerService() {
      uni.showActionSheet({
        itemList: ["在线客服", "电话客服"],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 在线客服
            uni.showToast({
              title: "正在接入在线客服...",
              icon: "none",
            });
          } else if (res.tapIndex === 1) {
            // 电话客服
            uni.makePhoneCall({
              phoneNumber: "400-123-4567",
              fail: () => {
                uni.showToast({
                  title: "拨打失败",
                  icon: "none",
                });
              },
            });
          }
        },
      });
    },

    // 显示优惠券提示
    showCouponTip() {
      if (!this.userInfo.nickName) {
        this.handleWxLogin();
        return;
      }
      uni.showToast({
        title: "优惠券功能开发中...",
        icon: "none",
        duration: 2000,
      });
    },

    // 退出登录
    logout() {
      uni.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            // 清除用户信息
            this.clearUserInfo();

            uni.showToast({
              title: "已退出登录",
              icon: "success",
            });
          }
        },
      });
    },
  },
};
</script>

<style>
.user-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 60rpx;
}

.user-info-section {
  position: relative;
  height: 300rpx;
  overflow: hidden;
}

.user-info-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  width: 100%;
  height: 100%;
  opacity: 0.2;
}

.user-info-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  height: 100%;
  background: linear-gradient(to right, #1296db, #14b8e4);
  box-sizing: border-box;
}

.user-avatar {
  position: relative;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  margin-right: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 24rpx;
}

.user-detail {
  flex: 1;
  color: #fff;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 24rpx;
  opacity: 0.8;
  margin-bottom: 10rpx;
}

.vip-tag {
  display: inline-block;
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}

.setting-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 用户数据概览 */
.stats-card {
  margin: -40rpx 30rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  padding: 30rpx 0;
  position: relative;
  z-index: 3;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.stats-label {
  font-size: 24rpx;
  color: #999;
}

.stats-divider {
  width: 1rpx;
  height: 50rpx;
  background-color: #eee;
  margin-top: 15rpx;
}

/* 菜单卡片 */
.menu-card {
  background-color: #fff;
  border-radius: 12rpx;
  margin: 20rpx 30rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.header-title-wrap {
  display: flex;
  align-items: center;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.header-more {
  font-size: 28rpx;
  color: #999;
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}

.menu-content {
  display: flex;
  padding: 30rpx 0;
}

.menu-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.item-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 15rpx;
}

.menu-text {
  font-size: 26rpx;
  color: #333;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: 40rpx;
  background-color: #ff5252;
  color: #fff;
  font-size: 22rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

/* 工具网格 */
.tools-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.tool-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  position: relative;
}

.tool-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 15rpx;
}

.tool-text {
  font-size: 24rpx;
  color: #666;
}

.tool-new {
  position: absolute;
  top: 10rpx;
  right: 20rpx;
  background-color: #ff5252;
  color: #fff;
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

/* 菜单列表 */
.menu-list {
  padding: 10rpx 0;
}

.menu-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-list-item:last-child {
  border-bottom: none;
}

.list-item-left {
  display: flex;
  align-items: center;
}

.list-item-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.list-item-text {
  font-size: 30rpx;
  color: #333;
}

.tag {
  background-color: #ff5252;
  color: #fff;
  font-size: 22rpx;
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
  margin-left: 15rpx;
}

/* 推广卡片 */
.promo-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12rpx;
  margin: 20rpx 30rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.promo-icon {
  width: 70rpx;
  height: 70rpx;
  margin-right: 20rpx;
}

.promo-content {
  flex: 1;
}

.promo-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.promo-desc {
  font-size: 24rpx;
  color: #999;
}

/* 退出按钮 */
.logout-btn {
  margin: 50rpx 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  background-color: #fff;
  color: #ff5252;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.version-info {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 30rpx;
}
</style>
