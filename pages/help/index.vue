<template>
  <view class="help-container">
    <view class="search-bar">
      <view class="search-input-wrap">
        <image
          src="https://cdn-icons-png.flaticon.com/128/149/149852.png"
          class="search-icon"
        ></image>
        <input
          type="text"
          class="search-input"
          placeholder="搜索问题"
          v-model="searchKey"
          confirm-type="search"
          @confirm="searchQuestions"
        />
        <view class="clear-btn" v-if="searchKey" @click="clearSearch">×</view>
      </view>
    </view>

    <view class="category-tabs">
      <view
        class="category-tab"
        v-for="(item, index) in categories"
        :key="index"
        :class="{ active: currentCategory === item.id }"
        @click="selectCategory(item.id)"
      >
        {{ item.name }}
      </view>
    </view>

    <view class="faq-list">
      <block v-if="filteredFaqs.length > 0">
        <view
          class="faq-item"
          v-for="(item, index) in filteredFaqs"
          :key="index"
          @click="toggleFaq(index)"
        >
          <view class="faq-header">
            <view class="faq-tag" v-if="item.tag">{{ item.tag }}</view>
            <view class="faq-question">{{ item.question }}</view>
            <view class="arrow-icon" :class="{ expanded: item.expanded }">
              <image
                src="https://cdn-icons-png.flaticon.com/128/32/32195.png"
              ></image>
            </view>
          </view>
          <view class="faq-answer" v-if="item.expanded">
            <rich-text :nodes="item.answer"></rich-text>
          </view>
        </view>
      </block>

      <view v-else class="empty-state">
        <image
          src="https://cdn-icons-png.flaticon.com/128/7486/7486754.png"
          class="empty-icon"
        ></image>
        <text class="empty-text">暂无相关问题</text>
      </view>
    </view>

    <view class="more-help">
      <view class="more-help-title">没有找到您需要的答案？</view>
      <view class="help-buttons">
        <view class="help-btn" @click="contactService">
          <image
            src="https://cdn-icons-png.flaticon.com/128/1184/1184497.png"
            class="help-btn-icon"
          ></image>
          <text class="help-btn-text">联系客服</text>
        </view>
        <view class="help-btn" @click="submitFeedback">
          <image
            src="https://cdn-icons-png.flaticon.com/128/2521/2521826.png"
            class="help-btn-icon"
          ></image>
          <text class="help-btn-text">意见反馈</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKey: "",
      currentCategory: "all",
      categories: [
        { id: "all", name: "全部" },
        { id: "product", name: "产品" },
        { id: "order", name: "订单" },
        { id: "payment", name: "支付" },
        { id: "service", name: "售后" },
      ],
      faqs: [
        {
          id: 1,
          category: "product",
          tag: "热门",
          question: "如何选择合适的POS机型号？",
          answer:
            "选择POS机需要考虑以下因素：<br>1. 业务类型：不同行业需要不同类型的POS机<br>2. 交易量：大交易量需要更稳定的设备<br>3. 功能需求：是否需要打印小票、扫码支付等<br>4. 移动需求：是否需要便携式POS机<br><br>建议您联系客服，我们会根据您的具体需求推荐合适的机型。",
          expanded: false,
        },
        {
          id: 2,
          category: "order",
          question: "下单后多久能收到POS机？",
          answer:
            "正常情况下，订单审核通过后1-3个工作日内发货，快递送达时间一般为1-3天，总计2-6个工作日可收到。<br><br>特殊地区可能需要更长时间，您可以在订单页面实时查看物流状态。",
          expanded: false,
        },
        {
          id: 3,
          category: "payment",
          question: "支持哪些付款方式？",
          answer:
            "目前支持以下付款方式：<br>1. 微信支付<br>2. 支付宝<br>3. 银行卡支付<br>4. 货到付款（部分地区）<br><br>押金支付也支持分期付款，可在结算页面选择。",
          expanded: false,
        },
        {
          id: 4,
          category: "service",
          question: "POS机出现故障怎么办？",
          answer:
            '如果您的POS机出现故障，可以：<br>1. 查看<a href="/pages/guide/index">使用教程</a>中的常见问题解决方案<br>2. 联系客服热线：400-123-4567<br>3. 提交<a href="/pages/service/repair">维修申请</a><br><br>我们会在24小时内响应您的维修需求。',
          expanded: false,
        },
        {
          id: 5,
          category: "product",
          question: "POS机支持哪些支付方式？",
          answer:
            "我们的POS机支持以下支付方式：<br>1. 银联刷卡<br>2. 微信扫码支付<br>3. 支付宝扫码支付<br>4. 云闪付<br>5. NFC非接触式支付（部分机型）<br><br>具体支持的支付方式以您选购的机型为准。",
          expanded: false,
        },
        {
          id: 6,
          category: "payment",
          question: "押金可以退还吗？",
          answer:
            "是的，押金可以退还。<br><br>在设备正常归还且无损坏的情况下，押金将在确认设备状态后的7个工作日内退还到您的原支付账户。<br><br>如有特殊情况，请联系客服处理。",
          expanded: false,
        },
        {
          id: 7,
          category: "order",
          question: "如何取消订单？",
          answer:
            '您可以在订单状态为"待审核"时取消订单：<br>1. 进入"我的"-"全部订单"<br>2. 找到需要取消的订单<br>3. 点击"取消订单"按钮<br><br>如订单已审核通过，请联系客服协助取消。',
          expanded: false,
        },
        {
          id: 8,
          category: "service",
          tag: "重要",
          question: "如何激活新POS机？",
          answer:
            '收到POS机后，请按以下步骤激活：<br>1. 登录小程序<br>2. 进入"我的服务"-"激活POS机"<br>3. 扫描机器背面的二维码或输入SN号<br>4. 按照页面提示完成激活流程<br><br>激活过程中如遇问题，可联系客服协助。',
          expanded: false,
        },
      ],
    };
  },
  computed: {
    filteredFaqs() {
      // 根据搜索关键词和分类筛选FAQ
      return this.faqs.filter((item) => {
        // 分类筛选
        const categoryMatch =
          this.currentCategory === "all" ||
          item.category === this.currentCategory;

        // 关键词搜索
        const searchMatch =
          !this.searchKey ||
          item.question.toLowerCase().includes(this.searchKey.toLowerCase()) ||
          item.answer.toLowerCase().includes(this.searchKey.toLowerCase());

        return categoryMatch && searchMatch;
      });
    },
  },
  methods: {
    // 选择分类
    selectCategory(categoryId) {
      this.currentCategory = categoryId;
    },

    // 展开/折叠FAQ
    toggleFaq(index) {
      const faq = this.filteredFaqs[index];
      // 找到原始数组中的索引
      const originalIndex = this.faqs.findIndex((item) => item.id === faq.id);
      if (originalIndex !== -1) {
        this.$set(
          this.faqs[originalIndex],
          "expanded",
          !this.faqs[originalIndex].expanded
        );
      }
    },

    // 搜索问题
    searchQuestions() {
      console.log("搜索:", this.searchKey);
      // 搜索已经通过计算属性filteredFaqs实现
    },

    // 清空搜索
    clearSearch() {
      this.searchKey = "";
    },

    // 联系客服
    contactService() {
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

    // 提交反馈
    submitFeedback() {
      uni.navigateTo({
        url: "/pages/help/feedback",
      });
    },
  },
};
</script>

<style>
.help-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 40rpx;
}

.search-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 20rpx;
  position: relative;
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  height: 70rpx;
  font-size: 28rpx;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 32rpx;
}

.category-tabs {
  display: flex;
  background-color: #fff;
  padding: 0 20rpx;
  border-bottom: 1px solid #f1f1f1;
  overflow-x: scroll;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  white-space: nowrap;
  position: relative;
}

.category-tab.active {
  color: #1296db;
  font-weight: bold;
}

.category-tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}

.faq-list {
  margin-top: 20rpx;
  padding-bottom: 20rpx;
}

.faq-item {
  margin: 0 20rpx 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.faq-header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  position: relative;
}

.faq-tag {
  background-color: #ff5252;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}

.faq-question {
  flex: 1;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  padding-right: 50rpx;
}

.arrow-icon {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  width: 32rpx;
  height: 32rpx;
  transition: transform 0.3s;
}

.arrow-icon.expanded {
  transform: rotate(180deg);
}

.arrow-icon image {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.faq-answer {
  padding: 0 30rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  border-top: 1px solid #f5f5f5;
  margin-top: -10rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.more-help {
  margin: 40rpx 30rpx 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.more-help-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
}

.help-buttons {
  display: flex;
  justify-content: space-around;
}

.help-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.help-btn-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.help-btn-text {
  font-size: 26rpx;
  color: #666;
}
</style>
