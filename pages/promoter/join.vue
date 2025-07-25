<template>
  <view class="promoter-container">
    <!-- 头部背景 -->
    <view class="header-bg">
      <image
        src="https://cdn-icons-png.flaticon.com/128/2258/2258843.png"
        mode="aspectFill"
        class="bg-image"
      ></image>
      <view class="header-title">码商加盟计划</view>
      <view class="header-subtitle">与我们一起共创未来</view>
    </view>

    <!-- 加盟优势 -->
    <view class="section advantage-section">
      <view class="section-title">加盟优势</view>
      <view class="advantage-list">
        <view
          class="advantage-item"
          v-for="(item, index) in advantages"
          :key="index"
        >
          <image :src="item.icon" class="advantage-icon"></image>
          <view class="advantage-content">
            <view class="advantage-title">{{ item.title }}</view>
            <view class="advantage-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 收益说明 -->
    <view class="section profit-section">
      <view class="section-title">收益说明</view>
      <view class="profit-card">
        <view
          class="profit-item"
          v-for="(item, index) in profitItems"
          :key="index"
        >
          <view class="profit-value">{{ item.value }}</view>
          <view class="profit-label">{{ item.label }}</view>
        </view>
      </view>
      <view class="profit-desc">
        <view
          class="desc-item"
          v-for="(item, index) in profitDesc"
          :key="index"
        >
          <text class="desc-dot">•</text>
          <text class="desc-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 加盟流程 -->
    <view class="section process-section">
      <view class="section-title">加盟流程</view>
      <view class="process-list">
        <view
          class="process-item"
          v-for="(item, index) in processList"
          :key="index"
        >
          <view class="process-num">{{ index + 1 }}</view>
          <view class="process-content">
            <view class="process-title">{{ item.title }}</view>
            <view class="process-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 常见问题 -->
    <view class="section faq-section">
      <view class="section-title">常见问题</view>
      <view class="faq-list">
        <view
          class="faq-item"
          v-for="(item, index) in faqList"
          :key="index"
          @click="toggleFaq(index)"
        >
          <view class="faq-question">
            <text>{{ item.question }}</text>
            <text class="faq-arrow" :class="{ 'faq-arrow-down': item.open }">{{
              item.open ? "▼" : "▶"
            }}</text>
          </view>
          <view class="faq-answer" v-if="item.open">{{ item.answer }}</view>
        </view>
      </view>
    </view>

    <!-- 立即申请按钮 -->
    <view class="apply-btn" @click="handleApply">立即申请加盟</view>

    <!-- 咨询客服 -->
    <view class="contact-btn" @click="contactService">联系客服咨询</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      advantages: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2258/2258843.png",
          title: "高额返佣",
          desc: "每台设备销售返佣30%，持续推广享受被动收入",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3297/3297954.png",
          title: "专业支持",
          desc: "提供全套营销物料和培训支持，无需专业知识",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/7315/7315073.png",
          title: "灵活兼职",
          desc: "时间自由，地点不限，适合全职或兼职推广",
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/5582/5582915.png",
          title: "成长空间",
          desc: "团队发展模式，可建立自己的销售团队获取更高收益",
        },
      ],
      profitItems: [
        { value: "30%", label: "直接返佣" },
        { value: "10%", label: "团队提成" },
        { value: "¥500", label: "首单奖励" },
      ],
      profitDesc: [
        "销售一台POS机直接获得30%的佣金返还",
        "发展下级推广员，可获得其销售额10%的团队提成",
        "成功销售首单即可获得额外500元新人奖励",
        "月销售额达到目标可获得额外奖金和奖品",
      ],
      processList: [
        {
          title: "提交申请",
          desc: "填写基本信息和联系方式提交加盟申请",
        },
        {
          title: "资质审核",
          desc: "系统审核个人资质，一般1-2个工作日完成",
        },
        {
          title: "签订协议",
          desc: "线上签署合作协议，明确双方权益和义务",
        },
        {
          title: "开通账号",
          desc: "获得专属推广码和后台账号，开始推广",
        },
      ],
      faqList: [
        {
          question: "需要投入多少资金才能成为码商？",
          answer:
            "成为码商无需前期投入，我们采用零门槛加盟模式。只需通过资质审核即可开始推广赚取佣金。",
          open: false,
        },
        {
          question: "佣金如何结算？",
          answer:
            "佣金每月结算一次，系统自动核算上月业绩，次月10日前打款至您的微信或银行账户。",
          open: false,
        },
        {
          question: "没有相关经验可以加盟吗？",
          answer:
            "完全可以。我们提供完整的产品培训和销售技巧指导，新手也能快速上手。同时提供营销素材和话术，帮助您轻松开展推广。",
          open: false,
        },
        {
          question: "如何提高销售业绩？",
          answer:
            "我们建议：1. 熟悉产品功能和卖点；2. 利用朋友圈和社交媒体进行宣传；3. 参加我们的线上培训；4. 与其他码商交流经验；5. 发展自己的团队提高整体收益。",
          open: false,
        },
      ],
    };
  },
  methods: {
    // 切换FAQ展开状态
    toggleFaq(index) {
      this.faqList[index].open = !this.faqList[index].open;
    },

    // 申请加盟
    handleApply() {
      // 检查是否已登录
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.showModal({
          title: "提示",
          content: "请先登录后再申请",
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

      // 跳转到申请表单页
      uni.navigateTo({
        url: "/pages/promoter/apply",
      });
    },

    // 联系客服
    contactService() {
      uni.showActionSheet({
        itemList: ["在线客服", "电话咨询"],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 在线客服
            uni.showToast({
              title: "正在接入客服...",
              icon: "none",
            });
          } else if (res.tapIndex === 1) {
            // 电话咨询
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
.promoter-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 50rpx;
}

/* 头部样式 */
.header-bg {
  height: 350rpx;
  background: linear-gradient(to right, #1296db, #14b8e4);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 0 30rpx;
  text-align: center;
}

.bg-image {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.header-title {
  font-size: 42rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 1;
}

.header-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

/* 分区样式 */
.section {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  padding-left: 20rpx;
  border-left: 6rpx solid #1296db;
}

/* 优势列表 */
.advantage-list {
}

.advantage-item {
  display: flex;
  margin-bottom: 30rpx;
}

.advantage-item:last-child {
  margin-bottom: 0;
}

.advantage-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.advantage-content {
  flex: 1;
}

.advantage-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.advantage-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 收益说明 */
.profit-card {
  display: flex;
  justify-content: space-around;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 30rpx 0;
  margin-bottom: 30rpx;
}

.profit-item {
  text-align: center;
}

.profit-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #1296db;
  margin-bottom: 10rpx;
}

.profit-label {
  font-size: 26rpx;
  color: #666;
}

.profit-desc {
}

.desc-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.desc-dot {
  margin-right: 10rpx;
  color: #1296db;
  flex-shrink: 0;
}

.desc-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 加盟流程 */
.process-list {
}

.process-item {
  display: flex;
  margin-bottom: 25rpx;
}

.process-item:last-child {
  margin-bottom: 0;
}

.process-num {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background-color: #1296db;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.process-content {
  flex: 1;
}

.process-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.process-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 常见问题 */
.faq-list {
}

.faq-item {
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
  padding-bottom: 20rpx;
}

.faq-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  padding: 10rpx 0;
}

.faq-arrow {
  font-size: 24rpx;
  color: #999;
  transition: all 0.3s;
}

.faq-arrow-down {
  transform: rotate(180deg);
}

.faq-answer {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  padding: 15rpx 0;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-top: 10rpx;
}

/* 按钮 */
.apply-btn {
  margin: 40rpx 30rpx 20rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: linear-gradient(to right, #1296db, #14b8e4);
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(18, 150, 219, 0.3);
}

.contact-btn {
  margin: 20rpx 30rpx 40rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background: #fff;
  color: #1296db;
  font-size: 32rpx;
  border-radius: 45rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
