<template>
  <view class="product-list-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goToSearch">
        <text class="iconfont icon-search"></text>
        <text class="placeholder">搜索POS机型号、品牌</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <view class="filter-section">
      <scroll-view scroll-x="true" class="category-scroll">
        <view
          class="category-item"
          v-for="(item, index) in categories"
          :key="index"
          :class="{ active: currentCategory === item.name }"
          @click="changeCategory(item.name)"
        >
          <image
            :src="item.icon"
            mode="aspectFit"
            class="category-icon"
          ></image>
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 高级筛选 -->
    <view class="filter-toolbar">
      <view
        class="filter-item"
        @click="changeSort('default')"
        :class="{ active: currentSort === 'default' }"
      >
        <text>默认</text>
      </view>
      <view
        class="filter-item"
        @click="changeSort('sales')"
        :class="{ active: currentSort === 'sales' }"
      >
        <text>销量</text>
        <text class="sort-icon">{{ currentSort === "sales" ? "↓" : "↑" }}</text>
      </view>
      <view
        class="filter-item"
        @click="changeSort('price')"
        :class="{ active: currentSort === 'price' }"
      >
        <text>价格</text>
        <text class="sort-icon">{{
          currentSort === "price" && priceSortAsc ? "↑" : "↓"
        }}</text>
      </view>
      <view class="filter-item" @click="showFilter = !showFilter">
        <text>筛选</text>
        <text class="iconfont icon-filter"></text>
      </view>
    </view>

    <!-- 筛选面板 -->
    <view class="filter-panel" v-if="showFilter">
      <view class="filter-group">
        <view class="filter-title">价格区间</view>
        <view class="price-range">
          <view
            class="price-item"
            v-for="(range, index) in priceRanges"
            :key="index"
            :class="{ active: selectedPriceRange === index }"
            @click="selectPriceRange(index)"
          >
            {{ range.label }}
          </view>
        </view>
      </view>
      <view class="filter-group">
        <view class="filter-title">支付方式</view>
        <view class="tag-group">
          <view
            class="tag-item"
            v-for="(item, index) in paymentMethods"
            :key="index"
            :class="{ active: selectedPaymentMethods.includes(item) }"
            @click="togglePaymentMethod(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>
      <view class="filter-buttons">
        <button class="reset-btn" @click="resetFilter">重置</button>
        <button class="confirm-btn" @click="applyFilter">确定</button>
      </view>
    </view>

    <!-- 产品列表 -->
    <view class="product-list">
      <view
        class="product-item"
        v-for="(item, index) in productList"
        :key="index"
        @click="goToDetail(item)"
      >
        <image
          :src="
            item.image ||
            'https://cdn-icons-png.flaticon.com/128/9553/9553028.png'
          "
          mode="aspectFill"
          class="product-image"
        ></image>
        <view class="product-info">
          <view class="product-header">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-tags">
              <text
                class="tag-item"
                v-for="(tag, tagIndex) in item.tags"
                :key="tagIndex"
                >{{ tag }}</text
              >
            </view>
          </view>
          <text class="product-desc">{{ item.desc }}</text>
          <view class="product-meta">
            <view class="meta-left">
              <text class="product-price">¥{{ item.price }}</text>
              <text class="product-rate">费率: {{ item.rate }}</text>
            </view>
            <text class="product-sales">销量: {{ item.sales }}+</text>
          </view>
          <view class="product-bottom">
            <text class="product-deposit">押金: {{ item.deposit }}元</text>
            <button class="apply-btn" @click.stop="goToApply(item)">
              立即申请
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 无数据提示 -->
    <view class="empty-tip" v-if="productList.length === 0">
      <image
        src="https://cdn-icons-png.flaticon.com/128/7486/7486754.png"
        mode="aspectFit"
      ></image>
      <text>暂无相关产品</text>
      <text class="empty-subtitle">换个筛选条件试试</text>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="productList.length > 0">
      <text v-if="hasMore">正在加载更多...</text>
      <text v-else>没有更多产品了</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        {
          name: "全部",
          icon: "https://cdn-icons-png.flaticon.com/128/3575/3575992.png",
        },
        {
          name: "传统POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2331/2331717.png",
        },
        {
          name: "智能POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2038/2038792.png",
        },
        {
          name: "移动POS",
          icon: "https://cdn-icons-png.flaticon.com/128/2496/2496153.png",
        },
        {
          name: "刷卡机",
          icon: "https://cdn-icons-png.flaticon.com/128/6475/6475714.png",
        },
      ],
      currentCategory: "全部",
      currentSort: "default",
      priceSortAsc: false,
      showFilter: false,
      priceRanges: [
        { label: "全部", min: 0, max: 99999 },
        { label: "0-500元", min: 0, max: 500 },
        { label: "500-1000元", min: 500, max: 1000 },
        { label: "1000-2000元", min: 1000, max: 2000 },
        { label: "2000元以上", min: 2000, max: 99999 },
      ],
      selectedPriceRange: 0,
      paymentMethods: ["扫码支付", "刷卡支付", "NFC支付", "人脸支付"],
      selectedPaymentMethods: [],
      productList: [],
      hasMore: true,
      page: 1,
      pageSize: 10,
    };
  },
  onLoad(options) {
    // 如果有分类参数，则设置当前分类
    if (options.category) {
      this.currentCategory = options.category;
    }

    if (options.categoryName) {
      this.currentCategory = options.categoryName;
    }

    // 加载产品数据
    this.loadProducts();
  },
  onReachBottom() {
    if (this.hasMore) {
      this.page++;
      this.loadMoreProducts();
    }
  },
  methods: {
    // 跳转到搜索页
    goToSearch() {
      uni.navigateTo({
        url: "/pages/search/index",
      });
    },

    // 切换分类
    changeCategory(category) {
      this.currentCategory = category;
      this.page = 1;
      this.hasMore = true;
      // 重新加载该分类下的产品
      this.loadProducts();
    },

    // 切换排序方式
    changeSort(sortType) {
      if (this.currentSort === sortType) {
        if (sortType === "price") {
          this.priceSortAsc = !this.priceSortAsc;
        }
      } else {
        this.currentSort = sortType;
        if (sortType === "price") {
          this.priceSortAsc = true;
        }
      }
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },

    // 选择价格区间
    selectPriceRange(index) {
      this.selectedPriceRange = index;
    },

    // 切换支付方式选择
    togglePaymentMethod(method) {
      const index = this.selectedPaymentMethods.indexOf(method);
      if (index > -1) {
        this.selectedPaymentMethods.splice(index, 1);
      } else {
        this.selectedPaymentMethods.push(method);
      }
    },

    // 重置筛选条件
    resetFilter() {
      this.selectedPriceRange = 0;
      this.selectedPaymentMethods = [];
    },

    // 应用筛选条件
    applyFilter() {
      this.showFilter = false;
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },

    // 加载产品数据
    loadProducts() {
      // 实际项目中应从服务器加载数据
      console.log("加载分类:", this.currentCategory, "排序:", this.currentSort);

      // 模拟数据加载
      uni.showLoading({
        title: "加载中...",
      });

      setTimeout(() => {
        // 模拟产品数据
        this.productList = [
          {
            id: 1,
            name: "智能POS机A1 Pro",
            desc: "支持扫码/刷卡/NFC，大屏显示，性能稳定",
            image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
            price: "1580",
            rate: "0.38%",
            deposit: 99,
            sales: 2386,
            tags: ["热销", "新品"],
          },
          {
            id: 2,
            name: "移动POS机B2 Plus",
            desc: "便携式，支持4G网络，续航持久",
            image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png",
            price: "980",
            rate: "0.55%",
            deposit: 199,
            sales: 1658,
            tags: ["便携", "4G"],
          },
          {
            id: 3,
            name: "多功能收款机C3",
            desc: "触摸屏操作，支持打印小票，高速结算",
            image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png",
            price: "2680",
            rate: "0.35%",
            deposit: 299,
            sales: 986,
            tags: ["多功能", "打印"],
          },
          {
            id: 4,
            name: "商用收银一体机D5",
            desc: "集成收银系统，大屏触控，多种外设接口",
            image: "https://cdn-icons-png.flaticon.com/128/2897/2897780.png",
            price: "3999",
            rate: "0.32%",
            deposit: 499,
            sales: 568,
            tags: ["商用", "收银"],
          },
          {
            id: 5,
            name: "迷你POS机E1 Mini",
            desc: "小巧便携，蓝牙连接，即插即用",
            image: "https://cdn-icons-png.flaticon.com/128/4361/4361331.png",
            price: "499",
            rate: "0.65%",
            deposit: 99,
            sales: 3752,
            tags: ["迷你", "便携"],
          },
        ];

        uni.hideLoading();
      }, 500);
    },

    // 加载更多产品
    loadMoreProducts() {
      if (!this.hasMore) return;

      // 模拟加载更多
      uni.showLoading({
        title: "加载更多...",
      });

      setTimeout(() => {
        // 模拟没有更多数据
        this.hasMore = false;
        uni.hideLoading();
      }, 500);
    },

    // 跳转到产品详情
    goToDetail(item) {
      uni.navigateTo({
        url: "/pages/product/detail?id=" + item.id,
      });
    },

    // 跳转到申请页面
    goToApply(item) {
      uni.navigateTo({
        url: "/pages/apply/index?id=" + item.id,
      });
    },
  },
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.product-list-container {
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

/* 分类导航样式 */
.filter-section {
  background-color: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1rpx solid #f0f0f0;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 10rpx 20rpx;
  margin-right: 20rpx;
  font-size: 24rpx;
  text-align: center;
}

.category-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
  display: block;
}

.category-item.active {
  color: #1296db;
  position: relative;
}

.category-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}

/* 筛选工具栏 */
.filter-toolbar {
  display: flex;
  background-color: #fff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.filter-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26rpx;
  color: #666;
  position: relative;
}

.filter-item.active {
  color: #1296db;
  font-weight: bold;
}

.sort-icon {
  margin-left: 4rpx;
}

.icon-filter {
  margin-left: 6rpx;
  font-size: 24rpx;
}

/* 筛选面板 */
.filter-panel {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.filter-group {
  margin-bottom: 30rpx;
}

.filter-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.price-range {
  display: flex;
  flex-wrap: wrap;
}

.price-item {
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 6rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
}

.price-item.active {
  background-color: #e6f7ff;
  color: #1296db;
  border: 1rpx solid #1296db;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
}

.tag-item {
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 6rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
}

.tag-item.active {
  background-color: #e6f7ff;
  color: #1296db;
  border: 1rpx solid #1296db;
}

.filter-buttons {
  display: flex;
  justify-content: space-between;
  padding-top: 20rpx;
}

.reset-btn,
.confirm-btn {
  width: 45%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #1296db;
  color: #fff;
}

/* 产品列表样式 */
.product-list {
  padding: 20rpx;
}

.product-item {
  display: flex;
  padding: 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 10rpx;
}

.product-name {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10rpx;
}

.tag-item {
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
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.meta-left {
  display: flex;
  flex-direction: column;
}

.product-price {
  font-size: 32rpx;
  color: #ff6b00;
  font-weight: bold;
  margin-bottom: 4rpx;
}

.product-rate,
.product-deposit {
  font-size: 24rpx;
  color: #999;
}

.product-sales {
  font-size: 24rpx;
  color: #999;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.apply-btn {
  background-color: #1296db;
  color: #fff;
  font-size: 26rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  margin: 0;
}

/* 空状态样式 */
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-tip image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-tip text {
  color: #999;
  font-size: 28rpx;
}

.empty-subtitle {
  font-size: 24rpx;
  color: #bbb;
  margin-top: 10rpx;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 24rpx;
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

.icon-filter:before {
  content: "\e6ac";
}
</style>
