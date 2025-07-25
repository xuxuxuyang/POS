<template>
  <view class="repair-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <image
        src="https://cdn-icons-png.flaticon.com/128/1584/1584812.png"
        class="header-icon"
      ></image>
      <text class="header-title">维修申请</text>
    </view>

    <!-- 表单卡片 -->
    <view class="form-card">
      <!-- 设备信息 -->
      <view class="form-section">
        <view class="section-title">设备信息</view>

        <view class="form-item">
          <text class="form-label"
            >设备型号 <text class="required">*</text></text
          >
          <picker
            mode="selector"
            :range="deviceModels"
            @change="onModelChange"
            class="form-picker"
          >
            <view class="picker-value">{{
              formData.model || "请选择设备型号"
            }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label"
            >设备SN码 <text class="required">*</text></text
          >
          <input
            type="text"
            v-model="formData.serialNumber"
            placeholder="请输入设备背面的SN码"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <text class="form-label">购买日期</text>
          <picker
            mode="date"
            :value="formData.purchaseDate"
            @change="onDateChange"
            class="form-picker"
          >
            <view class="picker-value">{{
              formData.purchaseDate || "请选择购买日期"
            }}</view>
          </picker>
        </view>
      </view>

      <!-- 故障描述 -->
      <view class="form-section">
        <view class="section-title">故障描述</view>

        <view class="form-item">
          <text class="form-label"
            >故障类型 <text class="required">*</text></text
          >
          <picker
            mode="selector"
            :range="issueTypes"
            @change="onIssueTypeChange"
            class="form-picker"
          >
            <view class="picker-value">{{
              formData.issueType || "请选择故障类型"
            }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label"
            >故障描述 <text class="required">*</text></text
          >
          <textarea
            v-model="formData.issueDescription"
            placeholder="请详细描述您遇到的问题"
            class="form-textarea"
          ></textarea>
        </view>

        <view class="form-item">
          <text class="form-label">故障图片</text>
          <view class="upload-box">
            <view
              class="upload-item"
              v-for="(item, index) in formData.images"
              :key="index"
            >
              <image :src="item" class="upload-image"></image>
              <view class="delete-btn" @click="deleteImage(index)">×</view>
            </view>
            <view
              class="upload-btn"
              @click="chooseImage"
              v-if="formData.images.length < 3"
            >
              <text class="upload-icon">+</text>
              <text class="upload-text">上传图片</text>
            </view>
          </view>
          <text class="upload-tip">最多上传3张图片，每张不超过5MB</text>
        </view>
      </view>

      <!-- 维修方式 -->
      <view class="form-section">
        <view class="section-title">维修方式</view>

        <view class="form-item">
          <text class="form-label"
            >维修方式 <text class="required">*</text></text
          >
          <radio-group @change="onRepairTypeChange" class="radio-group">
            <label
              class="radio-label"
              v-for="(item, index) in repairTypes"
              :key="index"
            >
              <radio
                :value="item.value"
                :checked="formData.repairType === item.value"
                color="#1296db"
              />
              <text class="radio-text">{{ item.label }}</text>
            </label>
          </radio-group>
        </view>

        <view class="form-item" v-if="formData.repairType === 'mail'">
          <text class="form-label"
            >收件地址 <text class="required">*</text></text
          >
          <input
            type="text"
            v-model="formData.repairAddress"
            placeholder="请输入您的详细地址"
            class="form-input"
          />
        </view>
      </view>

      <!-- 联系信息 -->
      <view class="form-section">
        <view class="section-title">联系信息</view>

        <view class="form-item">
          <text class="form-label">联系人 <text class="required">*</text></text>
          <input
            type="text"
            v-model="formData.contactName"
            placeholder="请输入联系人姓名"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <text class="form-label"
            >联系电话 <text class="required">*</text></text
          >
          <input
            type="number"
            v-model="formData.contactPhone"
            placeholder="请输入联系电话"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <text class="form-label">备注</text>
          <textarea
            v-model="formData.remark"
            placeholder="请输入备注信息（选填）"
            class="form-textarea"
          ></textarea>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-btn" @click="submitForm">提交申请</view>

    <!-- 服务说明 -->
    <view class="service-notes">
      <view class="notes-title">服务说明：</view>
      <view class="notes-item"
        >1. 保修期内的设备维修免费，过保设备将收取适当的维修费用</view
      >
      <view class="notes-item"
        >2. 人为损坏（如进水、摔坏等）不在免费保修范围内</view
      >
      <view class="notes-item"
        >3. 寄修设备请使用原包装或加强防护，避免运输损坏</view
      >
      <view class="notes-item"
        >4. 维修完成后，我们将在3个工作日内寄回或联系您</view
      >
      <view class="notes-item">5. 如有疑问，请拨打客服热线：400-123-4567</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      deviceModels: [
        "POS-M1",
        "POS-M2",
        "POS-M3 Pro",
        "POS-M4",
        "POS-M5",
        "POS-M6 Plus",
        "POS-S1",
        "POS-S2",
        "POS-S3 Mini",
      ],
      issueTypes: [
        "无法开机",
        "无法充电",
        "屏幕故障",
        "打印故障",
        "网络连接问题",
        "读卡问题",
        "系统故障",
        "按键失灵",
        "其他问题",
      ],
      repairTypes: [
        { label: "寄修（邮寄到维修中心）", value: "mail" },
        { label: "上门维修（仅限部分城市）", value: "onsite" },
        { label: "预约到店（就近服务网点）", value: "store" },
      ],
      formData: {
        model: "",
        serialNumber: "",
        purchaseDate: "",
        issueType: "",
        issueDescription: "",
        images: [],
        repairType: "mail",
        repairAddress: "",
        contactName: "",
        contactPhone: "",
        remark: "",
      },
      userInfo: null,
    };
  },
  onLoad() {
    // 获取用户信息并预填联系人信息
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      const userInfoStr = uni.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          this.userInfo = JSON.parse(userInfoStr);

          // 预填联系人信息
          if (this.userInfo) {
            this.formData.contactName = this.userInfo.nickName || "";
            this.formData.contactPhone = this.userInfo.phone || "";
          }
        } catch (e) {
          console.error("解析用户信息失败", e);
        }
      }
    },

    // 型号选择事件
    onModelChange(e) {
      const index = e.detail.value;
      this.formData.model = this.deviceModels[index];
    },

    // 日期选择事件
    onDateChange(e) {
      this.formData.purchaseDate = e.detail.value;
    },

    // 故障类型选择事件
    onIssueTypeChange(e) {
      const index = e.detail.value;
      this.formData.issueType = this.issueTypes[index];
    },

    // 维修方式选择事件
    onRepairTypeChange(e) {
      this.formData.repairType = e.detail.value;
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.formData.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          // 合并图片数组
          this.formData.images = [
            ...this.formData.images,
            ...res.tempFilePaths,
          ];
        },
      });
    },

    // 删除图片
    deleteImage(index) {
      this.formData.images.splice(index, 1);
    },

    // 表单验证
    validateForm() {
      if (!this.formData.model) {
        this.showToast("请选择设备型号");
        return false;
      }

      if (!this.formData.serialNumber) {
        this.showToast("请输入设备SN码");
        return false;
      }

      if (!this.formData.issueType) {
        this.showToast("请选择故障类型");
        return false;
      }

      if (!this.formData.issueDescription) {
        this.showToast("请描述故障情况");
        return false;
      }

      if (this.formData.repairType === "mail" && !this.formData.repairAddress) {
        this.showToast("请输入收件地址");
        return false;
      }

      if (!this.formData.contactName) {
        this.showToast("请输入联系人姓名");
        return false;
      }

      if (!this.formData.contactPhone) {
        this.showToast("请输入联系电话");
        return false;
      }

      // 手机号格式验证
      if (!/^1\d{10}$/.test(this.formData.contactPhone)) {
        this.showToast("请输入正确的手机号");
        return false;
      }

      return true;
    },

    // 提交表单
    submitForm() {
      // 表单验证
      if (!this.validateForm()) {
        return;
      }

      // 检查登录状态
      if (!this.userInfo) {
        uni.showModal({
          title: "提示",
          content: "请先登录后再提交维修申请",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/user/index",
              });
            }
          },
        });
        return;
      }

      // 显示加载提示
      uni.showLoading({
        title: "提交中...",
        mask: true,
      });

      // 准备提交的数据
      const submitData = {
        ...this.formData,
        userId: this.userInfo._id,
        submitTime: new Date(),
        status: "待处理",
        repairId: "R" + Date.now(),
      };

      // 模拟上传图片和提交数据
      setTimeout(() => {
        // 上传完成后添加到数据库
        const db = wx.cloud.database();
        db.collection("repair_orders").add({
          data: submitData,
          success: (res) => {
            uni.hideLoading();

            // 提交成功
            uni.showModal({
              title: "提交成功",
              content:
                "您的维修申请已提交，维修单号：" +
                submitData.repairId +
                "，我们将尽快处理",
              showCancel: false,
              success: () => {
                // 返回上一页
                uni.navigateBack();
              },
            });
          },
          fail: (err) => {
            uni.hideLoading();
            console.error("提交维修申请失败", err);

            this.showToast("提交失败，请重试");
          },
        });
      }, 1500);
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
.repair-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 30rpx;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background-color: #1296db;
}

.header-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.form-card {
  margin: 30rpx;
  border-radius: 12rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-section {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
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
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.required {
  color: #ff5252;
}

.form-input,
.form-picker {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  color: #333;
}

.form-textarea {
  width: 100%;
  height: 180rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.upload-box {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10rpx;
}

.upload-item {
  width: 160rpx;
  height: 160rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.delete-btn {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  border: 1rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.upload-icon {
  font-size: 60rpx;
  color: #ddd;
  margin-bottom: 10rpx;
  line-height: 1;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
}

.radio-group {
  display: flex;
  flex-direction: column;
}

.radio-label {
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
}

.radio-label:last-child {
  margin-bottom: 0;
}

.radio-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 10rpx;
}

.submit-btn {
  margin: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}

.service-notes {
  margin: 30rpx;
  padding: 30rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
}

.notes-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.notes-item {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  line-height: 1.5;
}
</style>
