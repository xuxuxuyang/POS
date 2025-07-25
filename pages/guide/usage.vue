<template>
  <view class="guide-container">
    <view class="guide-header">
      <image
        src="https://cdn-icons-png.flaticon.com/128/2991/2991101.png"
        mode="aspectFit"
        class="guide-icon"
      ></image>
      <text class="guide-title">POS机使用教程</text>
    </view>

    <view class="guide-tabs">
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

    <!-- 基础使用 -->
    <view class="guide-content" v-if="currentTab === 0">
      <view
        class="tutorial-item"
        v-for="(item, index) in basicTutorials"
        :key="index"
      >
        <view class="tutorial-header">
          <view class="tutorial-index">{{ index + 1 }}</view>
          <text class="tutorial-title">{{ item.title }}</text>
        </view>
        <view class="tutorial-body">
          <text class="tutorial-desc">{{ item.desc }}</text>
          <image
            v-if="item.image"
            :src="item.image"
            mode="widthFix"
            class="tutorial-image"
          ></image>
          <view
            class="tutorial-steps"
            v-if="item.steps && item.steps.length > 0"
          >
            <view
              class="step-line"
              v-for="(step, stepIndex) in item.steps"
              :key="stepIndex"
            >
              <text class="step-index">{{ stepIndex + 1 }}.</text>
              <text class="step-text">{{ step }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 高级功能 -->
    <view class="guide-content" v-if="currentTab === 1">
      <view
        class="tutorial-item"
        v-for="(item, index) in advancedTutorials"
        :key="index"
      >
        <view class="tutorial-header">
          <view class="tutorial-index">{{ index + 1 }}</view>
          <text class="tutorial-title">{{ item.title }}</text>
        </view>
        <view class="tutorial-body">
          <text class="tutorial-desc">{{ item.desc }}</text>
          <image
            v-if="item.image"
            :src="item.image"
            mode="widthFix"
            class="tutorial-image"
          ></image>
          <view
            class="tutorial-steps"
            v-if="item.steps && item.steps.length > 0"
          >
            <view
              class="step-line"
              v-for="(step, stepIndex) in item.steps"
              :key="stepIndex"
            >
              <text class="step-index">{{ stepIndex + 1 }}.</text>
              <text class="step-text">{{ step }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 故障排除 -->
    <view class="guide-content" v-if="currentTab === 2">
      <view
        class="faq-item"
        v-for="(item, index) in troubleshooting"
        :key="index"
      >
        <view class="faq-question" @click="toggleFAQ(index)">
          <text>{{ item.question }}</text>
          <text class="faq-icon">{{ item.expanded ? "−" : "+" }}</text>
        </view>
        <view class="faq-answer" v-if="item.expanded">
          <text>{{ item.answer }}</text>
        </view>
      </view>
    </view>

    <view class="contact-section">
      <text class="contact-title">需要更多帮助？</text>
      <view class="contact-buttons">
        <button class="contact-btn" @click="contactCustomerService">
          联系客服
        </button>
        <button class="contact-btn" @click="goToHelpCenter">帮助中心</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [{ name: "基础使用" }, { name: "高级功能" }, { name: "故障排除" }],
      basicTutorials: [
        {
          title: "开机与连接",
          desc: "首次使用POS机，请按照以下步骤操作：",
          image: "https://cdn-icons-png.flaticon.com/128/862/862032.png",
          steps: [
            "长按电源键3秒开机",
            "等待系统启动，进入主界面",
            "确认网络连接（WIFI或4G）",
            "首次使用需要进行系统激活",
          ],
        },
        {
          title: "刷卡收款",
          desc: "标准刷卡收款流程：",
          image: "https://cdn-icons-png.flaticon.com/128/2402/2402463.png",
          steps: [
            '在主界面选择"收款"功能',
            "输入收款金额",
            '选择"刷卡"支付方式',
            "请顾客插入或刷卡",
            "等待交易处理完成",
            "打印小票，交易完成",
          ],
        },
        {
          title: "扫码支付",
          desc: "支持微信、支付宝等扫码支付：",
          image: "https://cdn-icons-png.flaticon.com/128/4509/4509996.png",
          steps: [
            '在主界面选择"收款"功能',
            "输入收款金额",
            '选择"扫码"支付方式',
            "屏幕上会显示二维码，请顾客扫描",
            '或选择"扫一扫"，扫描顾客的付款码',
            "等待交易处理完成",
            "打印小票，交易完成",
          ],
        },
        {
          title: "交易查询",
          desc: "查询历史交易记录：",
          image: "https://cdn-icons-png.flaticon.com/128/9915/9915842.png",
          steps: [
            '在主界面选择"交易记录"',
            "可按日期、金额等条件筛选",
            "点击具体交易可查看详情",
            "支持重打印小票",
          ],
        },
      ],
      advancedTutorials: [
        {
          title: "退款操作",
          desc: "当需要为顾客办理退款时：",
          image: "https://cdn-icons-png.flaticon.com/128/4291/4291388.png",
          steps: [
            '在主界面选择"退款"功能',
            "输入原交易凭证号或扫描原小票",
            "确认退款金额",
            "请顾客插入或刷原交易卡片",
            "等待交易处理完成",
            "打印退款凭证",
          ],
        },
        {
          title: "分账功能",
          desc: "支持多人支付一笔交易：",
          image: "https://cdn-icons-png.flaticon.com/128/9576/9576292.png",
          steps: [
            '在主界面选择"收款"功能',
            '输入总金额后，选择"分账"',
            "输入分账人数",
            "设置每人支付金额或平均分配",
            "逐一完成每人支付流程",
            "所有支付完成后，打印总小票",
          ],
        },
        {
          title: "离线交易",
          desc: "网络异常时的应急操作：",
          image: "https://cdn-icons-png.flaticon.com/128/5356/5356691.png",
          steps: [
            "当网络连接异常时，系统会提示",
            '选择"离线交易"模式',
            "仅支持带芯片的银行卡",
            "完成交易后数据将暂存",
            "网络恢复后自动上传交易数据",
          ],
        },
      ],
      troubleshooting: [
        {
          question: "机器无法开机怎么办？",
          answer:
            "请检查电池电量，尝试连接充电器充电30分钟后再开机。如果仍然无法开机，请长按电源键10秒强制重启。如问题持续，请联系客服。",
          expanded: false,
        },
        {
          question: "交易失败但顾客已扣款怎么处理？",
          answer:
            "首先查询交易记录确认状态，如系统显示交易失败但顾客已扣款，请记录交易时间和金额，联系客服处理。通常银行会在1-3个工作日内自动退款。",
          expanded: false,
        },
        {
          question: "打印机不出纸怎么解决？",
          answer:
            "请检查打印纸是否安装正确或已用完，打开机器上盖重新安装打印纸。如打印机有异响或仍不出纸，可能是打印头故障，请联系技术支持。",
          expanded: false,
        },
        {
          question: "网络连接不稳定怎么办？",
          answer:
            "请检查信号强度，尝试移动到信号较好的位置。如使用WiFi，可重新连接或重启路由器。如使用4G，可尝试重启机器或更换SIM卡位置。持续问题请联系网络供应商。",
          expanded: false,
        },
        {
          question: "交易密码输入错误次数过多被锁怎么办？",
          answer:
            "银行卡密码连续输错3次会被锁定。请提醒顾客携带身份证到发卡银行柜台解锁，或拨打银行客服热线处理。POS机本身不能解除银行卡密码锁定。",
          expanded: false,
        },
      ],
    };
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
    },
    toggleFAQ(index) {
      this.troubleshooting[index].expanded =
        !this.troubleshooting[index].expanded;
    },
    contactCustomerService() {
      uni.showToast({
        title: "正在连接客服...",
        icon: "none",
      });
      // 实际开发中调用客服接口
    },
    goToHelpCenter() {
      uni.navigateTo({
        url: "/pages/help/index",
      });
    },
  },
};
</script>

<style>
.guide-container {
  padding-bottom: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.guide-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background-color: #fff;
}

.guide-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.guide-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.guide-tabs {
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

.guide-content {
  padding: 20rpx 30rpx;
}

.tutorial-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tutorial-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #f9f9f9;
}

.tutorial-index {
  width: 40rpx;
  height: 40rpx;
  background-color: #1296db;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.tutorial-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.tutorial-body {
  padding: 30rpx;
}

.tutorial-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.tutorial-image {
  width: 100%;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.tutorial-steps {
  background-color: #f9f9f9;
  padding: 20rpx;
  border-radius: 8rpx;
}

.step-line {
  display: flex;
  margin-bottom: 15rpx;
}

.step-line:last-child {
  margin-bottom: 0;
}

.step-index {
  color: #1296db;
  font-weight: bold;
  margin-right: 10rpx;
  font-size: 26rpx;
}

.step-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.faq-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.faq-icon {
  color: #1296db;
  font-size: 40rpx;
  font-weight: normal;
}

.faq-answer {
  padding: 0 30rpx 30rpx;
  font-size: 26rpx;
  color: #666;
  border-top: 1px solid #f0f0f0;
}

.contact-section {
  background-color: #fff;
  padding: 30rpx;
  text-align: center;
  margin: 20rpx 30rpx;
  border-radius: 12rpx;
}

.contact-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.contact-buttons {
  display: flex;
  justify-content: space-around;
}

.contact-btn {
  width: 45%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f0f9ff;
  color: #1296db;
  font-size: 28rpx;
  border-radius: 40rpx;
  border: 1px solid #1296db;
}
</style>
