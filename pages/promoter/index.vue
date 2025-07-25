AT ���������á������ schtasks.exe�� ��֧�ָ�����

<template>
  <view class="promoter-container">
    <!-- 头部状态卡片 -->
    <view class="header-card">
      <view class="user-info">
        <image
          :src="
            userInfo.avatar ||
            'https://cdn-icons-png.flaticon.com/128/847/847969.png'
          "
          class="avatar"
        ></image>
        <view class="user-detail">
          <view class="user-name">{{ userInfo.nickName || "请先登录" }}</view>
          <view class="user-level">{{ promoterInfo.level || "普通用户" }}</view>
        </view>
      </view>
      <view class="status-row">
        <view class="status-item">
          <view class="status-value">{{ promoterInfo.balance || "0.00" }}</view>
          <view class="status-label">可提现(元)</view>
        </view>
        <view class="status-divider"></view>
        <view class="status-item">
          <view class="status-value">{{
            promoterInfo.totalIncome || "0.00"
          }}</view>
          <view class="status-label">累计收益(元)</view>
        </view>
      </view>
      <view class="action-row">
        <view class="action-btn" @click="handleWithdraw">立即提现</view>
        <view
          class="action-btn outline"
          @click="navigateTo('/pages/promoter/join')"
          >升级等级</view
        >
      </view>
    </view>

    <!-- 数据概览 -->
    <view class="data-card">
      <view class="card-title">数据概览</view>
      <view class="data-grid">
        <view class="data-item" v-for="(item, index) in statsData" :key="index">
          <view class="data-value">{{ item.value }}</view>
          <view class="data-label">{{ item.label }}</view>
        </view>
      </view>
    </view>

    <!-- 收益走势 -->
    <view class="trend-card">
      <view class="card-header">
        <view class="card-title">收益走势</view>
        <view class="card-tabs">
          <view
            class="tab-item"
            v-for="(tab, index) in timeTabs"
            :key="index"
            :class="{ 'tab-active': activeTimeTab === index }"
            @click="switchTimeTab(index)"
          >
            {{ tab }}
          </view>
        </view>
      </view>
      <view class="chart-placeholder">
        <image
          src="https://cdn-icons-png.flaticon.com/128/9463/9463502.png"
          class="chart-icon"
        ></image>
        <view class="placeholder-text">暂无收益数据</view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-card">
      <view
        class="menu-item"
        v-for="(item, index) in menuItems"
        :key="index"
        @click="navigateTo(item.url)"
      >
        <image :src="item.icon" class="menu-icon"></image>
        <view class="menu-text">{{ item.text }}</view>
        <image
          src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          class="arrow-icon"
        ></image>
      </view>
    </view>

    <!-- 推广二维码 -->
    <view class="qrcode-card">
      <view class="card-title">我的推广码</view>
      <view class="qrcode-content">
        <image
          src="https://cdn-icons-png.flaticon.com/128/714/714435.png"
          class="qrcode-image"
        ></image>
        <view class="qrcode-tips">扫描二维码或分享链接邀请好友</view>
      </view>
      <view class="qrcode-actions">
        <view class="qrcode-btn" @click="saveQRCode">
          <image
            src="https://cdn-icons-png.flaticon.com/128/2550/2550230.png"
            class="btn-icon"
          ></image>
          <text>保存图片</text>
        </view>
        <view class="qrcode-btn" @click="shareToFriends">
          <image
            src="https://cdn-icons-png.flaticon.com/128/3580/3580382.png"
            class="btn-icon"
          ></image>
          <text>分享好友</text>
        </view>
      </view>
    </view>

    <!-- 推广攻略 -->
    <view class="tips-card">
      <view class="card-title">推广攻略</view>
      <view class="tips-list">
        <view
          class="tips-item"
          v-for="(item, index) in promotionTips"
          :key="index"
        >
          <view class="tips-number">{{ index + 1 }}</view>
          <view class="tips-content">{{ item }}</view>
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
        avatar: "",
        nickName: "",
      },
      promoterInfo: {
        level: "初级推广员",
        balance: "0.00",
        totalIncome: "0.00",
      },
      statsData: [
        { label: "团队人数", value: "0" },
        { label: "今日收益", value: "0.00" },
        { label: "本月收益", value: "0.00" },
        { label: "已提现金额", value: "0.00" },
      ],
      timeTabs: ["今日", "本周", "本月", "全部"],
      activeTimeTab: 2,
      menuItems: [
        {
          text: "收益明细",
          url: "/pages/promoter/income",
          icon: "https://cdn-icons-png.flaticon.com/128/2529/2529396.png",
        },
        {
          text: "团队管理",
          url: "/pages/promoter/team",
          icon: "https://cdn-icons-png.flaticon.com/128/476/476863.png",
        },
        {
          text: "提现记录",
          url: "/pages/promoter/withdraw",
          icon: "https://cdn-icons-png.flaticon.com/128/1611/1611179.png",
        },
        {
          text: "推广海报",
          url: "/pages/promoter/poster",
          icon: "https://cdn-icons-png.flaticon.com/128/3658/3658773.png",
        },
      ],
      promotionTips: [
        "向有POS机需求的商户推荐我们的产品",
        "通过朋友圈分享产品优势和推广码",
        "加入本地商户交流群进行推广",
        "利用节假日活动期间进行促销推广",
      ],
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.checkLoginStatus();
    this.loadPromoterData();
  },
  onPullDownRefresh() {
    this.checkLoginStatus();
    this.loadPromoterData();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      } else {
        uni.showModal({
          title: "提示",
          content: "请先登录",
          showCancel: false,
          success: () => {
            uni.switchTab({
              url: "/pages/user/index",
            });
          },
        });
      }
    },

    // 加载推广员数据
    loadPromoterData() {
      if (!this.userInfo.nickName) return;

      uni.showLoading({
        title: "加载中...",
      });

      // 这里模拟从服务器获取数据
      // 实际项目中应该调用云函数或API
      setTimeout(() => {
        // 模拟数据
        this.promoterInfo = {
          level: "初级推广员",
          balance: "0.00",
          totalIncome: "0.00",
        };

        this.statsData = [
          { label: "团队人数", value: "0" },
          { label: "今日收益", value: "0.00" },
          { label: "本月收益", value: "0.00" },
          { label: "已提现金额", value: "0.00" },
        ];

        uni.hideLoading();
      }, 500);
    },

    // 切换时间标签
    switchTimeTab(index) {
      this.activeTimeTab = index;
      // 这里应该重新加载对应时间段的数据
    },

    // 处理提现
    handleWithdraw() {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }

      if (parseFloat(this.promoterInfo.balance) <= 0) {
        uni.showToast({
          title: "暂无可提现金额",
          icon: "none",
        });
        return;
      }

      uni.navigateTo({
        url: "/pages/promoter/withdraw",
      });
    },

    // 页面导航
    navigateTo(url) {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }

      uni.navigateTo({
        url: url,
      });
    },

    // 保存二维码
    saveQRCode() {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }

      uni.showToast({
        title: "二维码保存成功",
        icon: "success",
      });
    },

    // 分享给好友
    shareToFriends() {
      if (!this.userInfo.nickName) {
        this.checkLoginStatus();
        return;
      }

      uni.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    },
  },
};
</script>

<style>
.promoter-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 40rpx;
}

/* 头部卡片 */
.header-card {
  background: linear-gradient(to right, #1296db, #14b8e4);
  color: #fff;
  padding: 30rpx;
  border-radius: 0 0 20rpx 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  margin-right: 20rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 6rpx;
}

.user-level {
  font-size: 24rpx;
  opacity: 0.9;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  display: inline-block;
}

.status-row {
  display: flex;
  margin-bottom: 30rpx;
}

.status-item {
  flex: 1;
  text-align: center;
}

.status-divider {
  width: 1rpx;
  height: 50rpx;
  background-color: rgba(255, 255, 255, 0.3);
  margin-top: 10rpx;
}

.status-value {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 6rpx;
}

.status-label {
  font-size: 24rpx;
  opacity: 0.9;
}

.action-row {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  background-color: #fff;
  color: #1296db;
  border-radius: 35rpx;
  font-size: 28rpx;
  font-weight: bold;
  margin: 0 15rpx;
}

.action-btn.outline {
  background-color: transparent;
  border: 1rpx solid #fff;
  color: #fff;
}

/* 数据卡片 */
.data-card,
.trend-card,
.menu-card,
.qrcode-card,
.tips-card {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.data-grid {
  display: flex;
  flex-wrap: wrap;
}

.data-item {
  width: 50%;
  margin-bottom: 20rpx;
}

.data-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.data-label {
  font-size: 26rpx;
  color: #999;
}

/* 收益走势 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-tabs {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  overflow: hidden;
}

.tab-item {
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  color: #666;
}

.tab-active {
  background-color: #1296db;
  color: #fff;
}

.chart-placeholder {
  height: 300rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.chart-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 28rpx;
  color: #999;
}

/* 功能菜单 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.menu-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.arrow-icon {
  width: 24rpx;
  height: 24rpx;
}

/* 二维码 */
.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 0;
}

.qrcode-image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 20rpx;
}

.qrcode-tips {
  font-size: 26rpx;
  color: #999;
}

.qrcode-actions {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.qrcode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 30rpx;
}

.btn-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 10rpx;
}

.qrcode-btn text {
  font-size: 24rpx;
  color: #666;
}

/* 推广攻略 */
.tips-list {
}

.tips-item {
  display: flex;
  margin-bottom: 20rpx;
}

.tips-item:last-child {
  margin-bottom: 0;
}

.tips-number {
  width: 40rpx;
  height: 40rpx;
  background-color: #1296db;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.tips-content {
  flex: 1;
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}
</style>
