<template>
  <view class="guide-container">
    <view class="guide-header">
      <image
        src="https://cdn-icons-png.flaticon.com/128/9746/9746897.png"
        mode="aspectFit"
        class="guide-icon"
      ></image>
      <text class="guide-title">POS机申请流程</text>
    </view>

    <view class="guide-content">
      <view class="step-item" v-for="(step, index) in steps" :key="index">
        <view class="step-number">{{ index + 1 }}</view>
        <view class="step-info">
          <text class="step-title">{{ step.title }}</text>
          <text class="step-desc">{{ step.desc }}</text>
          <image
            v-if="step.image"
            :src="step.image"
            mode="widthFix"
            class="step-image"
          ></image>
        </view>
      </view>
    </view>

    <view class="guide-tips">
      <view class="tip-title">申请小贴士</view>
      <view class="tip-item" v-for="(tip, index) in tips" :key="index">
        <text class="tip-dot">•</text>
        <text class="tip-content">{{ tip }}</text>
      </view>
    </view>

    <button class="apply-btn" @click="goToApply">立即申请</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        {
          title: "选择产品",
          desc: "浏览POS机产品，根据自身需求选择合适的机型。",
          image: "https://cdn-icons-png.flaticon.com/128/10701/10701415.png",
        },
        {
          title: "填写信息",
          desc: "填写个人或企业信息，上传必要的证件照片。",
          image: "https://cdn-icons-png.flaticon.com/128/2666/2666505.png",
        },
        {
          title: "支付押金",
          desc: "根据所选产品支付相应的押金费用。",
          image: "https://cdn-icons-png.flaticon.com/128/4221/4221837.png",
        },
        {
          title: "等待审核",
          desc: "我们将在1-3个工作日内完成审核。",
          image: "https://cdn-icons-png.flaticon.com/128/8312/8312499.png",
        },
        {
          title: "等待发货",
          desc: "审核通过后，我们将为您安排发货。",
          image: "https://cdn-icons-png.flaticon.com/128/2463/2463498.png",
        },
      ],
      tips: [
        "准备好有效的身份证件，确保信息真实有效",
        "企业申请需要提供营业执照等相关资质",
        "押金将在设备归还后返还给您",
        "如有疑问可随时联系在线客服",
      ],
    };
  },
  methods: {
    goToApply() {
      uni.navigateTo({
        url: "/pages/apply/index",
      });
    },
  },
};
</script>

<style>
.guide-container {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.guide-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 40rpx 0;
  background-color: #fff;
  border-radius: 12rpx;
}

.guide-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.guide-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.guide-content {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.step-item {
  display: flex;
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.step-item:last-child {
  border-bottom: none;
}

.step-number {
  width: 60rpx;
  height: 60rpx;
  background-color: #1296db;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 30rpx;
  flex-shrink: 0;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.step-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.step-image {
  width: 100%;
  border-radius: 8rpx;
  margin-top: 20rpx;
}

.guide-tips {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.tip-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.tip-item {
  display: flex;
  margin-bottom: 15rpx;
}

.tip-dot {
  margin-right: 10rpx;
  color: #1296db;
  font-weight: bold;
}

.tip-content {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.apply-btn {
  width: 90%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin: 40rpx auto;
}
</style>
