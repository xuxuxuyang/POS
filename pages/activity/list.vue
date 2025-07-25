<template>
  <view class="activity-container">
    <view class="activity-header">
      <image
        src="https://cdn-icons-png.flaticon.com/128/3650/3650073.png"
        mode="aspectFit"
        class="activity-icon"
      ></image>
      <text class="activity-title">优惠活动</text>
    </view>

    <!-- 活动类型选择器 -->
    <view class="activity-tabs">
      <view
        class="tab-item"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: currentTab === index }"
        @click="switchTab(index)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- 活动列表 -->
    <view class="activity-list">
      <view class="activity-empty" v-if="filteredActivities.length === 0">
        <image
          src="https://cdn-icons-png.flaticon.com/128/8629/8629397.png"
          mode="aspectFit"
          class="empty-icon"
        ></image>
        <text class="empty-text">暂无相关活动</text>
      </view>

      <view
        class="activity-item"
        v-for="(item, index) in filteredActivities"
        :key="index"
        @click="goToActivityDetail(item)"
      >
        <image
          :src="item.image"
          mode="aspectFill"
          class="activity-image"
        ></image>
        <view class="activity-info">
          <view
            class="activity-status"
            :class="{ expired: item.status === 'expired' }"
          >
            {{ getStatusText(item.status) }}
          </view>
          <view class="activity-name">{{ item.name }}</view>
          <view class="activity-date">{{ item.dateRange }}</view>
          <view class="activity-desc">{{ item.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [
        { name: "全部活动", value: "all" },
        { name: "进行中", value: "ongoing" },
        { name: "即将开始", value: "upcoming" },
        { name: "已结束", value: "expired" },
      ],
      activities: [
        {
          id: 1,
          name: "新人特惠",
          description:
            "新用户首次申请POS机，享受押金减免50%，还有多重好礼相送！",
          dateRange: "2023.6.1-2023.12.31",
          status: "ongoing",
          image: "https://img01.yzcdn.cn/vant/cat.jpeg",
        },
        {
          id: 2,
          name: "618促销季",
          description: "年中大促，全场POS机押金立减100元，限时优惠不容错过！",
          dateRange: "2023.6.1-2023.6.18",
          status: "expired",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
        },
        {
          id: 3,
          name: "夏日大促",
          description: "炎炎夏日，清凉福利来袭，申请指定机型享受交易费率优惠！",
          dateRange: "2023.7.1-2023.7.31",
          status: "upcoming",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",
        },
        {
          id: 4,
          name: "商家福利计划",
          description: "成为我们的合作商家，享受专属服务和优惠政策，共创双赢！",
          dateRange: "2023.6.1-2023.12.31",
          status: "ongoing",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg",
        },
      ],
    };
  },
  computed: {
    filteredActivities() {
      const tabValue = this.tabs[this.currentTab].value;
      if (tabValue === "all") {
        return this.activities;
      } else {
        return this.activities.filter((item) => item.status === tabValue);
      }
    },
  },
  onLoad() {
    // 获取活动列表数据
    this.fetchActivities();
  },
  methods: {
    fetchActivities() {
      // 实际开发中应该调用API获取活动数据
      console.log("获取活动列表");
    },
    switchTab(index) {
      this.currentTab = index;
    },
    goToActivityDetail(activity) {
      uni.navigateTo({
        url: "/pages/activity/detail?id=" + activity.id,
      });
    },
    getStatusText(status) {
      switch (status) {
        case "ongoing":
          return "进行中";
        case "upcoming":
          return "即将开始";
        case "expired":
          return "已结束";
        default:
          return "";
      }
    },
  },
};
</script>

<style>
.activity-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.activity-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background-color: #fff;
}

.activity-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.activity-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.activity-tabs {
  display: flex;
  background-color: #fff;
  padding: 0 20rpx;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #1296db;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #1296db;
  border-radius: 3rpx;
}

.activity-list {
  padding: 20rpx 30rpx;
}

.activity-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.activity-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.activity-image {
  width: 100%;
  height: 300rpx;
}

.activity-info {
  padding: 20rpx 30rpx 30rpx;
  position: relative;
}

.activity-status {
  position: absolute;
  top: -50rpx;
  right: 30rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
}

.activity-status.expired {
  background-color: #999;
}

.activity-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.activity-date {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
}

.activity-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>
