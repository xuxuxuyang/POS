<template>
  <view class="promotion-container">
    <!-- 顶部横幅 -->
    <view class="banner">
      <image
        src="https://cdn-icons-png.flaticon.com/128/3406/3406886.png"
        mode="aspectFill"
        class="banner-image"
      ></image>
      <view class="banner-text">
        <text class="banner-title">推广返现活动</text>
        <text class="banner-desc">邀请好友，双方共赢</text>
      </view>
    </view>

    <!-- 我的推广数据 -->
    <view class="stats-card">
      <view class="stats-header">
        <text class="stats-title">我的推广数据</text>
      </view>
      <view class="stats-content">
        <view class="stats-item">
          <text class="stats-value">{{ promotionData.inviteCount }}</text>
          <text class="stats-label">已邀请</text>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <text class="stats-value">{{ promotionData.successCount }}</text>
          <text class="stats-label">成功注册</text>
        </view>
        <view class="stats-divider"></view>
        <view class="stats-item">
          <text class="stats-value">¥{{ promotionData.totalReward }}</text>
          <text class="stats-label">累计奖励</text>
        </view>
      </view>
    </view>

    <!-- 活动规则 -->
    <view class="rules-card">
      <view class="card-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/3437/3437364.png"
          class="header-icon"
        ></image>
        <text class="header-title">活动规则</text>
      </view>
      <view class="rules-content">
        <view class="rule-item" v-for="(rule, index) in rules" :key="index">
          <view class="rule-number">{{ index + 1 }}</view>
          <view class="rule-text">{{ rule }}</view>
        </view>
      </view>
    </view>

    <!-- 推广方式 -->
    <view class="share-card">
      <view class="card-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/2099/2099192.png"
          class="header-icon"
        ></image>
        <text class="header-title">推广方式</text>
      </view>
      <view class="share-methods">
        <view class="share-item" @click="shareToWechat">
          <image
            src="https://cdn-icons-png.flaticon.com/128/889/889101.png"
            class="share-icon"
          ></image>
          <text class="share-text">微信好友</text>
        </view>
        <view class="share-item" @click="shareToMoments">
          <image
            src="https://cdn-icons-png.flaticon.com/128/2111/2111398.png"
            class="share-icon"
          ></image>
          <text class="share-text">朋友圈</text>
        </view>
        <view class="share-item" @click="generatePoster">
          <image
            src="https://cdn-icons-png.flaticon.com/128/3342/3342137.png"
            class="share-icon"
          ></image>
          <text class="share-text">生成海报</text>
        </view>
        <view class="share-item" @click="copyLink">
          <image
            src="https://cdn-icons-png.flaticon.com/128/446/446033.png"
            class="share-icon"
          ></image>
          <text class="share-text">复制链接</text>
        </view>
      </view>
    </view>

    <!-- 我的推广码 -->
    <view class="qrcode-card">
      <view class="qrcode-title">我的推广码</view>
      <view class="qrcode-content">
        <image
          src="https://cdn-icons-png.flaticon.com/128/714/714435.png"
          class="qrcode-image"
        ></image>
        <text class="qrcode-tip">截屏或长按保存二维码</text>
      </view>
      <view class="qrcode-id">
        <text>推广ID: {{ promotionData.promotionId }}</text>
      </view>
    </view>

    <!-- 推广记录 -->
    <view class="records-card">
      <view class="card-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/2541/2541979.png"
          class="header-icon"
        ></image>
        <text class="header-title">推广记录</text>
        <view class="header-more" @click="viewAllRecords">
          <text>查看全部</text>
          <image
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            class="arrow-icon"
          ></image>
        </view>
      </view>
      <view class="records-list" v-if="promotionRecords.length > 0">
        <view
          class="record-item"
          v-for="(record, index) in promotionRecords"
          :key="index"
        >
          <view class="record-user">
            <image :src="record.avatar" class="record-avatar"></image>
            <view class="record-user-info">
              <text class="record-username">{{ record.username }}</text>
              <text class="record-time">{{ record.time }}</text>
            </view>
          </view>
          <view class="record-reward">
            <text class="reward-amount">+¥{{ record.reward }}</text>
            <text class="reward-status" :class="record.status">{{
              record.statusText
            }}</text>
          </view>
        </view>
      </view>
      <view class="empty-records" v-else>
        <image
          src="https://cdn-icons-png.flaticon.com/128/7486/7486754.png"
          class="empty-icon"
        ></image>
        <text class="empty-text">暂无推广记录</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btn" @click="inviteFriends">立即邀请好友</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      promotionData: {
        inviteCount: 12,
        successCount: 8,
        totalReward: 120.5,
        promotionId: "P" + new Date().getTime().toString().slice(-6),
      },
      rules: [
        "邀请好友注册并实名认证，双方各获得5元现金奖励",
        "好友成功申请POS机并激活，您将获得20元现金奖励",
        "好友每成功推荐一位新用户，您将额外获得5元奖励",
        "奖励金额将在3个工作日内自动发放至您的账户余额",
        "本活动最终解释权归平台所有",
      ],
      promotionRecords: [
        {
          avatar: "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
          username: "用户1358***",
          time: "2023-06-15 14:30",
          reward: 5.0,
          status: "success",
          statusText: "已到账",
        },
        {
          avatar: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
          username: "用户2468***",
          time: "2023-06-10 09:15",
          reward: 20.0,
          status: "success",
          statusText: "已到账",
        },
        {
          avatar: "https://cdn-icons-png.flaticon.com/128/4140/4140061.png",
          username: "用户7890***",
          time: "2023-06-05 16:45",
          reward: 5.0,
          status: "pending",
          statusText: "处理中",
        },
      ],
    };
  },
  onLoad() {
    // 页面加载时获取推广数据
    this.getPromotionData();
  },
  methods: {
    // 获取推广数据
    getPromotionData() {
      // 实际项目中应该从服务器获取数据
      // 这里使用模拟数据
      console.log("获取推广数据");
    },

    // 分享到微信好友
    shareToWechat() {
      uni.showToast({
        title: "请点击右上角分享",
        icon: "none",
      });
    },

    // 分享到朋友圈
    shareToMoments() {
      uni.showToast({
        title: "请点击右上角分享",
        icon: "none",
      });
    },

    // 生成海报
    generatePoster() {
      uni.showLoading({
        title: "生成中...",
      });

      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: "海报已生成",
          icon: "success",
        });
      }, 1500);
    },

    // 复制推广链接
    copyLink() {
      uni.setClipboardData({
        data:
          "https://example.com/promotion?id=" + this.promotionData.promotionId,
        success: () => {
          uni.showToast({
            title: "链接已复制",
            icon: "success",
          });
        },
      });
    },

    // 查看全部记录
    viewAllRecords() {
      uni.navigateTo({
        url: "/pages/activity/promotion-records",
      });
    },

    // 邀请好友
    inviteFriends() {
      uni.showToast({
        title: "请点击右上角分享",
        icon: "none",
      });
    },
  },
  // 设置分享信息
  onShareAppMessage() {
    return {
      title: "邀请您加入POS机申请平台，双方各得5元奖励！",
      path: "/pages/index/index?promotionId=" + this.promotionData.promotionId,
      imageUrl: "https://cdn-icons-png.flaticon.com/128/3406/3406886.png",
    };
  },
};
</script>

<style>
.promotion-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 100rpx;
}

/* 顶部横幅 */
.banner {
  position: relative;
  height: 300rpx;
  background: linear-gradient(to right, #ff6b6b, #ff9f43);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 40rpx;
}

.banner-image {
  position: absolute;
  right: 40rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 180rpx;
  height: 180rpx;
  opacity: 0.2;
}

.banner-text {
  z-index: 1;
}

.banner-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20rpx;
  display: block;
}

.banner-desc {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 数据统计卡片 */
.stats-card {
  margin: -50rpx 30rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.stats-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.stats-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.stats-content {
  display: flex;
  padding: 30rpx 0;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 10rpx;
}

.stats-label {
  font-size: 26rpx;
  color: #999;
}

.stats-divider {
  width: 1rpx;
  height: 50rpx;
  background-color: #eee;
  margin-top: 15rpx;
}

/* 卡片通用样式 */
.rules-card,
.share-card,
.qrcode-card,
.records-card {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 15rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.header-more {
  font-size: 26rpx;
  color: #999;
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}

/* 活动规则 */
.rules-content {
  padding: 20rpx 30rpx;
}

.rule-item {
  display: flex;
  margin-bottom: 20rpx;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-number {
  width: 40rpx;
  height: 40rpx;
  background-color: #ff9f43;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 15rpx;
  flex-shrink: 0;
}

.rule-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

/* 推广方式 */
.share-methods {
  display: flex;
  padding: 30rpx 0;
}

.share-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 15rpx;
}

.share-text {
  font-size: 26rpx;
  color: #666;
}

/* 推广码 */
.qrcode-card {
  padding: 30rpx;
  text-align: center;
}

.qrcode-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 20rpx;
}

.qrcode-tip {
  font-size: 26rpx;
  color: #999;
}

.qrcode-id {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
}

/* 推广记录 */
.records-list {
  padding: 0 30rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-user {
  display: flex;
  align-items: center;
}

.record-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 15rpx;
}

.record-user-info {
  display: flex;
  flex-direction: column;
}

.record-username {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 5rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-reward {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.reward-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 5rpx;
}

.reward-status {
  font-size: 24rpx;
}

.reward-status.success {
  color: #2ecc71;
}

.reward-status.pending {
  color: #f39c12;
}

/* 空记录提示 */
.empty-records {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 底部按钮 */
.bottom-btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(to right, #ff6b6b, #ff9f43);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 45rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}
</style>
