<template>
  <view class="reset-container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont">&#xe6a3;</text>
      </view>
      <view class="nav-title">重置密码</view>
      <view class="placeholder"></view>
    </view>

    <!-- 步骤指示器 -->
    <view class="step-indicator">
      <view class="step-item" :class="{ active: currentStep >= 1 }">
        <view class="step-circle">1</view>
        <text class="step-text">验证身份</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 2 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 2 }">
        <view class="step-circle">2</view>
        <text class="step-text">设置新密码</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 3 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 3 }">
        <view class="step-circle">3</view>
        <text class="step-text">重置成功</text>
      </view>
    </view>

    <!-- 步骤1 - 身份验证 -->
    <view class="step-content" v-if="currentStep === 1">
      <view class="form-item">
        <text class="iconfont icon-phone">&#xe6a2;</text>
        <input
          class="input"
          type="number"
          v-model="formData.mobile"
          placeholder="请输入注册手机号"
          placeholder-class="placeholder"
          maxlength="11"
        />
      </view>
      <view class="form-item">
        <text class="iconfont icon-captcha">&#xe6a7;</text>
        <input
          class="input"
          type="number"
          v-model="formData.code"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
          maxlength="6"
        />
        <view
          class="code-btn"
          :class="{ disabled: counting }"
          @click="!counting && sendVerifyCode()"
          >{{ codeText }}</view
        >
      </view>

      <button class="next-btn" @click="validateIdentity">下一步</button>
    </view>

    <!-- 步骤2 - 设置新密码 -->
    <view class="step-content" v-if="currentStep === 2">
      <view class="form-item">
        <text class="iconfont icon-password">&#xe6a1;</text>
        <input
          class="input"
          :type="showPassword ? 'text' : 'password'"
          v-model="formData.password"
          placeholder="请输入新密码"
          placeholder-class="placeholder"
        />
        <text class="iconfont eye-icon" @click="showPassword = !showPassword">{{
          showPassword ? "&#xe6a5;" : "&#xe6a4;"
        }}</text>
      </view>
      <view class="form-item">
        <text class="iconfont icon-password">&#xe6a1;</text>
        <input
          class="input"
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="formData.confirmPassword"
          placeholder="请确认新密码"
          placeholder-class="placeholder"
        />
        <text
          class="iconfont eye-icon"
          @click="showConfirmPassword = !showConfirmPassword"
          >{{ showConfirmPassword ? "&#xe6a5;" : "&#xe6a4;" }}</text
        >
      </view>

      <view class="password-tips">
        <view class="tips-item">密码长度8-20位</view>
        <view class="tips-item">必须包含字母和数字</view>
        <view class="tips-item">不能与旧密码相同</view>
      </view>

      <button class="next-btn" @click="resetPassword">确认重置</button>
      <button class="back-btn" @click="currentStep = 1">返回上一步</button>
    </view>

    <!-- 步骤3 - 重置成功 -->
    <view class="step-content" v-if="currentStep === 3">
      <view class="success-icon">
        <text class="iconfont">&#xe6a6;</text>
      </view>
      <view class="success-title">重置成功</view>
      <view class="success-desc">密码已重置成功，请使用新密码登录</view>

      <button class="login-btn" @click="goToLogin">立即登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      formData: {
        mobile: "",
        code: "",
        password: "",
        confirmPassword: "",
      },
      showPassword: false,
      showConfirmPassword: false,
      counting: false,
      codeText: "获取验证码",
      countDown: 60,
    };
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 发送验证码
    sendVerifyCode() {
      // 验证手机号
      if (!this.formData.mobile) {
        uni.showToast({
          title: "请输入注册手机号",
          icon: "none",
        });
        return;
      }

      const mobileReg = /^1[3-9]\d{9}$/;
      if (!mobileReg.test(this.formData.mobile)) {
        uni.showToast({
          title: "手机号格式不正确",
          icon: "none",
        });
        return;
      }

      // 显示加载中
      uni.showLoading({
        title: "发送中",
      });

      // 发送验证码请求
      // 实际项目中应调用发送验证码的API
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: "验证码已发送",
          icon: "success",
        });

        // 开始倒计时
        this.counting = true;
        this.countDown = 60;
        this.codeText = `${this.countDown}s`;

        const timer = setInterval(() => {
          this.countDown--;
          this.codeText = `${this.countDown}s`;

          if (this.countDown <= 0) {
            clearInterval(timer);
            this.counting = false;
            this.codeText = "获取验证码";
          }
        }, 1000);
      }, 1500);
    },

    // 验证身份
    validateIdentity() {
      // 表单验证
      if (!this.formData.mobile) {
        uni.showToast({
          title: "请输入注册手机号",
          icon: "none",
        });
        return;
      }

      const mobileReg = /^1[3-9]\d{9}$/;
      if (!mobileReg.test(this.formData.mobile)) {
        uni.showToast({
          title: "手机号格式不正确",
          icon: "none",
        });
        return;
      }

      if (!this.formData.code) {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return;
      }

      // 显示加载中
      uni.showLoading({
        title: "验证中",
      });

      // 验证验证码
      // 实际项目中应调用验证API
      setTimeout(() => {
        uni.hideLoading();

        // 验证成功，进入下一步
        this.currentStep = 2;
      }, 1500);
    },

    // 重置密码
    resetPassword() {
      // 表单验证
      if (!this.formData.password) {
        uni.showToast({
          title: "请输入新密码",
          icon: "none",
        });
        return;
      }

      // 密码强度验证
      const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
      if (!passwordReg.test(this.formData.password)) {
        uni.showToast({
          title: "密码必须包含字母和数字，长度8-20位",
          icon: "none",
        });
        return;
      }

      if (!this.formData.confirmPassword) {
        uni.showToast({
          title: "请确认新密码",
          icon: "none",
        });
        return;
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        uni.showToast({
          title: "两次输入的密码不一致",
          icon: "none",
        });
        return;
      }

      // 显示加载中
      uni.showLoading({
        title: "重置中",
      });

      // 发送重置密码请求
      // 实际项目中应调用重置密码API
      setTimeout(() => {
        uni.hideLoading();

        // 重置成功，进入下一步
        this.currentStep = 3;
      }, 2000);
    },

    // 跳转到登录页
    goToLogin() {
      uni.redirectTo({
        url: "/pages/user/login",
      });
    },
  },
};
</script>

<style>
.reset-container {
  min-height: 100vh;
  background-color: #fff;
  padding: 0 50rpx;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding-top: var(--status-bar-height);
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
}

.placeholder {
  width: 60rpx;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60rpx;
  padding: 0 30rpx;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-circle {
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background-color: #eee;
  color: #999;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}

.step-item.active .step-circle {
  background-color: #1296db;
  color: #fff;
}

.step-text {
  font-size: 24rpx;
  color: #999;
}

.step-item.active .step-text {
  color: #1296db;
}

.step-line {
  width: 100rpx;
  height: 2rpx;
  background-color: #eee;
  margin: 0 10rpx;
  margin-bottom: 36rpx;
}

.step-line.active {
  background-color: #1296db;
}

/* 表单样式 */
.step-content {
  margin-top: 60rpx;
}

.form-item {
  display: flex;
  align-items: center;
  height: 90rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.iconfont {
  font-size: 40rpx;
  color: #999;
  margin-right: 20rpx;
}

.input {
  flex: 1;
  height: 90rpx;
  font-size: 30rpx;
  color: #333;
}

.placeholder {
  color: #999;
}

.eye-icon {
  font-size: 40rpx;
  color: #999;
}

.code-btn {
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 24rpx;
  border-radius: 30rpx;
  text-align: center;
}

.code-btn.disabled {
  background-color: #ccc;
}

.password-tips {
  margin: 20rpx 0 40rpx;
}

.tips-item {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
  padding-left: 20rpx;
  position: relative;
}

.tips-item::before {
  content: "•";
  position: absolute;
  left: 0;
}

.next-btn {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  color: #fff;
  background-color: #1296db;
  border-radius: 45rpx;
  margin-top: 40rpx;
}

.back-btn {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 45rpx;
  margin-top: 20rpx;
}

/* 完成页面样式 */
.success-icon {
  display: flex;
  justify-content: center;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}

.success-icon .iconfont {
  font-size: 120rpx;
  color: #1296db;
}

.success-title {
  text-align: center;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.success-desc {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.login-btn {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  color: #fff;
  background-color: #1296db;
  border-radius: 45rpx;
}
</style>
