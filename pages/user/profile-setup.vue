<template>
  <view class="profile-setup-container">
    <view class="header">
      <view class="title">完善个人资料</view>
      <view class="subtitle">完善资料可获得更好的服务体验</view>
    </view>

    <view class="form-card">
      <view class="form-item">
        <text class="label">真实姓名</text>
        <input
          class="input"
          type="text"
          placeholder="请输入您的真实姓名"
          v-model="profileData.realName"
        />
      </view>

      <view class="form-item">
        <text class="label">身份证号</text>
        <input
          class="input"
          type="idcard"
          placeholder="请输入您的身份证号"
          v-model="profileData.idCard"
          @input="validateIdCard"
        />
        <text class="tip-text" v-if="idCardError">{{ idCardError }}</text>
      </view>

      <view class="form-item">
        <text class="label">商户类型</text>
        <picker
          mode="selector"
          :range="businessTypes"
          @change="onBusinessTypeChange"
        >
          <view class="picker-view">
            <text>{{ profileData.businessType || "请选择商户类型" }}</text>
            <text class="arrow-down">▼</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">预估月交易量</text>
        <picker
          mode="selector"
          :range="transactionRanges"
          @change="onTransactionRangeChange"
        >
          <view class="picker-view">
            <text>{{
              profileData.transactionRange || "请选择预估月交易量"
            }}</text>
            <text class="arrow-down">▼</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">常用地址</text>
        <textarea
          class="textarea"
          placeholder="请输入您的常用地址"
          v-model="profileData.address"
          maxlength="100"
        />
      </view>

      <view class="form-item">
        <text class="label">备注说明</text>
        <textarea
          class="textarea"
          placeholder="选填，如有特殊需求请在此说明"
          v-model="profileData.remark"
          maxlength="200"
        />
      </view>

      <button
        class="submit-btn"
        :disabled="!isFormValid"
        :class="{ 'btn-disabled': !isFormValid }"
        @click="submitProfile"
      >
        确认提交
      </button>
    </view>

    <view class="tip-card">
      <text class="tip-title">为什么需要完善资料？</text>
      <text class="tip-desc"
        >完善个人资料有助于我们为您提供更精准的服务，同时也是审核POS机申请的必要信息。您的信息将严格保密，请放心填写。</text
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      profileData: {
        realName: "",
        idCard: "",
        businessType: "",
        transactionRange: "",
        address: "",
        remark: "",
      },
      businessTypes: [
        "个体工商户",
        "小微企业",
        "零售商户",
        "餐饮服务",
        "便利店",
        "美容美发",
        "医疗保健",
        "教育培训",
        "其他",
      ],
      transactionRanges: [
        "5千以下/月",
        "5千-1万/月",
        "1万-3万/月",
        "3万-5万/月",
        "5万-10万/月",
        "10万以上/月",
      ],
      idCardError: "",
    };
  },
  computed: {
    isFormValid() {
      return (
        this.profileData.realName.length >= 2 &&
        this.isIdCardValid() &&
        this.profileData.businessType &&
        this.profileData.transactionRange &&
        this.profileData.address.length >= 5
      );
    },
  },
  onLoad(options) {
    // 获取上一个页面传递的用户ID
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("getUserId", (data) => {
      this.userId = data.userId;
    });

    // 如果没有从上一页获取到userId，尝试从本地存储获取
    if (!this.userId) {
      this.userId = uni.getStorageSync("userId");
    }

    // 如果有可能，加载已有的用户信息
    this.loadExistingUserInfo();
  },
  methods: {
    // 加载已有的用户信息
    loadExistingUserInfo() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        const userInfoObj = JSON.parse(userInfo);

        // 如果已经有相关信息，预填充表单
        if (userInfoObj.realName) {
          this.profileData.realName = userInfoObj.realName;
        }
        if (userInfoObj.idCard) {
          this.profileData.idCard = userInfoObj.idCard;
        }
        if (userInfoObj.businessType) {
          this.profileData.businessType = userInfoObj.businessType;
        }
        if (userInfoObj.transactionRange) {
          this.profileData.transactionRange = userInfoObj.transactionRange;
        }
        if (userInfoObj.address) {
          this.profileData.address = userInfoObj.address;
        }
        if (userInfoObj.remark) {
          this.profileData.remark = userInfoObj.remark;
        }
      }
    },

    // 验证身份证号
    validateIdCard() {
      if (!this.profileData.idCard) {
        this.idCardError = "";
        return;
      }

      // 简单的身份证验证规则，实际项目中应该更严格
      const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardReg.test(this.profileData.idCard)) {
        this.idCardError = "请输入正确的身份证号码";
      } else {
        this.idCardError = "";
      }
    },

    // 检查身份证号是否有效
    isIdCardValid() {
      return this.profileData.idCard && !this.idCardError;
    },

    // 商户类型变化
    onBusinessTypeChange(e) {
      const index = e.detail.value;
      this.profileData.businessType = this.businessTypes[index];
    },

    // 交易量范围变化
    onTransactionRangeChange(e) {
      const index = e.detail.value;
      this.profileData.transactionRange = this.transactionRanges[index];
    },

    // 提交资料
    submitProfile() {
      if (!this.isFormValid) return;

      // 调用用户中心页面的完善资料方法
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];

      if (prevPage && prevPage.$vm.completeUserProfile) {
        prevPage.$vm.completeUserProfile(this.profileData, this.userId);
      } else {
        // 如果无法通过前一页面调用方法，则直接调用云函数
        this.saveProfileDirectly();
      }
    },

    // 直接保存资料到云数据库
    saveProfileDirectly() {
      uni.showLoading({
        title: "保存中...",
        mask: true,
      });

      const db = wx.cloud.database();
      db.collection("userinfo")
        .doc(this.userId)
        .update({
          data: {
            ...this.profileData,
            isProfileCompleted: true,
          },
        })
        .then(() => {
          console.log("用户资料保存成功");

          // 更新本地存储
          let userInfo = JSON.parse(uni.getStorageSync("userInfo") || "{}");
          userInfo = {
            ...userInfo,
            ...this.profileData,
            isProfileCompleted: true,
          };
          uni.setStorageSync("userInfo", JSON.stringify(userInfo));

          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success",
          });

          // 返回到个人中心页面
          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        })
        .catch((err) => {
          console.error("保存用户资料失败", err);
          uni.hideLoading();
          uni.showToast({
            title: "保存失败，请重试",
            icon: "none",
          });
        });
    },
  },
};
</script>

<style>
.profile-setup-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 40rpx 30rpx;
  padding-bottom: 80rpx;
}

.header {
  margin-bottom: 40rpx;
  padding: 20rpx 0;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.form-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.input {
  width: 100%;
  height: 90rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}

.picker-view {
  width: 100%;
  height: 90rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.arrow-down {
  font-size: 24rpx;
  color: #999;
}

.textarea {
  width: 100%;
  height: 180rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
}

.tip-text {
  font-size: 24rpx;
  color: #ff5252;
  margin-top: 10rpx;
  display: block;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  text-align: center;
  box-shadow: 0 6rpx 20rpx rgba(18, 150, 219, 0.3);
  margin-top: 20rpx;
}

.btn-disabled {
  background-color: #ccc;
  box-shadow: none;
}

.tip-card {
  background-color: #f3f9ff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}

.tip-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #1296db;
  margin-bottom: 15rpx;
  display: block;
}

.tip-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>
