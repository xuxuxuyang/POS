<template>
  <view class="product-detail-container">
    <!-- 产品图片展示 -->
    <swiper class="product-swiper" circular indicator-dots autoplay>
      <swiper-item v-for="(item, index) in productImages" :key="index">
        <image :src="item" mode="aspectFill" class="swiper-image"></image>
      </swiper-item>
    </swiper>
    <!-- 产品基本信息 -->
    <view class="product-info">
      <view class="product-header">
        <text class="product-name">{{ product.name }}</text>
        <view class="product-tags">
          <text
            class="tag-item"
            v-for="(tag, index) in product.tags"
            :key="index"
            >{{ tag }}</text
          >
        </view>
      </view>
      <view class="product-price-info">
        <text class="product-price">¥{{ product.price }}</text>
        <text class="product-sales">销量: {{ product.sales }}+</text>
      </view>
      <view class="product-meta">
        <text class="meta-item">费率: {{ product.rate }}</text>
        <text class="meta-item">押金: {{ product.deposit }}元</text>
        <text class="meta-item">货期: {{ product.deliveryTime }}</text>
      </view>
      <view class="product-desc">{{ product.desc }}</view>
    </view>

    <!-- 商家承诺 -->
    <view class="service-section">
      <view class="section-title">
        <text>商家承诺</text>
      </view>
      <view class="service-list">
        <view
          class="service-item"
          v-for="(item, index) in servicePromises"
          :key="index"
        >
          <text class="iconfont" :class="item.icon"></text>
          <text class="service-text">{{ item.text }}</text>
        </view>
      </view>
    </view>

    <!-- 规格选择 -->
    <view class="specs-section">
      <view class="section-title">
        <text>规格选择</text>
      </view>
      <view class="specs-content">
        <view class="specs-item" @click="showSpecsPopup = true">
          <text class="specs-label">版本</text>
          <view class="specs-value">
            <text>{{ selectedSpecs.version || "请选择" }}</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
        <view class="specs-item" @click="showSpecsPopup = true">
          <text class="specs-label">颜色</text>
          <view class="specs-value">
            <text>{{ selectedSpecs.color || "请选择" }}</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
        <view class="specs-item" @click="showSpecsPopup = true">
          <text class="specs-label">套餐</text>
          <view class="specs-value">
            <text>{{ selectedSpecs.package || "请选择" }}</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 产品参数详情 -->
    <view class="product-params">
      <view class="section-title">
        <text>产品参数</text>
        <text class="show-all" @click="showAllParams = !showAllParams">
          {{ showAllParams ? "收起" : "查看全部" }}
        </text>
      </view>
      <view
        class="params-list"
        :class="{ 'params-list-expanded': showAllParams }"
      >
        <view
          class="params-item"
          v-for="(value, key, index) in product.params"
          :key="key"
          v-show="showAllParams || index < 5"
        >
          <text class="params-label">{{ key }}</text>
          <text class="params-value">{{ value }}</text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="product-detail-section">
      <view class="section-title">
        <text>商品详情</text>
      </view>
      <view class="detail-content">
        <rich-text :nodes="product.detailHtml"></rich-text>
      </view>
    </view>

    <!-- 相关推荐 -->
    <view class="related-section" v-if="relatedProducts.length > 0">
      <view class="section-title">
        <text>相关推荐</text>
      </view>
      <scroll-view scroll-x class="related-scroll">
        <view
          class="related-item"
          v-for="(item, index) in relatedProducts"
          :key="index"
          @click="goToProductDetail(item)"
        >
          <image
            :src="item.image"
            mode="aspectFill"
            class="related-image"
          ></image>
          <text class="related-name">{{ item.name }}</text>
          <text class="related-price">¥{{ item.price }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 规格选择弹出层 -->
    <view class="specs-popup" v-if="showSpecsPopup">
      <view class="specs-popup-mask" @click="showSpecsPopup = false"></view>
      <view class="specs-popup-content">
        <view class="specs-popup-header">
          <image
            :src="product.image"
            mode="aspectFill"
            class="specs-popup-image"
          ></image>
          <view class="specs-popup-info">
            <text class="specs-popup-price">¥{{ product.price }}</text>
            <text class="specs-popup-stock">库存: {{ product.stock }}件</text>
            <text class="specs-popup-selected"
              >已选: {{ getSelectedSpecsText() }}</text
            >
          </view>
          <text class="specs-popup-close" @click="showSpecsPopup = false"
            >×</text
          >
        </view>
        <view class="specs-popup-body">
          <view class="specs-group">
            <view class="specs-group-title">版本</view>
            <view class="specs-options">
              <text
                class="specs-option"
                v-for="item in specsOptions.versions"
                :key="item"
                :class="{
                  'specs-option-active': selectedSpecs.version === item,
                }"
                @click="selectSpecs('version', item)"
                >{{ item }}</text
              >
            </view>
          </view>
          <view class="specs-group">
            <view class="specs-group-title">颜色</view>
            <view class="specs-options">
              <text
                class="specs-option"
                v-for="item in specsOptions.colors"
                :key="item"
                :class="{ 'specs-option-active': selectedSpecs.color === item }"
                @click="selectSpecs('color', item)"
                >{{ item }}</text
              >
            </view>
          </view>
          <view class="specs-group">
            <view class="specs-group-title">套餐</view>
            <view class="specs-options">
              <text
                class="specs-option"
                v-for="item in specsOptions.packages"
                :key="item"
                :class="{
                  'specs-option-active': selectedSpecs.package === item,
                }"
                @click="selectSpecs('package', item)"
                >{{ item }}</text
              >
            </view>
          </view>
          <view class="specs-quantity">
            <text class="specs-quantity-label">数量</text>
            <view class="quantity-control">
              <text class="quantity-btn" @click="decreaseQuantity">-</text>
              <input type="number" class="quantity-input" v-model="quantity" />
              <text class="quantity-btn" @click="increaseQuantity">+</text>
            </view>
          </view>
        </view>
        <view class="specs-popup-footer">
          <button class="specs-popup-btn confirm-btn" @click="confirmSpecs">
            确定
          </button>
        </view>
      </view>
    </view>

    <!-- 底部固定操作栏 -->
    <view class="action-bar">
      <view class="action-icons">
        <view class="action-icon-item" @click="goToHome">
          <text class="iconfont icon-home"></text>
          <text class="icon-text">首页</text>
        </view>
        <view class="action-icon-item" @click="contactService">
          <text class="iconfont icon-service"></text>
          <text class="icon-text">客服</text>
        </view>
        <view class="action-icon-item" @click="toggleFavorite">
          <text
            class="iconfont"
            :class="isFavorite ? 'icon-favorite-filled' : 'icon-favorite'"
          ></text>
          <text class="icon-text">收藏</text>
        </view>
      </view>
      <view class="action-buttons">
        <button class="action-btn consult" @click="showSpecsPopup = true">
          加入购物车
        </button>
        <button class="action-btn apply" @click="goToApply">立即申请</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      productId: null,
      productImages: [],
      product: {},
      showAllParams: false,
      isFavorite: false,
      showSpecsPopup: false,
      quantity: 1,
      selectedSpecs: {
        version: "",
        color: "",
        package: "",
      },
      specsOptions: {
        versions: ["标准版", "高级版", "企业版"],
        colors: ["白色", "黑色", "灰色"],
        packages: ["基础套餐", "标准套餐", "豪华套餐"],
      },
      servicePromises: [
        { icon: "icon-quality", text: "正品保证" },
        { icon: "icon-delivery", text: "全国包邮" },
        { icon: "icon-support", text: "7天包换" },
        { icon: "icon-warranty", text: "一年保修" },
      ],
      relatedProducts: [],
    };
  },
  onLoad(options) {
    // 获取产品ID
    if (options.id) {
      this.productId = options.id;
      this.loadProductDetail();
    }
  },
  onShareAppMessage() {
    return {
      title: this.product.name,
      path: "/pages/product/detail?id=" + this.productId,
      imageUrl: this.product.image,
    };
  },
  methods: {
    // 加载产品详情
    loadProductDetail() {
      // 显示加载提示
      uni.showLoading({
        title: "加载中...",
      });

      // 模拟数据，实际项目中应从服务器获取
      setTimeout(() => {
        this.productImages = [
          "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
          "https://cdn-icons-png.flaticon.com/128/2332/2332039.png",
          "https://cdn-icons-png.flaticon.com/128/1546/1546406.png",
        ];

        this.product = {
          id: this.productId,
          name: "智能POS机A1 Pro",
          desc: "支持扫码/刷卡/NFC，支持多种支付方式，性能稳定可靠，适用于各类商户",
          image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
          price: "1580",
          rate: "0.38%",
          deposit: 99,
          sales: 2386,
          stock: 999,
          deliveryTime: "7天内发货",
          tags: ["热销", "新品", "包邮"],
          params: {
            产品型号: "A1-Pro",
            处理器: "四核1.5GHz",
            内存: "1GB",
            存储: "8GB",
            屏幕: "5.5英寸触摸屏",
            电池: "2500mAh",
            通讯: "4G/WiFi/蓝牙",
            尺寸: "145×78×18mm",
            重量: "350g",
            系统: "Android 8.1",
            支付方式: "扫码/刷卡/NFC",
            接口: "USB/TypeC/HDMI",
            打印: "内置热敏打印机",
            摄像头: "500万像素",
            扫码: "支持一维码/二维码",
            认证: "银联/PCI",
          },
          detailHtml:
            '<div style="padding:20px;"><h3 style="color:#333;font-size:16px;margin-bottom:15px;">产品介绍</h3><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:15px;">智能POS机A1 Pro是一款集收款、会员管理、营销推广于一体的智能支付终端，满足各类商户的收银需求。支持扫码支付、刷卡支付、NFC支付等多种支付方式，高性能处理器和大容量电池保证全天候稳定工作。</p><img src="https://cdn-icons-png.flaticon.com/128/2332/2332039.png" style="width:100%;margin:15px 0;"><h3 style="color:#333;font-size:16px;margin:15px 0;">功能特点</h3><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">1. 多种支付：支持扫码、刷卡、NFC等多种支付方式</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">2. 快速结算：高性能处理器，秒级完成交易</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">3. 内置打印：热敏打印，无需外接打印机</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">4. 会员管理：支持会员卡、积分、优惠券等功能</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">5. 营销推广：支持多种营销活动设置</p><img src="https://cdn-icons-png.flaticon.com/128/1546/1546406.png" style="width:100%;margin:15px 0;"></div>',
        };

        // 加载相关推荐
        this.loadRelatedProducts();

        uni.hideLoading();
      }, 500);
    },

    // 加载相关推荐产品
    loadRelatedProducts() {
      this.relatedProducts = [
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
        {
          id: 4,
          name: "商用收银一体机D5",
          price: "3999",
          image: "https://cdn-icons-png.flaticon.com/128/2897/2897780.png",
        },
      ];
    },

    // 跳转到产品详情
    goToProductDetail(product) {
      uni.navigateTo({
        url: "/pages/product/detail?id=" + product.id,
      });
    },

    // 跳转到首页
    goToHome() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },

    // 跳转到申请页面
    goToApply() {
      // 检查是否已选择规格
      if (!this.isSpecsSelected() && this.specsOptions.versions.length > 0) {
        uni.showToast({
          title: "请选择规格",
          icon: "none",
        });
        this.showSpecsPopup = true;
        return;
      }

      uni.navigateTo({
        url:
          "/pages/apply/index?id=" +
          this.productId +
          this.getSpecsQueryString(),
      });
    },

    // 联系客服
    contactService() {
      // 实际项目中可以接入微信客服
      uni.showToast({
        title: "正在接入客服...",
        icon: "none",
      });
    },

    // 收藏切换
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      uni.showToast({
        title: this.isFavorite ? "收藏成功" : "已取消收藏",
        icon: "success",
      });
    },

    // 数量增加
    increaseQuantity() {
      if (this.quantity < 99) {
        this.quantity++;
      }
    },

    // 数量减少
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    // 选择规格
    selectSpecs(type, value) {
      this.selectedSpecs[type] = value;
    },

    // 确认规格
    confirmSpecs() {
      if (!this.isSpecsSelected()) {
        uni.showToast({
          title: "请选择完整规格",
          icon: "none",
        });
        return;
      }

      this.showSpecsPopup = false;
      uni.showToast({
        title: "已选择: " + this.getSelectedSpecsText(),
        icon: "success",
      });
    },

    // 检查是否已选择规格
    isSpecsSelected() {
      // 如果没有规格选项，则认为已选择
      if (this.specsOptions.versions.length === 0) {
        return true;
      }

      return (
        this.selectedSpecs.version &&
        this.selectedSpecs.color &&
        this.selectedSpecs.package
      );
    },

    // 获取已选规格文本
    getSelectedSpecsText() {
      if (!this.isSpecsSelected()) {
        return "请选择完整规格";
      }

      return `${this.selectedSpecs.version} ${this.selectedSpecs.color} ${this.selectedSpecs.package}`;
    },

    // 获取规格查询字符串
    getSpecsQueryString() {
      if (!this.isSpecsSelected()) {
        return "";
      }

      return `&version=${encodeURIComponent(
        this.selectedSpecs.version
      )}&color=${encodeURIComponent(
        this.selectedSpecs.color
      )}&package=${encodeURIComponent(this.selectedSpecs.package)}&quantity=${
        this.quantity
      }`;
    },
  },
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.product-detail-container {
  padding-bottom: 100rpx; /* 为底部操作栏留出空间 */
}

/* 产品轮播图样式 */
.product-swiper {
  width: 100%;
  height: 750rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

/* 基本信息样式 */
.product-info {
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.product-header {
  margin-bottom: 20rpx;
}

.product-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  display: block;
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

.product-price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.product-price {
  font-size: 40rpx;
  color: #ff6b00;
  font-weight: bold;
}

.product-sales {
  font-size: 24rpx;
  color: #999;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #666;
  margin-right: 30rpx;
  margin-bottom: 10rpx;
}

.product-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 商家承诺样式 */
.service-section {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  border-bottom: 1px solid #f5f5f5;
}

.show-all {
  font-size: 24rpx;
  color: #1296db;
  font-weight: normal;
}

.service-list {
  display: flex;
  padding: 20rpx 30rpx;
  flex-wrap: wrap;
}

.service-item {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
  margin-bottom: 10rpx;
}

.service-item .iconfont {
  color: #1296db;
  margin-right: 10rpx;
  font-size: 24rpx;
}

.service-text {
  font-size: 24rpx;
  color: #666;
}

/* 规格选择样式 */
.specs-section {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.specs-content {
  padding: 0 30rpx;
}

.specs-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.specs-item:last-child {
  border-bottom: none;
}

.specs-label {
  font-size: 28rpx;
  color: #333;
}

.specs-value {
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.icon-right {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: #999;
}

/* 产品参数样式 */
.product-params {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.params-list {
  padding: 0 30rpx;
  max-height: 400rpx;
  overflow: hidden;
  transition: max-height 0.3s;
}

.params-list-expanded {
  max-height: 2000rpx;
}

.params-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.params-item:last-child {
  border-bottom: none;
}

.params-label {
  color: #666;
  font-size: 28rpx;
}

.params-value {
  color: #333;
  font-size: 28rpx;
  max-width: 60%;
  text-align: right;
}

/* 商品详情样式 */
.product-detail-section {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.detail-content {
  padding: 20rpx 0;
}

/* 相关推荐样式 */
.related-section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding-bottom: 30rpx;
}

.related-scroll {
  white-space: nowrap;
  padding: 20rpx 30rpx;
}

.related-item {
  display: inline-block;
  width: 200rpx;
  margin-right: 20rpx;
}

.related-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.related-name {
  font-size: 24rpx;
  color: #333;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 72rpx;
  margin-bottom: 10rpx;
}

.related-price {
  font-size: 28rpx;
  color: #ff6b00;
  font-weight: bold;
}

/* 规格选择弹出层样式 */
.specs-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.specs-popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.specs-popup-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  overflow-y: auto;
}

.specs-popup-header {
  display: flex;
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.specs-popup-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.specs-popup-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.specs-popup-price {
  font-size: 36rpx;
  color: #ff6b00;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.specs-popup-stock,
.specs-popup-selected {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.specs-popup-close {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #999;
  font-size: 28rpx;
}

.specs-popup-body {
  padding: 30rpx;
}

.specs-group {
  margin-bottom: 30rpx;
}

.specs-group-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.specs-options {
  display: flex;
  flex-wrap: wrap;
}

.specs-option {
  padding: 10rpx 30rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: #333;
}

.specs-option-active {
  background-color: #e6f7ff;
  color: #1296db;
  border: 1px solid #1296db;
}

.specs-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.specs-quantity-label {
  font-size: 28rpx;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background-color: #f5f5f5;
  color: #333;
  font-size: 28rpx;
}

.quantity-input {
  width: 80rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  margin: 0 2rpx;
  background-color: #f5f5f5;
}

.specs-popup-footer {
  padding: 30rpx;
  border-top: 1px solid #f5f5f5;
}

.specs-popup-btn {
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  margin: 0;
}

.confirm-btn {
  background-color: #1296db;
  color: #fff;
}

/* 底部操作栏样式 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  border-top: 1px solid #f5f5f5;
  z-index: 100;
}

.action-icons {
  display: flex;
  width: 40%;
}

.action-icon-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-icon-item .iconfont {
  font-size: 40rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.icon-text {
  font-size: 20rpx;
  color: #666;
}

.action-buttons {
  display: flex;
  width: 60%;
}

.action-btn {
  flex: 1;
  height: 100rpx;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  border-radius: 0;
}

.action-btn.consult {
  background-color: #ffb03f;
  color: #fff;
}

.action-btn.apply {
  background-color: #1296db;
  color: #fff;
}

/* 图标样式 */
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

.icon-home:before {
  content: "\e6b8";
}

.icon-service:before {
  content: "\e61e";
}

.icon-favorite:before {
  content: "\e611";
}

.icon-favorite-filled:before {
  content: "\e639";
}

.icon-right:before {
  content: "\e7eb";
}

.icon-quality:before {
  content: "\e698";
}

.icon-delivery:before {
  content: "\e640";
}

.icon-support:before {
  content: "\e635";
}

.icon-warranty:before {
  content: "\e61c";
}
</style>
