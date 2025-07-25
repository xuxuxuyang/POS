<template>
  <view class="security-container">
    <view class="security-header">
      <text class="header-title">账户安全</text>
      <text class="header-desc"
        >保障您的账户安全，请定期更新密码与验证信息</text
      >
    </view>

    <view class="security-list">
      <!-- 手机号绑定 -->
      <view class="security-item" @click="handlePhoneVerify">
        <view class="item-left">
          <image
            src="https://cdn-icons-png.flaticon.com/128/15/15874.png"
            class="item-icon"
          ></image>
          <view class="item-info">
            <text class="item-title">手机号绑定</text>
            <text class="item-value">{{
              userInfo.phone
                ? userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
                : "未绑定"
            }}</text>
          </view>
        </view>
        <image
          src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          class="arrow-icon"
        ></image>
      </view>

      <!-- 设置支付密码 -->
      <view class="security-item" @click="handleSetPayPassword">
        <view class="item-left">
          <image
            src="https://cdn-icons-png.flaticon.com/128/2889/2889676.png"
            class="item-icon"
          ></image>
          <view class="item-info">
            <text class="item-title">支付密码</text>
            <text class="item-value">{{
              hasPayPassword ? "已设置" : "未设置"
            }}</text>
          </view>
        </view>
        <image
          src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          class="arrow-icon"
        ></image>
      </view>

      <!-- 微信授权信息 -->
      <view class="security-item" @click="handleWechatAuth">
        <view class="item-left">
          <image
            src="https://cdn-icons-png.flaticon.com/128/889/889101.png"
            class="item-icon"
          ></image>
          <view class="item-info">
            <text class="item-title">微信授权</text>
            <text class="item-value">已绑定</text>
          </view>
        </view>
        <image
          src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          class="arrow-icon"
        ></image>
      </view>

      <!-- 实名认证 -->
      <view class="security-item" @click="handleVerifyIdentity">
        <view class="item-left">
          <image
            src="https://cdn-icons-png.flaticon.com/128/1484/1484799.png"
            class="item-icon"
          ></image>
          <view class="item-info">
            <text class="item-title">实名认证</text>
            <text class="item-value">{{
              userInfo.isVerified ? "已认证" : "未认证"
            }}</text>
          </view>
        </view>
        <image
          src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          class="arrow-icon"
        ></image>
      </view>

      <!-- 登录密码 -->
      <view class="security-item" @click="handleChangeLoginPassword">
        <view class="item-left">
          <image
            src="https://cdn-icons-png.flaticon.com/128/807/807292.png"
            class="item-icon"
          ></image>
          <view class="item-info">
            <text class="item-title">修改登录密码</text>
            <text class="item-value">定期修改更安全</text>
          </view>
        </view>
        <image
          src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          class="arrow-icon"
        ></image>
      </view>
    </view>

    <view class="tips-card">
      <view class="tips-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/1041/1041728.png"
          class="tips-icon"
        ></image>
        <text class="tips-title">安全提示</text>
      </view>
      <view class="tips-content">
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">定期更改密码，不要使用简单密码</text>
        </view>
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">请勿将账号信息透露给他人</text>
        </view>
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">如发现异常登录，请立即修改密码</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        phone: "",
        isVerified: false,
      },
      hasPayPassword: false,
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
          success: () => {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
      }
    },

    // 获取用户信息
    getUserInfo() {
      const userInfoStr = uni.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          this.userInfo = userInfo;

          // 如果有用户ID，从数据库获取更多信息
          if (userInfo._id) {
            this.fetchUserSecurityInfo(userInfo._id);
          }
        } catch (e) {
          console.error("解析用户信息失败", e);
        }
      }
    },

    // 获取用户安全信息
    fetchUserSecurityInfo(userId) {
      const db = wx.cloud.database();
      db.collection("userinfo")
        .doc(userId)
        .get()
        .then((res) => {
          if (res.data) {
            // 更新用户信息
            this.userInfo = res.data;

            // 检查是否设置了支付密码
            this.hasPayPassword = !!res.data.hasPayPassword;
          }
        })
        .catch((err) => {
          console.error("获取用户安全信息失败", err);
        });
    },

    // 手机号验证
    handlePhoneVerify() {
      uni.navigateTo({
        url: "/pages/user/phone-verify",
      });
    },

    // 设置支付密码
    handleSetPayPassword() {
      uni.showToast({
        title: "支付密码功能开发中",
        icon: "none",
      });
    },

    // 微信授权
    handleWechatAuth() {
      uni.showToast({
        title: "微信已授权",
        icon: "success",
      });
    },

    // 实名认证
    handleVerifyIdentity() {
      if (this.userInfo.isVerified) {
        uni.showModal({
          title: "提示",
          content: "您已完成实名认证",
          showCancel: false,
        });
        return;
      }

      uni.showToast({
        title: "实名认证功能开发中",
        icon: "none",
      });
    },

    // 修改登录密码
    handleChangeLoginPassword() {
      uni.showToast({
        title: "密码修改功能开发中",
        icon: "none",
      });
    },
  },
};
</script>

<style>
.security-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 30rpx;
}

.security-header {
  padding: 40rpx 30rpx;
  background-color: #fff;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.header-desc {
  font-size: 26rpx;
  color: #999;
}

.security-list {
  margin-top: 20rpx;
  background-color: #fff;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.security-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.item-value {
  font-size: 24rpx;
  color: #999;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
  opacity: 0.6;
}

.tips-card {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tips-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.tips-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
}

.tips-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.tips-content {
  padding-left: 10rpx;
}

.tip-item {
  display: flex;
  margin-bottom: 10rpx;
}

.tip-dot {
  margin-right: 10rpx;
  color: #1296db;
  font-weight: bold;
}

.tip-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>
