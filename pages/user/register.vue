<template>
  <view class="register-container">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="back-btn" @click="goBack">
        <text class="iconfont">&#xe6a3;</text>
      </view>
      <view class="nav-title">用户注册</view>
      <view class="placeholder"></view>
    </view>

    <!-- 步骤指示器 -->
    <view class="step-indicator">
      <view class="step-item" :class="{ active: currentStep >= 1 }">
        <view class="step-circle">1</view>
        <text class="step-text">填写手机号</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 2 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 2 }">
        <view class="step-circle">2</view>
        <text class="step-text">设置账户</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 3 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 3 }">
        <view class="step-circle">3</view>
        <text class="step-text">注册完成</text>
      </view>
    </view>

    <!-- 步骤1 - 手机号验证 -->
    <view class="step-content" v-if="currentStep === 1">
      <view class="form-item">
        <text class="iconfont icon-phone">&#xe6a2;</text>
        <input
          class="input"
          type="number"
          v-model="formData.mobile"
          placeholder="请输入手机号"
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

      <button class="next-btn" @click="validateMobileStep">下一步</button>
    </view>

    <!-- 步骤2 - 设置账户信息 -->
    <view class="step-content" v-if="currentStep === 2">
      <view class="form-item">
        <text class="iconfont icon-user">&#xe6a0;</text>
        <input
          class="input"
          type="text"
          v-model="formData.username"
          placeholder="请设置用户昵称"
          placeholder-class="placeholder"
        />
      </view>
      <view class="form-item">
        <text class="iconfont icon-password">&#xe6a1;</text>
        <input
          class="input"
          :type="showPassword ? 'text' : 'password'"
          v-model="formData.password"
          placeholder="请设置登录密码"
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
          placeholder="请确认登录密码"
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
      </view>

      <button class="next-btn" @click="validateAccountStep">下一步</button>
      <button class="back-btn" @click="currentStep = 1">返回上一步</button>
    </view>

    <!-- 步骤3 - 注册完成 -->
    <view class="step-content" v-if="currentStep === 3">
      <view class="success-icon">
        <text class="iconfont">&#xe6a6;</text>
      </view>
      <view class="success-title">注册成功</view>
      <view class="success-desc">您的账号已注册成功，立即登录体验吧</view>

      <button class="login-btn" @click="goToLogin">立即登录</button>
      <button class="home-btn" @click="goToHome">返回首页</button>
    </view>

    <!-- 用户协议 -->
    <view class="agreement" v-if="currentStep < 3">
      <checkbox
        :checked="agreedTerms"
        @tap="agreedTerms = !agreedTerms"
        color="#1296db"
        style="transform: scale(0.7)"
      />
      <text>我已阅读并同意</text>
      <text class="agreement-link" @click="navigateTo('/pages/user/agreement')"
        >《用户协议》</text
      >和
      <text class="agreement-link" @click="navigateTo('/pages/user/privacy')"
        >《隐私政策》</text
      >
    </view>

    <!-- 登录引导 -->
    <view class="login-guide" v-if="currentStep < 3">
      已有账号？<text class="login-link" @click="goToLogin">立即登录</text>
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
        username: "",
        password: "",
        confirmPassword: "",
      },
      showPassword: false,
      showConfirmPassword: false,
      agreedTerms: false,
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

    // 导航到指定页面
    navigateTo(url) {
      uni.navigateTo({
        url: url,
      });
    },

    // 发送验证码
    sendVerifyCode() {
      // 验证手机号
      if (!this.formData.mobile) {
        uni.showToast({
          title: "请输入手机号",
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

    // 验证手机号步骤
    validateMobileStep() {
      // 表单验证
      if (!this.formData.mobile) {
        uni.showToast({
          title: "请输入手机号",
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

      if (!this.agreedTerms) {
        uni.showToast({
          title: "请阅读并同意用户协议和隐私政策",
          icon: "none",
        });
        return;
      }

      // 验证验证码
      // 实际项目中应调用验证验证码的API

      // 进入下一步
      this.currentStep = 2;
    },

    // 验证账户信息步骤
    validateAccountStep() {
      // 表单验证
      if (!this.formData.username) {
        uni.showToast({
          title: "请设置用户昵称",
          icon: "none",
        });
        return;
      }

      if (!this.formData.password) {
        uni.showToast({
          title: "请设置登录密码",
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
          title: "请确认登录密码",
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
        title: "注册中",
      });

      // 发送注册请求
      // 实际项目中应调用注册API
      setTimeout(() => {
        uni.hideLoading();

        // 注册成功，进入下一步
        this.currentStep = 3;

        // 存储用户信息
        const userInfo = {
          avatar: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
          nickName: this.formData.username,
          userId: "U" + Math.floor(Math.random() * 100000),
          vipLevel: "普通用户",
          wallet: "￥0",
          couponCount: 0,
          points: 0,
        };

        uni.setStorageSync("userInfo", JSON.stringify(userInfo));
      }, 2000);
    },

    // 跳转到登录页
    goToLogin() {
      uni.redirectTo({
        url: "/pages/user/login",
      });
    },

    // 返回首页
    goToHome() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style>
.register-container {
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

.home-btn {
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 45rpx;
  margin-top: 20rpx;
}

/* 协议和登录引导 */
.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #999;
}

.agreement-link {
  color: #1296db;
}

.login-guide {
  margin-top: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.login-link {
  color: #1296db;
}
</style>
