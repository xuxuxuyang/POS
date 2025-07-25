<template>
  <view class="verify-container">
    <view class="verify-header">
      <text class="header-title">手机号验证</text>
      <text class="header-desc"
        >验证手机号可以提高账号安全性，便于接收服务通知</text
      >
    </view>

    <view class="form-container">
      <view class="form-group">
        <text class="form-label">手机号</text>
        <input
          type="number"
          class="form-input"
          placeholder="请输入手机号码"
          maxlength="11"
          v-model="phone"
        />
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <text class="form-label">验证码</text>
        <input
          type="number"
          class="form-input"
          placeholder="请输入验证码"
          maxlength="6"
          v-model="code"
        />
        <view
          class="code-btn"
          :class="{ disabled: countdown > 0 }"
          @click="getVerifyCode"
        >
          {{ countdown > 0 ? `${countdown}秒` : "获取验证码" }}
        </view>
      </view>
    </view>

    <view class="submit-btn" @click="submitVerify"> 验证并绑定 </view>

    <view class="tips-card">
      <view class="tips-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/1041/1041728.png"
          class="tips-icon"
        ></image>
        <text class="tips-title">温馨提示</text>
      </view>
      <view class="tips-content">
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text"
            >为了您的账号安全，一个手机号仅能绑定一个账号</text
          >
        </view>
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">手机号将用于登录验证、密码找回等安全服务</text>
        </view>
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">如手机号已变更，请联系客服处理</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      code: "",
      countdown: 0,
      timer: null,
      userId: "",
    };
  },
  onLoad(options) {
    // 检查登录状态
    this.checkLoginStatus();

    // 从URL参数中获取用户ID
    if (options && options.userId) {
      this.userId = options.userId;
    }
  },
  onShow() {
    this.loadUserPhone();
  },
  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
        return;
      }

      try {
        const userInfoObj = JSON.parse(userInfo);
        this.userId = userInfoObj._id;
      } catch (e) {
        console.error("解析用户信息失败", e);
      }
    },

    // 加载用户手机号
    loadUserPhone() {
      if (!this.userId) return;

      const db = wx.cloud.database();
      db.collection("userinfo")
        .doc(this.userId)
        .get()
        .then((res) => {
          if (res.data && res.data.phone) {
            this.phone = res.data.phone;
          }
        })
        .catch((err) => {
          console.error("获取用户手机号失败", err);
        });
    },

    // 获取验证码
    getVerifyCode() {
      if (this.countdown > 0) return;

      // 验证手机号格式
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: "请输入正确的手机号",
          icon: "none",
        });
        return;
      }

      // 模拟发送验证码
      uni.showLoading({
        title: "发送中...",
      });

      // 这里应该调用后端API发送验证码
      // 这里使用模拟数据
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: "验证码已发送",
          icon: "success",
        });

        // 开始倒计时
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }, 1500);
    },

    // 提交验证
    submitVerify() {
      if (!this.phone) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
        return;
      }

      if (!this.code) {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return;
      }

      // 验证手机号格式
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({
          title: "请输入正确的手机号",
          icon: "none",
        });
        return;
      }

      // 验证验证码格式
      if (!/^\d{6}$/.test(this.code)) {
        uni.showToast({
          title: "请输入6位数字验证码",
          icon: "none",
        });
        return;
      }

      // 提交验证
      uni.showLoading({
        title: "验证中...",
      });

      // 这里应该调用后端API验证验证码
      // 这里使用模拟数据，真实情况应连接服务器验证
      setTimeout(() => {
        // 更新数据库中的手机号
        const db = wx.cloud.database();
        db.collection("userinfo")
          .doc(this.userId)
          .update({
            data: {
              phone: this.phone,
              isPhoneVerified: true,
              updateTime: new Date(),
            },
          })
          .then(() => {
            // 更新本地缓存
            const userInfoStr = uni.getStorageSync("userInfo");
            if (userInfoStr) {
              try {
                const userInfo = JSON.parse(userInfoStr);
                userInfo.phone = this.phone;
                userInfo.isPhoneVerified = true;
                uni.setStorageSync("userInfo", JSON.stringify(userInfo));
              } catch (e) {
                console.error("更新本地用户信息失败", e);
              }
            }

            uni.hideLoading();
            uni.showToast({
              title: "验证成功",
              icon: "success",
            });

            // 成功后返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          })
          .catch((err) => {
            console.error("更新用户手机号失败", err);
            uni.hideLoading();
            uni.showToast({
              title: "验证失败，请重试",
              icon: "none",
            });
          });
      }, 1500);
    },
  },
};
</script>

<style>
.verify-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 30rpx;
}

.verify-header {
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

.form-container {
  margin-top: 20rpx;
  background-color: #fff;
}

.form-group {
  display: flex;
  align-items: center;
  padding: 30rpx;
}

.form-label {
  width: 160rpx;
  font-size: 30rpx;
  color: #333;
}

.form-input {
  flex: 1;
  font-size: 30rpx;
  height: 60rpx;
}

.form-divider {
  height: 1rpx;
  background-color: #eee;
  margin-left: 30rpx;
}

.code-btn {
  background-color: #1296db;
  color: #fff;
  font-size: 26rpx;
  padding: 10rpx 20rpx;
  border-radius: 6rpx;
  margin-left: 20rpx;
}

.code-btn.disabled {
  background-color: #cccccc;
}

.submit-btn {
  margin: 60rpx 30rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  box-shadow: 0 4rpx 20rpx rgba(18, 150, 219, 0.3);
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
