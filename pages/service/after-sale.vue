<template>
  <view class="service-container">
    <view class="service-header">
      <image
        src="https://cdn-icons-png.flaticon.com/128/1067/1067566.png"
        mode="aspectFit"
        class="service-icon"
      ></image>
      <text class="service-title">售后服务</text>
    </view>

    <view class="service-tabs">
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

    <!-- 服务政策 -->
    <view class="service-content" v-if="currentTab === 0">
      <view class="policy-card">
        <view class="policy-header">
          <text class="policy-title">售后保障</text>
        </view>
        <view class="policy-body">
          <view
            class="policy-item"
            v-for="(item, index) in policies"
            :key="index"
          >
            <view class="policy-icon">
              <image :src="item.icon" mode="aspectFit"></image>
            </view>
            <view class="policy-info">
              <text class="policy-name">{{ item.name }}</text>
              <text class="policy-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="warranty-card">
        <view class="warranty-header">
          <text class="warranty-title">保修政策</text>
        </view>
        <view class="warranty-body">
          <view
            class="warranty-item"
            v-for="(item, index) in warrantyInfo"
            :key="index"
          >
            <view class="warranty-label">{{ item.label }}</view>
            <view class="warranty-value">{{ item.value }}</view>
          </view>
          <view class="warranty-note">
            <text class="note-title">温馨提示：</text>
            <text class="note-content"
              >以上为常规保修政策，具体以您购买的产品说明为准。人为损坏、不当使用、擅自拆卸等情况不在保修范围内。</text
            >
          </view>
        </view>
      </view>
    </view>

    <!-- 维修申请 -->
    <view class="service-content" v-if="currentTab === 1">
      <view class="form-card">
        <view class="form-header">
          <text class="form-title">维修申请</text>
        </view>
        <view class="form-body">
          <view class="form-item">
            <text class="form-label">设备型号</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入设备型号"
              v-model="repairForm.model"
            />
          </view>
          <view class="form-item">
            <text class="form-label">设备SN码</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入设备背面的SN码"
              v-model="repairForm.sn"
            />
          </view>
          <view class="form-item">
            <text class="form-label">购买日期</text>
            <picker
              mode="date"
              :value="repairForm.purchaseDate"
              @change="onDateChange"
            >
              <view class="picker-view">
                {{ repairForm.purchaseDate || "请选择购买日期" }}
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">问题描述</text>
            <textarea
              class="form-textarea"
              placeholder="请详细描述设备出现的问题"
              v-model="repairForm.problem"
            ></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">联系方式</text>
            <input
              class="form-input"
              type="number"
              placeholder="请输入您的手机号码"
              v-model="repairForm.contact"
            />
          </view>
          <view class="form-item">
            <text class="form-label">服务方式</text>
            <radio-group @change="onServiceTypeChange">
              <label
                class="radio-item"
                v-for="(item, index) in serviceTypes"
                :key="index"
              >
                <radio
                  :value="item.value"
                  :checked="repairForm.serviceType === item.value"
                  color="#1296db"
                />
                <text>{{ item.name }}</text>
              </label>
            </radio-group>
          </view>

          <button class="submit-btn" @click="submitRepairForm">提交申请</button>
        </view>
      </view>
    </view>

    <!-- 维修网点 -->
    <view class="service-content" v-if="currentTab === 2">
      <view class="region-selector">
        <picker mode="region" @change="onRegionChange" :value="selectedRegion">
          <view class="picker-view">
            {{ selectedRegion[0] }} {{ selectedRegion[1] }}
            {{ selectedRegion[2] }}
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>

      <view class="location-list">
        <view class="location-empty" v-if="serviceLocations.length === 0">
          <image
            src="https://cdn-icons-png.flaticon.com/128/2626/2626023.png"
            mode="aspectFit"
            class="empty-icon"
          ></image>
          <text class="empty-text">当前地区暂无维修网点</text>
        </view>

        <view
          class="location-item"
          v-for="(item, index) in serviceLocations"
          :key="index"
        >
          <view class="location-info">
            <text class="location-name">{{ item.name }}</text>
            <text class="location-address">{{ item.address }}</text>
            <text class="location-phone">{{ item.phone }}</text>
            <text class="location-time"
              >营业时间：{{ item.businessHours }}</text
            >
          </view>
          <view class="location-actions">
            <button class="action-btn call-btn" @click="callPhone(item.phone)">
              拨打电话
            </button>
            <button class="action-btn map-btn" @click="openMap(item)">
              查看地图
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系客服 -->
    <view class="contact-section">
      <text class="contact-title">需要更多帮助？</text>
      <view class="contact-info">
        <view class="contact-item">
          <text class="contact-label">客服热线：</text>
          <text class="contact-value" @click="callServicePhone"
            >400-888-8888</text
          >
        </view>
        <view class="contact-item">
          <text class="contact-label">服务时间：</text>
          <text class="contact-value">周一至周日 9:00-18:00</text>
        </view>
      </view>
      <button class="online-service-btn" @click="contactOnlineService">
        在线客服
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [{ name: "服务政策" }, { name: "维修申请" }, { name: "维修网点" }],
      policies: [
        {
          name: "全国联保",
          desc: "全国范围内享受统一的售后服务",
          icon: "https://cdn-icons-png.flaticon.com/128/1255/1255391.png",
        },
        {
          name: "免费保修",
          desc: "标准一年保修，部分产品延长至两年",
          icon: "https://cdn-icons-png.flaticon.com/128/2942/2942834.png",
        },
        {
          name: "7天包换",
          desc: "设备非人为损坏，7天内可申请更换",
          icon: "https://cdn-icons-png.flaticon.com/128/5639/5639670.png",
        },
        {
          name: "上门服务",
          desc: "特定区域可提供免费上门维修服务",
          icon: "https://cdn-icons-png.flaticon.com/128/2830/2830178.png",
        },
      ],
      warrantyInfo: [
        { label: "保修期限", value: "整机1年，主板2年" },
        { label: "电池保修", value: "6个月" },
        { label: "配件保修", value: "3个月（电源适配器、数据线等）" },
        { label: "延保服务", value: "可选购1-2年延长保修服务" },
      ],
      repairForm: {
        model: "",
        sn: "",
        purchaseDate: "",
        problem: "",
        contact: "",
        serviceType: "mail",
      },
      serviceTypes: [
        { name: "邮寄维修", value: "mail" },
        { name: "网点自送", value: "self" },
        { name: "上门服务（仅限特定区域）", value: "door" },
      ],
      selectedRegion: ["广东省", "广州市", "天河区"],
      serviceLocations: [
        {
          name: "广州天河服务中心",
          address: "广州市天河区天河路385号太古汇商场4楼401室",
          phone: "020-88889999",
          businessHours: "10:00-21:00",
          latitude: 23.132324,
          longitude: 113.327104,
        },
        {
          name: "广州越秀服务中心",
          address: "广州市越秀区中山五路68号正佳广场5楼506室",
          phone: "020-88889998",
          businessHours: "10:00-21:00",
          latitude: 23.128596,
          longitude: 113.320204,
        },
      ],
    };
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
    },
    onDateChange(e) {
      this.repairForm.purchaseDate = e.detail.value;
    },
    onServiceTypeChange(e) {
      this.repairForm.serviceType = e.detail.value;
    },
    submitRepairForm() {
      // 表单验证
      if (!this.repairForm.model) {
        uni.showToast({
          title: "请输入设备型号",
          icon: "none",
        });
        return;
      }
      if (!this.repairForm.sn) {
        uni.showToast({
          title: "请输入设备SN码",
          icon: "none",
        });
        return;
      }
      if (!this.repairForm.purchaseDate) {
        uni.showToast({
          title: "请选择购买日期",
          icon: "none",
        });
        return;
      }
      if (!this.repairForm.problem) {
        uni.showToast({
          title: "请描述设备问题",
          icon: "none",
        });
        return;
      }
      if (!this.repairForm.contact) {
        uni.showToast({
          title: "请输入联系方式",
          icon: "none",
        });
        return;
      }

      // 提交表单
      uni.showLoading({
        title: "提交中...",
      });

      // 模拟提交
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: "提交成功",
          icon: "success",
        });

        // 重置表单
        this.repairForm = {
          model: "",
          sn: "",
          purchaseDate: "",
          problem: "",
          contact: "",
          serviceType: "mail",
        };
      }, 1500);
    },
    onRegionChange(e) {
      this.selectedRegion = e.detail.value;

      // 模拟根据地区获取服务网点
      if (this.selectedRegion[1] === "广州市") {
        this.serviceLocations = [
          {
            name: "广州天河服务中心",
            address: "广州市天河区天河路385号太古汇商场4楼401室",
            phone: "020-88889999",
            businessHours: "10:00-21:00",
            latitude: 23.132324,
            longitude: 113.327104,
          },
          {
            name: "广州越秀服务中心",
            address: "广州市越秀区中山五路68号正佳广场5楼506室",
            phone: "020-88889998",
            businessHours: "10:00-21:00",
            latitude: 23.128596,
            longitude: 113.320204,
          },
        ];
      } else {
        // 其他城市暂无服务网点
        this.serviceLocations = [];
      }
    },
    callPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
      });
    },
    openMap(location) {
      uni.openLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        address: location.address,
        scale: 18,
      });
    },
    callServicePhone() {
      uni.makePhoneCall({
        phoneNumber: "4008888888",
      });
    },
    contactOnlineService() {
      uni.showToast({
        title: "正在连接客服...",
        icon: "none",
      });

      // 实际开发中调用客服接口
      // 例如：
      /*
      uni.openCustomerServiceChat({
        extInfo: {url: ''},
        corpId: '',
        success(res) {}
      })
      */
    },
  },
};
</script>

<style>
.service-container {
  padding-bottom: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.service-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background-color: #fff;
}

.service-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.service-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.service-tabs {
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

.service-content {
  padding: 20rpx 30rpx;
}

/* 服务政策样式 */
.policy-card,
.warranty-card,
.form-card {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.policy-header,
.warranty-header,
.form-header {
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.policy-title,
.warranty-title,
.form-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.policy-body {
  padding: 20rpx;
  display: flex;
  flex-wrap: wrap;
}

.policy-item {
  width: 50%;
  padding: 20rpx;
  display: flex;
  align-items: center;
}

.policy-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}

.policy-icon image {
  width: 100%;
  height: 100%;
}

.policy-info {
  flex: 1;
}

.policy-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.policy-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.warranty-body {
  padding: 30rpx;
}

.warranty-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.warranty-label {
  font-size: 28rpx;
  color: #333;
}

.warranty-value {
  font-size: 28rpx;
  color: #666;
}

.warranty-note {
  margin-top: 20rpx;
  background-color: #f9f9f9;
  padding: 20rpx;
  border-radius: 8rpx;
}

.note-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #ff6b00;
  margin-right: 10rpx;
}

.note-content {
  font-size: 24rpx;
  color: #666;
}

/* 维修申请样式 */
.form-body {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.form-input {
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  height: 200rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
}

.picker-view {
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-arrow {
  color: #999;
  font-size: 24rpx;
}

.radio-item {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.radio-item text {
  font-size: 28rpx;
  color: #333;
  margin-left: 10rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin-top: 20rpx;
}

/* 维修网点样式 */
.region-selector {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
}

.location-list {
  padding: 20rpx 0;
}

.location-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.location-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.location-info {
  margin-bottom: 20rpx;
}

.location-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.location-address,
.location-phone,
.location-time {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.location-actions {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-radius: 40rpx;
}

.call-btn {
  background-color: #f0f9ff;
  color: #1296db;
  border: 1px solid #1296db;
}

.map-btn {
  background-color: #1296db;
  color: #fff;
}

/* 联系客服样式 */
.contact-section {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin: 20rpx 30rpx;
}

.contact-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
  text-align: center;
}

.contact-info {
  margin-bottom: 30rpx;
}

.contact-item {
  display: flex;
  margin-bottom: 15rpx;
}

.contact-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.contact-value {
  font-size: 28rpx;
  color: #1296db;
}

.online-service-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}
</style>
