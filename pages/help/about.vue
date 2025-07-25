<template>
  <view class="about-container">
    <view class="logo-section">
      <image
        src="https://cdn-icons-png.flaticon.com/128/4140/4140037.png"
        class="logo"
      ></image>
      <view class="app-name">POS机申请平台</view>
      <view class="app-version">版本 1.1.0</view>
    </view>

    <view class="about-card">
      <view class="about-title">公司简介</view>
      <view class="about-content">
        <text
          >我们是一家专注于POS机销售、租赁和服务的科技公司，致力于为商户提供安全、高效、便捷的支付解决方案。</text
        >
        <text
          >公司成立于2015年，总部位于深圳，目前已在全国30个城市设立服务网点，服务超过10万家商户。</text
        >
      </view>
    </view>

    <view class="about-card">
      <view class="about-title">联系我们</view>
      <view class="contact-list">
        <view class="contact-item">
          <text class="contact-text">客服电话: 400-123-4567</text>
        </view>
        <view class="contact-item">
          <text class="contact-text">邮箱: support@posservice.com</text>
        </view>
      </view>
    </view>

    <view class="copyright">© 2023 POS服务平台 版权所有</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    console.log("关于我们页面加载");
  },
  methods: {},
};
</script>

<style>
.about-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 30rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.app-version {
  font-size: 28rpx;
  color: #999;
}

.about-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.about-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 15rpx;
}

.about-content {
  display: flex;
  flex-direction: column;
}

.about-content text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15rpx;
}

.contact-list {
  display: flex;
  flex-direction: column;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.contact-text {
  font-size: 28rpx;
  color: #666;
}

.copyright {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 40rpx;
  margin-bottom: 60rpx;
}
</style>
