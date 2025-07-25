<template>
  <view class="index-container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goToSearch">
        <text class="iconfont icon-search"></text>
        <text class="placeholder">搜索POS机型号、品牌</text>
      </view>
    </view>

    <!-- 轮播广告 -->
    <swiper
      class="banner"
      circular
      autoplay
      interval="3000"
      duration="500"
      indicator-dots
      indicator-active-color="#1296db"
    >
      <swiper-item
        v-for="(item, index) in banners"
        :key="index"
        @click="goToBannerDetail(item)"
      >
        <image :src="item.image" ></image>
      </swiper-item>
    </swiper>

    <!-- 公告栏 -->
    <view class="notice-bar">
      <text class="iconfont icon-notice"></text>
      <swiper class="notice-swiper" vertical circular autoplay interval="3000">
        <swiper-item v-for="(notice, index) in notices" :key="index">
          <text class="notice-text">{{ notice.content }}</text>
        </swiper-item>
      </swiper>
    </view>

    <!-- 产品分类导航 -->
    <!-- <view class="category-nav">
      <view
        class="category-item"
        v-for="(item, index) in categories"
        :key="index"
        @click="goToCategory(item)"
      >
        <image :src="item.icon" mode="aspectFit"></image>
        <text>{{ item.name }}</text>
      </view>
    </view> -->

    <!-- 热门产品推荐 -->
    <view class="hot-products">
      <view class="section-title">
        <text>热门产品</text>
        <!-- <text class="more" @click="goToProductList">更多</text> -->
      </view>
      <view class="product-list">
        <view
          class="product-item"
          v-for="(item, index) in hotProducts"
          :key="index"
          @click="goToProductDetail(item)"
        >
          <image :src="item.image" mode="aspectFill"></image>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-tags">
              <text
                v-for="(tag, tagIndex) in item.tags"
                :key="tagIndex"
                class="tag"
                >{{ tag }}</text
              >
            </view>
            <text class="product-desc">{{ item.desc }}</text>
            <view class="product-bottom">
              <text class="product-price">¥{{ item.price }}</text>
              <text class="apply-btn" @click.stop="quickApply(item)"
                >立即申请</text
              >
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动专区 -->
    <!-- <view class="activity-section">
      <view class="section-title">
        <text>优惠活动</text>
        <text class="more" @click="goToActivityList">更多</text>
      </view>
      <scroll-view scroll-x class="activity-scroll">
        <view
          class="activity-card"
          v-for="(activity, index) in activities"
          :key="index"
          @click="goToActivity(activity)"
        >
          <image :src="activity.image" mode="aspectFill"></image>
          <view class="activity-info">
            <text class="activity-title">{{ activity.title }}</text>
            <text class="activity-date">{{ activity.dateRange }}</text>
          </view>
        </view>
      </scroll-view>
    </view> -->

    <!-- 用户引导区 -->
    <view class="guide-section">
      <view class="section-title">
        <text>便捷服务</text>
      </view>
      <view class="guide-grid">
        <view
          class="guide-item"
          v-for="(item, index) in guideItems"
          :key="index"
          @click="navigateTo(item.url)"
        >
          <image :src="item.icon" mode="aspectFit"></image>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 推广政策 -->
    <!-- <view class="policy-section">
      <view class="section-title">
        <text>推广政策</text>
      </view>
      <view class="policy-content">
        <view class="policy-card">
          <view class="policy-header">
            <text class="policy-title">推广员专享福利</text>
            <text class="policy-subtitle">高额佣金 · 灵活兼职</text>
          </view>
          <view class="policy-body">
            <view class="policy-item">
              <text class="policy-item-title">佣金比例</text>
              <text class="policy-item-value">最高50%</text>
            </view>
            <view class="policy-item">
              <text class="policy-item-title">结算周期</text>
              <text class="policy-item-value">T+1到账</text>
            </view>
            <view class="policy-item">
              <text class="policy-item-title">推广方式</text>
              <text class="policy-item-value">线上+线下</text>
            </view>
          </view>
          <view class="policy-footer">
            <text class="policy-btn" @click="goToPromoter">了解详情</text>
          </view>
        </view>
      </view>
    </view> -->

    <!-- 客服咨询 -->
    <view class="customer-service" @click="contactService">
      <img
        src="/static/banner/kefu.png"
        alt=""
        style="width: 50rpx; height: 50rpx"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [
        {
          id: 1,
          image: "/static/banner/lb1.png",
          url: "/pages/activity/detail?id=1",
        },
		{
		  id: 2,
		  image: "/static/banner/lb2.png",
		  url: "/pages/activity/detail?id=2",
		},
		
      ],
      notices: [
        { id: 1, content: "新品上市：智能POS机A2，支持人脸识别支付" },
        { id: 2, content: "活动公告：新用户首次申请，押金减免50%" },
        { id: 3, content: "累计装机10000台，感谢您的支持" },
      ],
      categories: [
        {
          id: 1,
          name: "传统POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2331/2331717.png",
        },
        {
          id: 2,
          name: "智能POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2038/2038792.png",
        },
        {
          id: 3,
          name: "移动POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2496/2496153.png",
        },
        {
          id: 4,
          name: "刷卡机",
          icon: "https://cdn-icons-png.flaticon.com/128/6475/6475714.png",
        },
      ],
      hotProducts: [
        {
          id: 1,
          name: "智能POS机A1 Pro",
          desc: "激活退押金",
          price: "99",
          tags: ["秒到账", "轻薄小巧", "彩色液晶"],
          image: "/static/banner/99.png",
        },
        {
          id: 2,
          name: "乐积分4G传统199版A",
          desc: "激活退押金",
          price: "199",
          tags: ["秒到账", "可出票", "屏幕手写"],
          image: "/static/banner/199-2.png",
        },
        {
          id: 3,
          name: "乐积分微智能电签199版A",
          desc: "激活退押金",
          price: "199",
          tags: ["秒到账", "3.5寸大屏", "支持触控"],
          image: "/static/banner/199.png",
        },
      ],
      activities: [
        {
          id: 1,
          title: "新人特惠",
          dateRange: "2023.6.1-2023.6.30",
          image: "https://img01.yzcdn.cn/vant/cat.jpeg",
        },
        {
          id: 2,
          title: "618促销季",
          dateRange: "2023.6.1-2023.6.18",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
        },
        {
          id: 3,
          title: "夏日大促",
          dateRange: "2023.7.1-2023.7.31",
          image: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",
        },
      ],
      guideItems: [
        {
          name: "申请流程",
          icon: "/static/banner/sqlc.png",
          url: "/pages/guide/apply",
        },
        {
          name: "使用教程",
          icon: "/static/banner/syjc.png",
          url: "/pages/guide/usage",
        },
        {
          name: "售后服务",
          icon: "/static/banner/shfw.png",
          url: "/pages/service/after-sale",
        },
        {
          name: "常见问题",
          icon: "/static/banner/cjwt.png",
          url: "/pages/help/index",
        },
      ],
    };
  },
  onLoad() {
    // 页面加载时获取数据
    this.fetchHomeData();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.fetchHomeData();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    fetchHomeData() {
      // 这里模拟从服务器获取首页数据
      // 实际开发中应该调用API接口
      console.log("获取首页数据");
      // 模拟数据加载延迟
      setTimeout(() => {
        console.log("数据加载完成");
      }, 500);
    },
    goToSearch() {
      uni.navigateTo({
        url: "/pages/search/index",
      });
    },
    goToBannerDetail(banner) {
      uni.navigateTo({
        url: "/pages/apply/index?bannerId=" + banner.id,
      });
    },
    goToCategory(category) {
      uni.navigateTo({
        url:
          "/pages/product/list?category=" +
          category.id +
          "&categoryName=" +
          category.name,
      });
    },
    goToProductList() {
      uni.switchTab({
        url: "/pages/product/list",
      });
    },
    goToProductDetail(product) {
      uni.navigateTo({
        url: "/pages/apply/index?productId=" + product.id,
      });
    },
    goToActivityList() {
      uni.navigateTo({
        url: "/pages/activity/list",
      });
    },
    goToActivity(activity) {
      uni.navigateTo({
        url: "/pages/activity/detail?id=" + activity.id,
      });
    },
    goToApply() {
      uni.navigateTo({
        url: "/pages/apply/index",
      });
    },
    goToHelp() {
      uni.navigateTo({
        url: "/pages/help/index",
      });
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url,
      });
    },
    quickApply(product) {
      uni.navigateTo({
        url: "/pages/apply/index?productId=" + product.id,
      });
    },
    goToPromoter() {
      uni.navigateTo({
        url: "/pages/promoter/index",
      });
    },
    contactService() {
      // 这里可以调用客服会话
      uni.showToast({
        title: "正在连接客服...",
        icon: "none",
      });

      // 实际开发中可以使用微信小程序的客服接口
      // 例如：
      /*
      uni.openCustomerServiceChat({
        extInfo: {url: ''},
        corpId: '',
        success(res) {}
      })
      */
    },
  },
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.index-container {
  padding-bottom: 30rpx;
}

/* 搜索栏样式 */
.search-bar {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.search-input {
  display: flex;
  align-items: center;
  height: 64rpx;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 30rpx;
}

.icon-search {
  margin-right: 10rpx;
  color: #999;
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}

/* 轮播图样式 */
.banner {
  width: 100%;
  height: 350rpx;
}

.banner image {
  width: 100%;
  height: 100%;
}

/* 公告栏样式 */
.notice-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15rpx 30rpx;
  margin-bottom: 20rpx;
}

.icon-notice {
  color: #ff6b00;
  margin-right: 15rpx;
}

.notice-swiper {
  flex: 1;
  height: 40rpx;
}

.notice-text {
  font-size: 24rpx;
  color: #666;
  line-height: 40rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分类导航样式 */
.category-nav {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}

.category-item image {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.category-item text {
  font-size: 24rpx;
  color: #333;
}

/* 标题样式 */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.more {
  font-size: 24rpx;
  color: #666;
  font-weight: normal;
}

/* 热门产品样式 */
.hot-products,
.activity-section,
.guide-section,
.policy-section {
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.product-list {
  padding: 0 20rpx;
}

.product-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item image {
  width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;
  border-radius: 8rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.product-tags {
  display: flex;
  margin-bottom: 10rpx;
}

.tag {
  font-size: 20rpx;
  color: #ff6b00;
  background-color: rgba(255, 107, 0, 0.1);
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
  margin-right: 10rpx;
}

.product-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 32rpx;
  color: #ff6b00;
  font-weight: bold;
}

.apply-btn {
  font-size: 24rpx;
  color: #fff;
  background-color: #1296db;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

/* 活动专区样式 */
.activity-scroll {
  white-space: nowrap;
  padding: 0 20rpx 30rpx;
}

.activity-card {
  display: inline-block;
  width: 400rpx;
  margin-right: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.activity-card image {
  width: 400rpx;
  height: 200rpx;
}

.activity-info {
  padding: 15rpx;
}

.activity-title {
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 5rpx;
  display: block;
}

.activity-date {
  font-size: 22rpx;
  color: #999;
  display: block;
}

/* 用户引导区样式 */
.guide-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10rpx 30rpx;
}

.guide-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.guide-item image {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.guide-item text {
  font-size: 24rpx;
  color: #333;
}

/* 推广政策样式 */
.policy-content {
  padding: 0 30rpx 30rpx;
}

.policy-card {
  background: linear-gradient(135deg, #3a8ee6, #1296db);
  border-radius: 12rpx;
  overflow: hidden;
  color: #fff;
}

.policy-header {
  padding: 30rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.policy-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.policy-subtitle {
  font-size: 24rpx;
  opacity: 0.8;
}

.policy-body {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
}

.policy-item {
  text-align: center;
}

.policy-item-title {
  font-size: 24rpx;
  opacity: 0.8;
  display: block;
  margin-bottom: 10rpx;
}

.policy-item-value {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.policy-footer {
  padding: 20rpx 30rpx;
  text-align: center;
}

.policy-btn {
  display: inline-block;
  border: 1px solid #fff;
  padding: 10rpx 40rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
}

/* 客服按钮 */
.customer-service {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 80rpx;
  height: 80rpx;
  /* background-color: #1296db; */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.icon-service {
  color: #fff;
  font-size: 40rpx;
}

/* 图标字体 */
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

.icon-search:before {
  content: "\e8ef";
}

.icon-notice:before {
  content: "\e617";
}

.icon-service:before {
  content: "\e688";
}
</style>
