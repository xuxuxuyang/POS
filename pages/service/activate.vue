<template>
  <view class="activate-container">
    <!-- 页面头部 -->
    <view class="header-section">
      <image
        src="https://cdn-icons-png.flaticon.com/128/1728/1728853.png"
        class="header-icon"
      ></image>
      <view class="header-title">POS机激活</view>
      <view class="header-desc">请按照步骤激活您的POS机设备</view>
    </view>

    <!-- 设备信息 -->
    <view class="form-card">
      <view class="card-title">设备信息</view>
      <view class="form-item">
        <text class="form-label">设备型号</text>
        <input
          type="text"
          placeholder="请输入POS机型号"
          v-model="deviceModel"
          class="form-input"
        />
      </view>
      <view class="form-item">
        <text class="form-label">设备序列号</text>
        <input
          type="text"
          placeholder="请输入设备序列号"
          v-model="serialNumber"
          class="form-input"
        />
        <view class="scan-btn" @click="scanSerialNumber">
          <image
            src="https://cdn-icons-png.flaticon.com/128/3126/3126544.png"
            class="scan-icon"
          ></image>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">机具编号</text>
        <input
          type="text"
          placeholder="请输入机具编号"
          v-model="deviceNumber"
          class="form-input"
        />
      </view>
    </view>

    <!-- 商户信息 -->
    <view class="form-card">
      <view class="card-title">商户信息</view>
      <view class="form-item">
        <text class="form-label">商户名称</text>
        <input
          type="text"
          placeholder="请输入商户名称"
          v-model="merchantName"
          class="form-input"
        />
      </view>
      <view class="form-item">
        <text class="form-label">联系人</text>
        <input
          type="text"
          placeholder="请输入联系人姓名"
          v-model="contactName"
          class="form-input"
        />
      </view>
      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input
          type="number"
          placeholder="请输入联系电话"
          v-model="contactPhone"
          class="form-input"
        />
      </view>
    </view>

    <!-- 激活步骤 -->
    <view class="steps-card">
      <view class="card-title">激活步骤</view>
      <view class="steps">
        <view class="step-item" :class="{ 'step-active': currentStep >= 1 }">
          <view class="step-num">1</view>
          <view class="step-info">
            <view class="step-title">检查设备</view>
            <view class="step-desc">确保设备电量充足，能够正常开机</view>
          </view>
        </view>
        <view class="step-item" :class="{ 'step-active': currentStep >= 2 }">
          <view class="step-num">2</view>
          <view class="step-info">
            <view class="step-title">连接网络</view>
            <view class="step-desc">将设备连接到Wi-Fi或移动网络</view>
          </view>
        </view>
        <view class="step-item" :class="{ 'step-active': currentStep >= 3 }">
          <view class="step-num">3</view>
          <view class="step-info">
            <view class="step-title">输入信息</view>
            <view class="step-desc">在设备上输入激活码并完成设置</view>
          </view>
        </view>
        <view class="step-item" :class="{ 'step-active': currentStep >= 4 }">
          <view class="step-num">4</view>
          <view class="step-info">
            <view class="step-title">激活完成</view>
            <view class="step-desc">设备完成激活并可以开始使用</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 激活码 -->
    <view class="activation-card" v-if="activationCode">
      <view class="card-title">您的激活码</view>
      <view class="activation-code">{{ activationCode }}</view>
      <view class="activation-note">请在POS机启动后的激活界面输入此激活码</view>
      <view class="copy-btn" @click="copyActivationCode">复制激活码</view>
    </view>

    <!-- 帮助提示 -->
    <view class="help-card">
      <view class="help-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
          class="help-icon"
        ></image>
        <text class="help-title">激活帮助</text>
      </view>
      <view class="help-content">
        <text class="help-text">如果您在激活过程中遇到问题，可以：</text>
        <text class="help-text"
          >1. 查看详细的
          <text class="help-link" @click="navigateTo('/pages/guide/activate')"
            >激活教程</text
          ></text
        >
        <text class="help-text"
          >2. 拨打客服热线
          <text class="help-phone" @click="callService"
            >400-123-4567</text
          ></text
        >
        <text class="help-text"
          >3. 联系在线客服
          <text class="help-link" @click="contactOnlineService"
            >获取支持</text
          ></text
        >
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="btn-group">
      <view class="next-btn" @click="nextStep">{{
        currentStep < 4 ? "下一步" : "完成激活"
      }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      deviceModel: "",
      serialNumber: "",
      deviceNumber: "",
      merchantName: "",
      contactName: "",
      contactPhone: "",
      currentStep: 1,
      activationCode: "",
      isSubmitting: false,
    };
  },
  onLoad() {
    // 检查登录状态
    const userInfo = uni.getStorageSync("userInfo");
    if (!userInfo) {
      uni.showToast({
        title: "请先登录",
        icon: "none",
      });
      setTimeout(() => {
        uni.switchTab({
          url: "/pages/user/index",
        });
      }, 1500);
      return;
    }

    // 如果用户已登录，尝试获取商户信息
    try {
      const userInfoObj = JSON.parse(userInfo);
      if (userInfoObj.merchantName) {
        this.merchantName = userInfoObj.merchantName;
      }
      if (userInfoObj.nickName) {
        this.contactName = userInfoObj.nickName;
      }
      if (userInfoObj.phone) {
        this.contactPhone = userInfoObj.phone;
      }
    } catch (e) {
      console.error("解析用户信息失败", e);
    }
  },
  methods: {
    // 扫码获取序列号
    scanSerialNumber() {
      uni.scanCode({
        scanType: ["qrCode", "barCode"],
        success: (res) => {
          this.serialNumber = res.result;
        },
        fail: () => {
          uni.showToast({
            title: "扫码失败",
            icon: "none",
          });
        },
      });
    },

    // 下一步或提交
    nextStep() {
      if (this.currentStep < 4) {
        // 验证当前步骤的输入
        if (this.currentStep === 1) {
          if (!this.deviceModel || !this.serialNumber || !this.deviceNumber) {
            uni.showToast({
              title: "请填写完设备信息",
              icon: "none",
            });
            return;
          }
        } else if (this.currentStep === 2) {
          if (!this.merchantName || !this.contactName || !this.contactPhone) {
            uni.showToast({
              title: "请填写完商户信息",
              icon: "none",
            });
            return;
          }

          // 手机号格式验证
          if (!/^1\d{10}$/.test(this.contactPhone)) {
            uni.showToast({
              title: "请输入正确的手机号",
              icon: "none",
            });
            return;
          }
        }

        // 进入下一步
        this.currentStep++;

        // 如果进入第三步，生成激活码
        if (this.currentStep === 3) {
          this.generateActivationCode();
        }
      } else {
        // 完成激活流程
        this.submitActivation();
      }
    },

    // 生成激活码
    generateActivationCode() {
      // 显示加载
      uni.showLoading({
        title: "生成激活码...",
      });

      // 模拟网络请求
      setTimeout(() => {
        // 生成一个随机的激活码
        const randomCode = Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();
        this.activationCode = `${randomCode.slice(0, 4)}-${randomCode.slice(
          4,
          8
        )}`;

        uni.hideLoading();
      }, 1500);
    },

    // 提交激活信息
    submitActivation() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      uni.showLoading({
        title: "提交中...",
      });

      // 构建提交的数据
      const activationData = {
        deviceModel: this.deviceModel,
        serialNumber: this.serialNumber,
        deviceNumber: this.deviceNumber,
        merchantName: this.merchantName,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        activationCode: this.activationCode,
        activationTime: new Date(),
        status: "pending", // 待审核状态
      };

      // 模拟提交
      setTimeout(() => {
        uni.hideLoading();

        // 在实际应用中，这里应该调用云函数或API提交数据
        console.log("提交激活信息", activationData);

        // 提交成功后显示提示
        uni.showModal({
          title: "激活申请已提交",
          content:
            "您的POS机激活申请已提交，我们将在1-2个工作日内处理。激活结果将通过短信通知您。",
          showCancel: false,
          confirmText: "知道了",
          success: () => {
            // 返回首页
            uni.switchTab({
              url: "/pages/index/index",
            });
          },
        });

        this.isSubmitting = false;
      }, 2000);
    },

    // 复制激活码
    copyActivationCode() {
      uni.setClipboardData({
        data: this.activationCode,
        success: () => {
          uni.showToast({
            title: "激活码已复制",
            icon: "success",
          });
        },
      });
    },

    // 导航到指定页面
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    // 拨打客服电话
    callService() {
      uni.makePhoneCall({
        phoneNumber: "400-123-4567",
        fail: () => {
          uni.showToast({
            title: "拨打失败",
            icon: "none",
          });
        },
      });
    },

    // 联系在线客服
    contactOnlineService() {
      uni.showToast({
        title: "正在接入客服...",
        icon: "none",
      });
    },
  },
};
</script>

<style>
.activate-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 30rpx;
  padding-bottom: 120rpx;
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.header-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.header-desc {
  font-size: 28rpx;
  color: #666;
}

.form-card,
.steps-card,
.activation-card,
.help-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  position: relative;
  padding-left: 20rpx;
}

.card-title::before {
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

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  width: 180rpx;
  font-size: 28rpx;
  color: #333;
}

.form-input {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.scan-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}

.scan-icon {
  width: 44rpx;
  height: 44rpx;
}

.steps {
  padding: 20rpx 0;
}

.step-item {
  display: flex;
  margin-bottom: 40rpx;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-num {
  width: 50rpx;
  height: 50rpx;
  background-color: #eee;
  color: #999;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.step-active .step-num {
  background-color: #1296db;
  color: #fff;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.step-active .step-title {
  color: #1296db;
}

.step-desc {
  font-size: 24rpx;
  color: #999;
}

.activation-card {
  text-align: center;
}

.activation-code {
  font-size: 48rpx;
  font-weight: bold;
  color: #1296db;
  letter-spacing: 4rpx;
  margin: 30rpx 0;
}

.activation-note {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.copy-btn {
  display: inline-block;
  padding: 15rpx 40rpx;
  background-color: #f0f9ff;
  color: #1296db;
  font-size: 26rpx;
  border-radius: 30rpx;
  border: 1rpx solid #1296db;
}

.help-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.help-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.help-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.help-content {
  padding: 0 10rpx;
}

.help-text {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 10rpx;
}

.help-link {
  color: #1296db;
}

.help-phone {
  color: #1296db;
  text-decoration: underline;
}

.btn-group {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 9;
}

.next-btn {
  height: 90rpx;
  background: linear-gradient(to right, #1296db, #14b8e4);
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
