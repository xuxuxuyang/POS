<template>
  <view class="guide-container">
    <!-- 页面头部 -->
    <view class="header-section">
      <view class="search-box">
        <image
          src="https://cdn-icons-png.flaticon.com/128/751/751463.png"
          class="search-icon"
        ></image>
        <input
          type="text"
          v-model="searchKey"
          placeholder="搜索教程"
          confirm-type="search"
          @confirm="searchGuides"
          class="search-input"
        />
        <view class="search-btn" @click="searchGuides">搜索</view>
      </view>
    </view>

    <!-- 分类导航 -->
    <scroll-view scroll-x class="category-nav">
      <view
        class="category-item"
        :class="{ 'category-active': activeCategory === item.id }"
        v-for="item in categories"
        :key="item.id"
        @click="switchCategory(item.id)"
      >
        <image :src="item.icon" class="category-icon"></image>
        <text class="category-text">{{ item.name }}</text>
      </view>
    </scroll-view>

    <!-- 热门推荐 -->
    <view class="section-container" v-if="activeCategory === 'all'">
      <view class="section-header">
        <text class="section-title">热门推荐</text>
      </view>
      <view class="hot-list">
        <view
          class="hot-item"
          v-for="(item, index) in hotGuides"
          :key="index"
          @click="viewGuide(item)"
        >
          <image :src="item.cover" class="hot-image" mode="aspectFill"></image>
          <view class="hot-content">
            <view class="hot-title">{{ item.title }}</view>
            <view class="hot-info">
              <text class="hot-views">{{ item.views }}人学习</text>
              <text class="hot-tag" v-if="item.isNew">New</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 教程列表 -->
    <view class="section-container">
      <view class="section-header">
        <text class="section-title">{{ getCurrentCategoryName() }}</text>
        <text
          class="section-more"
          v-if="activeCategory === 'all'"
          @click="switchCategory('all')"
          >查看全部</text
        >
      </view>

      <!-- 教程列表内容 -->
      <view class="guide-list">
        <view
          class="guide-item"
          v-for="(item, index) in filteredGuides"
          :key="index"
          @click="viewGuide(item)"
        >
          <image
            :src="item.cover"
            class="guide-image"
            mode="aspectFill"
          ></image>
          <view class="guide-content">
            <view class="guide-title">{{ item.title }}</view>
            <view class="guide-desc">{{ item.description }}</view>
            <view class="guide-info">
              <view class="guide-meta">
                <text class="guide-views">{{ item.views }}人学习</text>
                <text class="guide-duration">{{ item.duration }}</text>
              </view>
              <view class="guide-tags">
                <text class="guide-tag" v-if="item.isNew">New</text>
                <text class="guide-tag tag-recommend" v-if="item.isRecommend"
                  >推荐</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 无数据提示 -->
      <view class="empty-container" v-if="filteredGuides.length === 0">
        <image
          src="https://cdn-icons-png.flaticon.com/128/8832/8832119.png"
          class="empty-icon"
        ></image>
        <view class="empty-text">暂无相关教程</view>
      </view>

      <!-- 加载更多 -->
      <view
        class="load-more"
        v-if="hasMore && filteredGuides.length > 0"
        @click="loadMore"
      >
        {{ loading ? "加载中..." : "加载更多" }}
      </view>
    </view>

    <!-- 常见问题 -->
    <view class="section-container" v-if="activeCategory === 'all'">
      <view class="section-header">
        <text class="section-title">常见问题</text>
        <text class="section-more" @click="navigateTo('/pages/help/index')"
          >更多</text
        >
      </view>
      <view class="faq-list">
        <view
          class="faq-item"
          v-for="(item, index) in faqs"
          :key="index"
          @click="viewFaq(item)"
        >
          <view class="faq-question">
            <text class="question-icon">Q</text>
            <text class="question-text">{{ item.question }}</text>
          </view>
          <image
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            class="faq-arrow"
          ></image>
        </view>
      </view>
    </view>

    <!-- 在线客服 -->
    <view class="customer-service" @click="contactCustomerService">
      <image
        src="https://cdn-icons-png.flaticon.com/128/1142/1142171.png"
        class="service-icon"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKey: "",
      activeCategory: "all",
      loading: false,
      hasMore: true,
      categories: [
        {
          id: "all",
          name: "全部",
          icon: "https://cdn-icons-png.flaticon.com/128/471/471662.png",
        },
        {
          id: "newbie",
          name: "新手入门",
          icon: "https://cdn-icons-png.flaticon.com/128/2618/2618477.png",
        },
        {
          id: "basic",
          name: "基础操作",
          icon: "https://cdn-icons-png.flaticon.com/128/1001/1001371.png",
        },
        {
          id: "advanced",
          name: "高级功能",
          icon: "https://cdn-icons-png.flaticon.com/128/9464/9464085.png",
        },
        {
          id: "payment",
          name: "收款管理",
          icon: "https://cdn-icons-png.flaticon.com/128/2331/2331941.png",
        },
        {
          id: "settlement",
          name: "结算教程",
          icon: "https://cdn-icons-png.flaticon.com/128/3310/3310624.png",
        },
        {
          id: "security",
          name: "安全指南",
          icon: "https://cdn-icons-png.flaticon.com/128/2853/2853426.png",
        },
      ],
      hotGuides: [
        {
          id: "g001",
          title: "POS机激活教程 - 快速上手",
          description: "详细讲解POS机首次激活流程及注意事项",
          cover: "https://cdn-icons-png.flaticon.com/128/7011/7011432.png",
          category: "newbie",
          views: 1245,
          duration: "5分钟",
          isNew: true,
          isRecommend: true,
        },
        {
          id: "g002",
          title: "如何处理刷卡失败问题",
          description: "解决POS机常见的刷卡失败问题及解决方法",
          cover: "https://cdn-icons-png.flaticon.com/128/2161/2161491.png",
          category: "basic",
          views: 986,
          duration: "3分钟",
          isNew: false,
          isRecommend: true,
        },
        {
          id: "g003",
          title: "商户结算周期与费率说明",
          description: "了解商户结算周期与费率计算方式",
          cover: "https://cdn-icons-png.flaticon.com/128/2965/2965267.png",
          category: "settlement",
          views: 759,
          duration: "7分钟",
          isNew: false,
          isRecommend: false,
        },
      ],
      guides: [
        {
          id: "g001",
          title: "POS机激活教程 - 快速上手",
          description: "详细讲解POS机首次激活流程及注意事项",
          cover: "https://cdn-icons-png.flaticon.com/128/7011/7011432.png",
          category: "newbie",
          views: 1245,
          duration: "5分钟",
          isNew: true,
          isRecommend: true,
        },
        {
          id: "g002",
          title: "如何处理刷卡失败问题",
          description: "解决POS机常见的刷卡失败问题及解决方法",
          cover: "https://cdn-icons-png.flaticon.com/128/2161/2161491.png",
          category: "basic",
          views: 986,
          duration: "3分钟",
          isNew: false,
          isRecommend: true,
        },
        {
          id: "g003",
          title: "商户结算周期与费率说明",
          description: "了解商户结算周期与费率计算方式",
          cover: "https://cdn-icons-png.flaticon.com/128/2965/2965267.png",
          category: "settlement",
          views: 759,
          duration: "7分钟",
          isNew: false,
          isRecommend: false,
        },
        {
          id: "g004",
          title: "POS机日常维护指南",
          description: "教您如何正确维护POS机，延长使用寿命",
          cover: "https://cdn-icons-png.flaticon.com/128/2421/2421989.png",
          category: "basic",
          views: 632,
          duration: "4分钟",
          isNew: false,
          isRecommend: false,
        },
        {
          id: "g005",
          title: "如何使用NFC非接触支付",
          description: "详解NFC非接触式支付的设置与使用方法",
          cover: "https://cdn-icons-png.flaticon.com/128/2504/2504763.png",
          category: "advanced",
          views: 487,
          duration: "3分钟",
          isNew: true,
          isRecommend: false,
        },
        {
          id: "g006",
          title: "POS机交易明细查询与导出",
          description: "学习如何查询和导出POS机交易记录",
          cover: "https://cdn-icons-png.flaticon.com/128/9464/9464989.png",
          category: "basic",
          views: 412,
          duration: "6分钟",
          isNew: false,
          isRecommend: false,
        },
        {
          id: "g007",
          title: "商户结算账户设置指南",
          description: "正确设置和管理您的结算账户",
          cover: "https://cdn-icons-png.flaticon.com/128/6731/6731626.png",
          category: "settlement",
          views: 368,
          duration: "5分钟",
          isNew: false,
          isRecommend: true,
        },
        {
          id: "g008",
          title: "POS机安全使用守则",
          description: "了解POS机安全使用的注意事项与防范措施",
          cover: "https://cdn-icons-png.flaticon.com/128/1785/1785274.png",
          category: "security",
          views: 329,
          duration: "8分钟",
          isNew: false,
          isRecommend: false,
        },
        {
          id: "g009",
          title: "如何设置商户信息",
          description: "详细指导商户信息的设置步骤与注意事项",
          cover: "https://cdn-icons-png.flaticon.com/128/686/686352.png",
          category: "newbie",
          views: 295,
          duration: "4分钟",
          isNew: false,
          isRecommend: false,
        },
        {
          id: "g010",
          title: "移动支付与扫码收款教程",
          description: "掌握移动支付和扫码收款的完整操作流程",
          cover: "https://cdn-icons-png.flaticon.com/128/2645/2645233.png",
          category: "payment",
          views: 278,
          duration: "6分钟",
          isNew: true,
          isRecommend: true,
        },
      ],
      faqs: [
        {
          id: "f001",
          question: "POS机无法连接网络怎么办？",
          answer:
            "请检查网络设置是否正确，Wi-Fi信号是否正常，或尝试重启POS机。如果问题依然存在，请联系客服。",
        },
        {
          id: "f002",
          question: "交易成功但未收到款项怎么处理？",
          answer:
            "请查看交易记录确认交易是否成功，检查结算账户信息是否正确，并联系客服提供交易凭证进行核查。",
        },
        {
          id: "f003",
          question: "POS机打印纸如何更换？",
          answer:
            "打开POS机顶部打印仓盖，取出用完的纸卷芯，装入新纸卷，保持纸面朝上，合上打印仓盖，拉出少量纸张即可。",
        },
        {
          id: "f004",
          question: "如何申请POS机退款？",
          answer:
            "在交易记录中找到需要退款的订单，点击退款操作，按照提示完成验证，系统将在1-3个工作日内处理退款。",
        },
        {
          id: "f005",
          question: "POS机电池续航时间短怎么解决？",
          answer:
            "请降低屏幕亮度，关闭不必要的功能，避免在极端温度环境使用，并定期校准电池。如问题严重，可能需要更换电池。",
        },
      ],
    };
  },
  computed: {
    // 根据当前分类和搜索关键词过滤教程
    filteredGuides() {
      let result = this.guides;

      // 按分类筛选
      if (this.activeCategory !== "all") {
        result = result.filter((item) => item.category === this.activeCategory);
      }

      // 按关键词搜索
      if (this.searchKey.trim()) {
        const key = this.searchKey.trim().toLowerCase();
        result = result.filter(
          (item) =>
            item.title.toLowerCase().includes(key) ||
            item.description.toLowerCase().includes(key)
        );
      }

      return result;
    },
  },
  onLoad() {
    // 页面加载时初始化数据
    this.loadGuideData();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.refreshData();
  },
  methods: {
    // 加载教程数据
    loadGuideData() {
      // 实际项目中应该从服务器获取数据
      // 这里使用模拟数据

      // 显示加载中
      uni.showLoading({
        title: "加载中...",
      });

      // 模拟请求延迟
      setTimeout(() => {
        uni.hideLoading();

        // 上拉加载更多时可以在这里追加数据
        // this.guides = [...this.guides, ...newGuides];

        // 更新加载状态
        this.loading = false;

        // 假设已经加载完所有数据
        this.hasMore = false;

        // 停止下拉刷新
        uni.stopPullDownRefresh();
      }, 1000);
    },

    // 刷新数据
    refreshData() {
      this.searchKey = "";
      this.activeCategory = "all";
      this.loadGuideData();
    },

    // 切换分类
    switchCategory(categoryId) {
      this.activeCategory = categoryId;
      this.searchKey = "";
      this.loadGuideData();
    },

    // 获取当前分类名称
    getCurrentCategoryName() {
      if (this.activeCategory === "all") {
        if (this.searchKey.trim()) {
          return "搜索结果";
        }
        return "全部教程";
      }

      const category = this.categories.find(
        (item) => item.id === this.activeCategory
      );
      return category ? category.name : "全部教程";
    },

    // 搜索教程
    searchGuides() {
      if (!this.searchKey.trim()) {
        this.showToast("请输入搜索关键词");
        return;
      }

      // 实际项目中应该发送请求搜索
      // 这里直接通过计算属性过滤

      // 可以根据需要切换到全部分类
      this.activeCategory = "all";

      // 隐藏键盘
      uni.hideKeyboard();
    },

    // 加载更多
    loadMore() {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.loadGuideData();
    },

    // 查看教程详情
    viewGuide(guide) {
      // 跳转到教程详情页
      uni.navigateTo({
        url: `/pages/guide/detail?id=${guide.id}`,
      });
    },

    // 查看FAQ详情
    viewFaq(faq) {
      // 跳转到FAQ详情页
      uni.navigateTo({
        url: `/pages/help/detail?id=${faq.id}&type=faq`,
      });
    },

    // 导航到指定页面
    navigateTo(url) {
      uni.navigateTo({
        url: url,
      });
    },

    // 联系客服
    contactCustomerService() {
      uni.showActionSheet({
        itemList: ["在线客服", "电话客服"],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 在线客服
            this.showToast("正在接入在线客服...");
          } else if (res.tapIndex === 1) {
            // 电话客服
            uni.makePhoneCall({
              phoneNumber: "400-123-4567",
              fail: () => {
                this.showToast("拨打失败");
              },
            });
          }
        },
      });
    },

    // 显示提示
    showToast(title) {
      uni.showToast({
        title: title,
        icon: "none",
      });
    },
  },
};
</script>

<style>
.guide-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 100rpx;
}

.header-section {
  padding: 30rpx;
  background-color: #1296db;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 40rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 15rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
}

.search-btn {
  width: 100rpx;
  height: 60rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-nav {
  white-space: nowrap;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.category-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
  padding-bottom: 10rpx;
  position: relative;
}

.category-item:last-child {
  margin-right: 0;
}

.category-active {
  color: #1296db;
}

.category-active::after {
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

.category-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.category-text {
  font-size: 24rpx;
  color: #333;
}

.section-container {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #999;
}

.hot-list {
  padding: 20rpx;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.hot-item {
  width: 300rpx;
  margin-right: 20rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.hot-image {
  width: 100%;
  height: 180rpx;
}

.hot-content {
  padding: 20rpx;
}

.hot-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  height: 78rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hot-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.hot-views {
  font-size: 24rpx;
  color: #999;
}

.hot-tag {
  font-size: 20rpx;
  color: #ff5252;
  padding: 2rpx 8rpx;
  border: 1rpx solid #ff5252;
  border-radius: 4rpx;
}

.guide-list {
  padding: 20rpx;
}

.guide-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.guide-item:last-child {
  border-bottom: none;
}

.guide-image {
  width: 180rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.guide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.guide-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 10rpx;
}

.guide-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.guide-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.guide-meta {
  display: flex;
  align-items: center;
}

.guide-views {
  font-size: 24rpx;
  color: #999;
  margin-right: 20rpx;
}

.guide-duration {
  font-size: 24rpx;
  color: #999;
}

.guide-tags {
  display: flex;
}

.guide-tag {
  font-size: 20rpx;
  color: #ff5252;
  padding: 2rpx 8rpx;
  border: 1rpx solid #ff5252;
  border-radius: 4rpx;
  margin-left: 10rpx;
}

.tag-recommend {
  color: #1296db;
  border-color: #1296db;
}

.empty-container {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.load-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #999;
}

.faq-list {
  padding: 0 20rpx;
}

.faq-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  align-items: center;
  flex: 1;
}

.question-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15rpx;
  flex-shrink: 0;
}

.question-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.faq-arrow {
  width: 30rpx;
  height: 30rpx;
}

.customer-service {
  position: fixed;
  bottom: 100rpx;
  right: 30rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #1296db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(18, 150, 219, 0.3);
  z-index: 100;
}

.service-icon {
  width: 60rpx;
  height: 60rpx;
}
</style>
