<template>
  <view class="appointment-container">
    <!-- 页面头部 -->
    <view class="header-section">
      <image
        src="https://cdn-icons-png.flaticon.com/128/3349/3349234.png"
        class="header-icon"
      ></image>
      <view class="header-title">在线预约</view>
      <view class="header-desc">轻松预约，无需排队等待</view>
    </view>

    <!-- 预约类型选择 -->
    <view class="service-type-card">
      <view class="card-title">预约类型</view>
      <view class="service-type-list">
        <view
          class="service-type-item"
          v-for="(item, index) in serviceTypes"
          :key="index"
          :class="{ 'type-active': selectedType === index }"
          @click="selectServiceType(index)"
        >
          <image :src="item.icon" class="type-icon"></image>
          <view class="type-name">{{ item.name }}</view>
          <view class="type-desc">{{ item.desc }}</view>
        </view>
      </view>
    </view>

    <!-- 预约信息表单 -->
    <view class="form-card">
      <view class="card-title">预约信息</view>

      <view class="form-item">
        <text class="form-label">联系人</text>
        <input
          type="text"
          placeholder="请输入联系人姓名"
          v-model="appointmentInfo.name"
          class="form-input"
        />
      </view>

      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input
          type="number"
          placeholder="请输入联系电话"
          v-model="appointmentInfo.phone"
          class="form-input"
        />
      </view>

      <view class="form-item">
        <text class="form-label">商户名称</text>
        <input
          type="text"
          placeholder="请输入商户名称"
          v-model="appointmentInfo.merchant"
          class="form-input"
        />
      </view>

      <view class="form-item">
        <text class="form-label">设备型号</text>
        <picker
          mode="selector"
          :range="deviceModels"
          @change="onDeviceModelChange"
          class="form-picker"
        >
          <view class="picker-text">{{
            deviceModels[appointmentInfo.deviceModelIndex] || "请选择设备型号"
          }}</view>
        </picker>
      </view>
    </view>

    <!-- 预约时间选择 -->
    <view class="form-card">
      <view class="card-title">预约时间</view>

      <view class="form-item">
        <text class="form-label">日期</text>
        <picker
          mode="date"
          :value="appointmentInfo.date"
          :start="minDate"
          :end="maxDate"
          @change="onDateChange"
          class="form-picker"
        >
          <view class="picker-text">{{
            appointmentInfo.date || "请选择日期"
          }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">时间段</text>
        <picker
          mode="selector"
          :range="timeSlots"
          @change="onTimeSlotChange"
          class="form-picker"
          :disabled="!appointmentInfo.date"
        >
          <view class="picker-text">{{
            timeSlots[appointmentInfo.timeSlotIndex] || "请选择时间段"
          }}</view>
        </picker>
      </view>
    </view>

    <!-- 备注信息 -->
    <view class="form-card">
      <view class="card-title">备注信息</view>
      <textarea
        placeholder="请输入备注信息，如地址、服务需求等"
        v-model="appointmentInfo.remark"
        class="remark-textarea"
      ></textarea>
    </view>

    <!-- 预约须知 -->
    <view class="notice-card">
      <view class="notice-header">
        <image
          src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
          class="notice-icon"
        ></image>
        <text class="notice-title">预约须知</text>
      </view>
      <view class="notice-content">
        <text class="notice-item">1. 请提前1-3天进行预约</text>
        <text class="notice-item">2. 预约成功后，工作人员将会电话确认</text>
        <text class="notice-item"
          >3. 如需取消或修改预约，请提前12小时联系客服</text
        >
        <text class="notice-item">4. 服务时间为工作日9:00-18:00</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="btn-group">
      <view class="submit-btn" @click="submitAppointment">提交预约</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const today = new Date();
    // 最小日期为明天
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 最大日期为30天后
    const maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 30);

    return {
      serviceTypes: [
        {
          name: "安装调试",
          desc: "专业安装调试POS机",
          icon: "https://cdn-icons-png.flaticon.com/128/3176/3176355.png",
        },
        {
          name: "培训指导",
          desc: "提供POS机使用培训",
          icon: "https://cdn-icons-png.flaticon.com/128/3050/3050374.png",
        },
        {
          name: "故障检修",
          desc: "解决POS机使用故障",
          icon: "https://cdn-icons-png.flaticon.com/128/6308/6308034.png",
        },
        {
          name: "系统升级",
          desc: "升级POS机软件系统",
          icon: "https://cdn-icons-png.flaticon.com/128/6348/6348650.png",
        },
      ],
      selectedType: 0,
      deviceModels: ["P1系列", "P2系列", "P3系列", "P4系列", "其他型号"],
      timeSlots: ["上午 9:00-12:00", "下午 13:00-16:00", "傍晚 16:00-18:00"],
      minDate: this.formatDate(tomorrow),
      maxDate: this.formatDate(maxDay),
      appointmentInfo: {
        name: "",
        phone: "",
        merchant: "",
        deviceModelIndex: 0,
        date: "",
        timeSlotIndex: 0,
        remark: "",
      },
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

    // 如果用户已登录，尝试获取用户信息
    try {
      const userInfoObj = JSON.parse(userInfo);
      if (userInfoObj.nickName) {
        this.appointmentInfo.name = userInfoObj.nickName;
      }
      if (userInfoObj.phone) {
        this.appointmentInfo.phone = userInfoObj.phone;
      }
      if (userInfoObj.merchantName) {
        this.appointmentInfo.merchant = userInfoObj.merchantName;
      }
    } catch (e) {
      console.error("解析用户信息失败", e);
    }

    // 设置默认预约日期为明天
    this.appointmentInfo.date = this.minDate;
  },
  methods: {
    // 选择服务类型
    selectServiceType(index) {
      this.selectedType = index;
    },

    // 设备型号选择
    onDeviceModelChange(e) {
      this.appointmentInfo.deviceModelIndex = e.detail.value;
    },

    // 日期选择
    onDateChange(e) {
      this.appointmentInfo.date = e.detail.value;
    },

    // 时间段选择
    onTimeSlotChange(e) {
      this.appointmentInfo.timeSlotIndex = e.detail.value;
    },

    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 提交预约
    submitAppointment() {
      // 表单验证
      if (!this.appointmentInfo.name) {
        this.showToast("请输入联系人姓名");
        return;
      }

      if (!this.appointmentInfo.phone) {
        this.showToast("请输入联系电话");
        return;
      }

      // 手机号格式验证
      if (!/^1\d{10}$/.test(this.appointmentInfo.phone)) {
        this.showToast("请输入正确的手机号");
        return;
      }

      if (!this.appointmentInfo.merchant) {
        this.showToast("请输入商户名称");
        return;
      }

      if (!this.appointmentInfo.date) {
        this.showToast("请选择预约日期");
        return;
      }

      // 显示加载中
      uni.showLoading({
        title: "提交中...",
      });

      // 构建预约数据
      const appointmentData = {
        serviceType: this.serviceTypes[this.selectedType].name,
        name: this.appointmentInfo.name,
        phone: this.appointmentInfo.phone,
        merchant: this.appointmentInfo.merchant,
        deviceModel: this.deviceModels[this.appointmentInfo.deviceModelIndex],
        appointmentDate: this.appointmentInfo.date,
        appointmentTime: this.timeSlots[this.appointmentInfo.timeSlotIndex],
        remark: this.appointmentInfo.remark,
        createTime: new Date(),
        status: "pending", // 待确认状态
      };

      // 模拟提交到服务器
      setTimeout(() => {
        uni.hideLoading();

        // 在实际应用中，这里应该调用云函数或API提交数据
        console.log("提交预约信息", appointmentData);

        // 显示预约成功提示
        uni.showModal({
          title: "预约提交成功",
          content:
            "您的服务预约已提交成功，工作人员将会在1个工作日内与您联系确认详情。",
          showCancel: false,
          confirmText: "我知道了",
          success: () => {
            // 返回首页
            uni.switchTab({
              url: "/pages/index/index",
            });
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
.appointment-container {
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

.service-type-card,
.form-card,
.notice-card {
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

.service-type-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.service-type-item {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  height: 160rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  box-sizing: border-box;
  border: 2rpx solid transparent;
}

.type-active {
  background-color: #f0f9ff;
  border-color: #1296db;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 15rpx;
}

.type-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.type-desc {
  font-size: 22rpx;
  color: #999;
  text-align: center;
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
  width: 160rpx;
  font-size: 28rpx;
  color: #333;
}

.form-input,
.form-picker {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
}

.picker-text {
  color: #333;
}

.remark-textarea {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.notice-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.notice-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.notice-content {
  padding: 0 10rpx;
}

.notice-item {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 10rpx;
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

.submit-btn {
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
