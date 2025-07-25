<template>
  <view class="more-services">
    <!-- 页面标题 -->
    <view class="page-header">
      <image
        src="https://cdn-icons-png.flaticon.com/128/2099/2099203.png"
        class="header-icon"
      ></image>
      <text class="header-title">更多服务</text>
    </view>

    <!-- 服务分类区 -->
    <view class="services-section">
      <view class="section-title">设备服务</view>
      <view class="service-grid">
        <view
          class="service-item"
          v-for="(item, index) in deviceServices"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.icon" class="service-icon"></image>
          <text class="service-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="services-section">
      <view class="section-title">商户服务</view>
      <view class="service-grid">
        <view
          class="service-item"
          v-for="(item, index) in merchantServices"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.icon" class="service-icon"></image>
          <text class="service-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="services-section">
      <view class="section-title">增值服务</view>
      <view class="service-grid">
        <view
          class="service-item"
          v-for="(item, index) in valueAddedServices"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.icon" class="service-icon"></image>
          <text class="service-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐服务 -->
    <view class="recommend-section">
      <view class="section-title">热门推荐</view>
      <view class="recommend-list">
        <view
          class="recommend-item"
          v-for="(item, index) in recommendServices"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.banner" class="recommend-image"></image>
          <view class="recommend-info">
            <view class="recommend-name">{{ item.name }}</view>
            <view class="recommend-desc">{{ item.desc }}</view>
            <view class="recommend-tag" v-if="item.tag">{{ item.tag }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系客服 -->
    <view class="contact-section" @click="contactCustomerService">
      <image
        src="https://cdn-icons-png.flaticon.com/128/1671/1671060.png"
        class="contact-icon"
      ></image>
      <text class="contact-text">联系客服</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      deviceServices: [
        {
          name: "设备激活",
          icon: "https://cdn-icons-png.flaticon.com/128/1728/1728853.png",
          url: "/pages/service/activate",
        },
        {
          name: "设备更换",
          icon: "https://cdn-icons-png.flaticon.com/128/2972/2972528.png",
          url: "/pages/service/replace",
        },
        {
          name: "维修申请",
          icon: "https://cdn-icons-png.flaticon.com/128/1584/1584812.png",
          url: "/pages/service/repair",
        },
        {
          name: "固件升级",
          icon: "https://cdn-icons-png.flaticon.com/128/2991/2991112.png",
          url: "/pages/service/upgrade",
        },
      ],
      merchantServices: [
        {
          name: "商户入网",
          icon: "https://cdn-icons-png.flaticon.com/128/2897/2897785.png",
          url: "/pages/merchant/register",
        },
        {
          name: "资料变更",
          icon: "https://cdn-icons-png.flaticon.com/128/686/686589.png",
          url: "/pages/merchant/update",
        },
        {
          name: "结算查询",
          icon: "https://cdn-icons-png.flaticon.com/128/6569/6569264.png",
          url: "/pages/merchant/settlement",
        },
        {
          name: "费率查询",
          icon: "https://cdn-icons-png.flaticon.com/128/9394/9394580.png",
          url: "/pages/merchant/rate",
        },
      ],
      valueAddedServices: [
        {
          name: "流量充值",
          icon: "https://cdn-icons-png.flaticon.com/128/1968/1968666.png",
          url: "/pages/value/recharge",
        },
        {
          name: "保险服务",
          icon: "https://cdn-icons-png.flaticon.com/128/2279/2279710.png",
          url: "/pages/value/insurance",
        },
        {
          name: "SaaS服务",
          icon: "https://cdn-icons-png.flaticon.com/128/7518/7518748.png",
          url: "/pages/value/saas",
        },
        {
          name: "增值代理",
          icon: "https://cdn-icons-png.flaticon.com/128/3347/3347960.png",
          url: "/pages/value/agent",
        },
      ],
      recommendServices: [
        {
          name: "聚合收款解决方案",
          desc: "支持微信、支付宝、银联等多种支付方式",
          banner: "https://cdn-icons-png.flaticon.com/128/9358/9358847.png",
          url: "/pages/solution/payment",
          tag: "热门",
        },
        {
          name: "商户管理系统",
          desc: "一站式商户管理平台，提高运营效率",
          banner: "https://cdn-icons-png.flaticon.com/128/7268/7268615.png",
          url: "/pages/solution/management",
        },
        {
          name: "POS机租赁服务",
          desc: "低门槛享受专业POS服务",
          banner: "https://cdn-icons-png.flaticon.com/128/5673/5673159.png",
          url: "/pages/solution/rental",
        },
      ],
    };
  },
  methods: {
    // 页面导航
    navigateTo(url) {
      // 检查用户是否登录
      const userInfo = uni.getStorageSync("userInfo");
      if (
        !userInfo &&
        !url.includes("/pages/help/") &&
        !url.includes("/pages/guide/")
      ) {
        uni.showModal({
          title: "提示",
          content: "请先登录后再使用该服务",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              uni.switchTab({
                url: "/pages/user/index",
              });
            }
          },
        });
        return;
      }

      // 如果页面暂未开发，显示提示
      if (
        url.includes("/pages/merchant/") ||
        url.includes("/pages/value/") ||
        url.includes("/pages/solution/")
      ) {
        uni.showToast({
          title: "该功能正在开发中，敬请期待",
          icon: "none",
        });
        return;
      }

      // 页面存在，进行跳转
      uni.navigateTo({
        url: url,
        fail: (err) => {
          console.error("导航失败", err);
          uni.showToast({
            title: "页面不存在或正在开发中",
            icon: "none",
          });
        },
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
  },
};
</script>

<style>
.more-services {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 40rpx;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background: linear-gradient(to right, #1296db, #14b8e4);
  color: #fff;
}

.header-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
}

.services-section {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 30rpx;
  background-color: #1296db;
  border-radius: 3rpx;
}

.service-grid {
  display: flex;
  flex-wrap: wrap;
}

.service-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 15rpx;
}

.service-name {
  font-size: 26rpx;
  color: #666;
}

.recommend-list {
}

.recommend-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.recommend-item:last-child {
  border-bottom: none;
}

.recommend-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.recommend-info {
  flex: 1;
  position: relative;
}

.recommend-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.recommend-desc {
  font-size: 26rpx;
  color: #999;
}

.recommend-tag {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff5252;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.contact-section {
  margin: 30rpx;
  height: 100rpx;
  background-color: #fff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.contact-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 15rpx;
}

.contact-text {
  font-size: 30rpx;
  color: #333;
}
</style>
