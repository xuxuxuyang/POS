<template>
  <view class="search-container">
    <!-- 搜索框 -->
    <view class="search-header">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          placeholder="搜索POS机型号、品牌"
          focus
          confirm-type="search"
          @confirm="handleSearch"
        />
        <text class="clear-icon" v-if="keyword" @click="clearKeyword">×</text>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 历史搜索 -->
    <view class="history-section" v-if="!keyword && historyKeywords.length > 0">
      <view class="section-header">
        <text class="section-title">历史搜索</text>
        <text class="clear-history" @click="clearHistory">清除</text>
      </view>
      <view class="history-tags">
        <text
          class="history-tag"
          v-for="(item, index) in historyKeywords"
          :key="index"
          @click="useHistoryKeyword(item)"
          >{{ item }}</text
        >
      </view>
    </view>

    <!-- 热门搜索 -->
    <view class="hot-section" v-if="!keyword">
      <view class="section-header">
        <text class="section-title">热门搜索</text>
      </view>
      <view class="hot-tags">
        <text
          class="hot-tag"
          v-for="(item, index) in hotKeywords"
          :key="index"
          @click="useHistoryKeyword(item)"
          >{{ item }}</text
        >
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="keyword && searching">
      <view class="loading-wrapper">
        <view class="loading-icon"></view>
        <text class="loading-text">正在搜索...</text>
      </view>
    </view>

    <!-- 搜索结果列表 -->
    <view
      class="search-results"
      v-else-if="keyword && searchResults.length > 0"
    >
      <view
        class="result-item"
        v-for="(item, index) in searchResults"
        :key="index"
        @click="goToProductDetail(item)"
      >
        <image :src="item.image" mode="aspectFill" class="result-image"></image>
        <view class="result-info">
          <view class="result-name">{{ item.name }}</view>
          <view class="result-desc">{{ item.desc }}</view>
          <view class="result-price">¥{{ item.price }}</view>
        </view>
      </view>
    </view>

    <!-- 无搜索结果 -->
    <view
      class="no-result"
      v-else-if="keyword && !searching && searchResults.length === 0"
    >
      <image
        src="https://cdn-icons-png.flaticon.com/128/1548/1548682.png"
        mode="aspectFit"
        class="no-result-image"
      ></image>
      <text class="no-result-text">没有找到相关POS机产品</text>
      <text class="no-result-tip">可以尝试其他关键词或联系客服</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      searching: false,
      historyKeywords: [],
      hotKeywords: [
        "智能POS",
        "刷卡机",
        "银联POS",
        "移动POS",
        "mPOS",
        "扫码支付",
      ],
      searchResults: [],
    };
  },
  onLoad() {
    // 获取历史搜索记录
    const history = uni.getStorageSync("searchHistory");
    if (history) {
      this.historyKeywords = JSON.parse(history);
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    clearKeyword() {
      this.keyword = "";
      this.searchResults = [];
    },
    useHistoryKeyword(keyword) {
      this.keyword = keyword;
      this.handleSearch();
    },
    clearHistory() {
      uni.showModal({
        title: "提示",
        content: "确定要清除所有历史记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.historyKeywords = [];
            uni.removeStorageSync("searchHistory");
          }
        },
      });
    },
    handleSearch() {
      if (!this.keyword.trim()) return;

      // 将关键词加入历史记录
      if (!this.historyKeywords.includes(this.keyword)) {
        this.historyKeywords.unshift(this.keyword);
        // 限制历史记录数量
        if (this.historyKeywords.length > 10) {
          this.historyKeywords.pop();
        }
        // 保存到本地存储
        uni.setStorageSync(
          "searchHistory",
          JSON.stringify(this.historyKeywords)
        );
      }

      // 开始搜索
      this.searching = true;
      this.searchResults = [];

      // 模拟搜索过程
      setTimeout(() => {
        this.searching = false;
        // 模拟搜索结果
        if (this.keyword.includes("POS") || this.keyword.includes("pos")) {
          this.searchResults = [
            {
              id: 1,
              name: "智能POS机A1 Pro",
              desc: "全能收款，支持扫码/刷卡/NFC",
              price: "1580",
              image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
            },
            {
              id: 2,
              name: "移动POS机B2 Plus",
              desc: "便携式，支持4G网络，续航持久",
              price: "980",
              image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png",
            },
            {
              id: 3,
              name: "多功能收款机C3",
              desc: "触摸屏操作，支持打印小票，高速结算",
              price: "2680",
              image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png",
            },
          ];
        }
      }, 1000);
    },
    goToProductDetail(product) {
      uni.navigateTo({
        url: `/pages/product/detail?id=${product.id}`,
      });
    },
  },
};
</script>

<style>
.search-container {
  background-color: #fff;
  min-height: 100vh;
}

/* 搜索框样式 */
.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  position: relative;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  height: 64rpx;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 20rpx;
}

.icon-search {
  margin-right: 10rpx;
  color: #999;
}

.search-input {
  flex: 1;
  height: 64rpx;
  font-size: 28rpx;
}

.clear-icon {
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  color: #999;
  font-size: 32rpx;
}

.cancel-btn {
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

/* 历史搜索和热门搜索样式 */
.history-section,
.hot-section {
  padding: 20rpx 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.clear-history {
  font-size: 24rpx;
  color: #999;
}

.history-tags,
.hot-tags {
  display: flex;
  flex-wrap: wrap;
}

.history-tag,
.hot-tag {
  background-color: #f5f5f5;
  padding: 10rpx 20rpx;
  margin: 0 20rpx 20rpx 0;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #666;
}

.hot-tag {
  background-color: #f0f9ff;
  color: #1296db;
}

/* 搜索结果样式 */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.loading-icon {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #1296db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 26rpx;
  color: #999;
}

.result-item {
  display: flex;
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.result-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.result-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.result-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.result-price {
  font-size: 32rpx;
  color: #ff6b00;
  font-weight: bold;
}

/* 无结果样式 */
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.no-result-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.no-result-text {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.no-result-tip {
  font-size: 26rpx;
  color: #999;
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
</style>
