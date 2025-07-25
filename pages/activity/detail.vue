<template>
  <view class="detail-container">
    <!-- 活动图片 -->
    <view class="activity-banner">
      <image
        :src="activity.image"
        mode="aspectFill"
        class="banner-image"
      ></image>
      <view
        class="activity-status"
        :class="{ expired: activity.status === 'expired' }"
      >
        {{ getStatusText(activity.status) }}
      </view>
    </view>

    <!-- 活动基本信息 -->
    <view class="activity-info">
      <view class="activity-title">{{ activity.name }}</view>
      <view class="activity-meta">
        <view class="meta-item">
          <text class="meta-label">活动时间：</text>
          <text class="meta-value">{{ activity.dateRange }}</text>
        </view>
        <view class="meta-item">
          <text class="meta-label">活动对象：</text>
          <text class="meta-value">{{ activity.target }}</text>
        </view>
      </view>
    </view>

    <!-- 活动内容 -->
    <view class="activity-content">
      <view class="content-title">活动详情</view>
      <rich-text :nodes="activity.content"></rich-text>
    </view>

    <!-- 活动规则 -->
    <view class="activity-rules">
      <view class="rules-title">活动规则</view>
      <view class="rules-list">
        <view
          class="rule-item"
          v-for="(rule, index) in activity.rules"
          :key="index"
        >
          <text class="rule-index">{{ index + 1 }}.</text>
          <text class="rule-text">{{ rule }}</text>
        </view>
      </view>
    </view>

    <!-- 相关产品 -->
    <view
      class="related-products"
      v-if="activity.products && activity.products.length > 0"
    >
      <view class="products-title">相关产品</view>
      <scroll-view scroll-x class="products-scroll">
        <view
          class="product-item"
          v-for="(product, index) in activity.products"
          :key="index"
          @click="goToProductDetail(product)"
        >
          <image
            :src="product.image"
            mode="aspectFill"
            class="product-image"
          ></image>
          <text class="product-name">{{ product.name }}</text>
          <text class="product-price">¥{{ product.price }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 活动底部 -->
    <view class="activity-footer">
      <view class="share-btn" @click="shareActivity">
        <text class="iconfont icon-share"></text>
        <text>分享</text>
      </view>
      <button
        class="join-btn"
        :class="{ disabled: activity.status === 'expired' }"
        :disabled="activity.status === 'expired'"
        @click="joinActivity"
      >
        {{ activity.status === "expired" ? "活动已结束" : "立即参与" }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      activity: {
        id: 1,
        name: "新人特惠",
        description: "新用户首次申请POS机，享受押金减免50%，还有多重好礼相送！",
        dateRange: "2023.6.1-2023.12.31",
        status: "ongoing",
        image: "https://img01.yzcdn.cn/vant/cat.jpeg",
        target: "首次申请POS机的新用户",
        content:
          '<p style="text-indent:2em;margin-bottom:15px;">为回馈广大新用户对我们的支持与信任，特推出"新人特惠"活动，让您以更低的成本体验优质的POS机服务。</p><p style="text-indent:2em;margin-bottom:15px;">活动期间，新用户首次申请POS机，可享受押金减免50%的优惠，最高可省500元！同时，还可获得多重好礼：</p><p style="margin-bottom:15px;font-weight:bold;">活动福利：</p><p style="margin-left:20px;margin-bottom:10px;">1. POS机押金减免50%，最高可省500元</p><p style="margin-left:20px;margin-bottom:10px;">2. 首月交易免手续费</p><p style="margin-left:20px;margin-bottom:10px;">3. 精美收银盒一个</p><p style="margin-left:20px;margin-bottom:10px;">4. 热敏纸5卷</p><p style="text-indent:2em;margin-top:20px;">心动不如行动，立即申请，享受新人特惠吧！</p>',
        rules: [
          "活动时间：2023年6月1日至2023年12月31日",
          "活动对象：首次申请POS机的新用户",
          "押金减免活动仅限首次申请，每个用户仅可参与一次",
          "首月交易免手续费指自设备激活之日起30天内",
          "活动礼品将随设备一起寄出",
          "本公司保留对活动的最终解释权",
        ],
        products: [
          {
            id: 1,
            name: "智能POS机A1 Pro",
            price: "1580",
            image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
          },
          {
            id: 2,
            name: "移动POS机B2 Plus",
            price: "980",
            image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png",
          },
          {
            id: 3,
            name: "多功能收款机C3",
            price: "2680",
            image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png",
          },
        ],
      },
    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.fetchActivityDetail();
    }
  },
  methods: {
    fetchActivityDetail() {
      // 实际开发中应该根据ID调用API获取活动详情
      console.log("获取活动详情，ID:", this.id);

      // 模拟获取数据延迟
      uni.showLoading({
        title: "加载中...",
      });

      setTimeout(() => {
        uni.hideLoading();
        // 这里应该是实际的API调用返回数据
        // this.activity = result.data;
      }, 500);
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
    goToProductDetail(product) {
      uni.navigateTo({
        url: "/pages/product/detail?id=" + product.id,
      });
    },
    shareActivity() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    },
    joinActivity() {
      if (this.activity.status === "expired") {
        uni.showToast({
          title: "活动已结束",
          icon: "none",
        });
        return;
      }

      // 跳转到申请页面
      uni.navigateTo({
        url: "/pages/apply/index?activityId=" + this.activity.id,
      });
    },
  },
  // 分享功能
  onShareAppMessage() {
    return {
      title: this.activity.name,
      path: "/pages/activity/detail?id=" + this.activity.id,
      imageUrl: this.activity.image,
    };
  },
  onShareTimeline() {
    return {
      title: this.activity.name,
      query: "id=" + this.activity.id,
      imageUrl: this.activity.image,
    };
  },
};
</script>

<style>
.detail-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.activity-banner {
  width: 100%;
  height: 400rpx;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.activity-status {
  position: absolute;
  top: 30rpx;
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

.activity-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.activity-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.activity-meta {
  margin-top: 20rpx;
}

.meta-item {
  display: flex;
  margin-bottom: 10rpx;
}

.meta-label {
  font-size: 28rpx;
  color: #999;
  width: 150rpx;
}

.meta-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.activity-content,
.activity-rules,
.related-products {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.content-title,
.rules-title,
.products-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  position: relative;
  padding-left: 20rpx;
}

.content-title::before,
.rules-title::before,
.products-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8rpx;
  height: 30rpx;
  background-color: #1296db;
  border-radius: 4rpx;
}

.rules-list {
  margin-top: 20rpx;
}

.rule-item {
  display: flex;
  margin-bottom: 15rpx;
}

.rule-index {
  color: #1296db;
  margin-right: 10rpx;
  font-weight: bold;
}

.rule-text {
  font-size: 28rpx;
  color: #666;
  flex: 1;
  line-height: 1.6;
}

.products-scroll {
  white-space: nowrap;
  margin-top: 20rpx;
}

.product-item {
  display: inline-block;
  width: 220rpx;
  margin-right: 20rpx;
}

.product-image {
  width: 220rpx;
  height: 220rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.product-name {
  font-size: 26rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.product-price {
  font-size: 28rpx;
  color: #ff6b00;
  font-weight: bold;
  display: block;
}

.activity-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
}

.share-btn text {
  font-size: 24rpx;
  color: #666;
}

.iconfont {
  font-size: 40rpx;
  color: #666;
}

.join-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
}

.join-btn.disabled {
  background-color: #cccccc;
}

@font-face {
  font-family: "iconfont";
  src: url("data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAO0AAsAAAAACFwAAANlAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqDaIM0ATYCJAMUCwwABCAFhGcHWhtSB8gOJaHAwABgAABgPHzt9/vMzL5qkiaxJNFMJ54JiUQoJEgQStdOJJXOzOH5nHbvz0U1TJNUK+F3R8OqZjwzmqVkIiRC0hBP17z6X9NLmtSZLp7k8rz/g+fS9HNA+YDNpYvSRVEcYBxggO3FKrACCeQN45YXehj7CbQb5yS7VlDcAlbCGBeIa5xiwFpBVinhphZaQ2YWPuFRi576CDzw348f2LAWJHUGxpErF7kVpP+W/u7o6/PSNQ4E/nQWYB1kzAOFuJ5puYZw0Tyg3V98y0VArTaJb2l4kXiZfLn9zT+8IJEVRDMQ94J4M/gtJYZvySvGt7xKfE0JxDc9h66vgTbsowE9gGQxzzRVxPSSjabp7ZbmFJnxSSSbzk3JYfNb1vScvH5mME9NN99tmV3U6rqXpFEkMVuQJMY2LZaEWm+mp6MbM7KKH+t+Lb61sX6jw7rYJCZ/XHxGfFZ4Q2hjdstcgyCUJIm0KJQNoxmLFDY1mZH6OD0RpMORRU7q8SJiZ11OanydUZPZnNGTJoxnbhZhPpb8Psh67Hyo+7Hck4XHLO3J5mD2Z2X7pK/v2yfj+MQGnmJQnIlT1u1Trbs0m2Fmg1+Q1XXuLPSedepkALEAUGz6MpY8u2S4Q+6s7OzF/qnl5bdHRt4d5DYH3o5lL4QDQ12uA+6uA90lXcP7eju9/Tv0VaFfKR3qGdg30Of9L+1u8/eO/Nuw/t2HttZvmPnYLq+XE8qP2v+B+m8yz+7V4LeIFoH/m6XQA+CnvQz9JZvx7f/6xnHg/WQMz3/Ht1b6Bzg/uQYdmzaRZIVRMFokbVPTt7KsXav8o9sQaDfsvk93D5ePsYY0axIkTUYgazaGLNg8qHSYB7Vmi6DdnMrVHQYiRJG0BmY9AIR+hyDp9hSyfseSBf0GlWG/odYfBNpdiJFLO0yGA8UZ0YQCjzwHckZTjdRCKaib4yGbKwoKXQLdCNMZrSdSZRPjNftI73FCCbOmIi6gHKeESbRBaWJKrNCpMD9fmhCJUeaYFzqhAAfOEGkCAY54HJAzNKqR5s6U+vwcJDOukCCRG0t9I5hWw2oTUhonGvPqWoPrrdyIZZRRIVwAORxFgolIA1XTmCLMoKXC+o1LEghxcZG9VF74hvhS2wDtoKMoUeIkwW81sY1JnaSmYm6iNuOURrsJAA==")
    format("woff2");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-share:before {
  content: "\e60d";
}
</style>
