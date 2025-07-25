<template>
  <view class="apply-container">
    <!-- 顶部进度条 -->
    <view class="step-bar">
      <view
        class="step-item"
        :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
      >
        <view class="step-num">1</view>
        <text class="step-text">申请须知</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 1 }"></view>
      <view
        class="step-item"
        :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
      >
        <view class="step-num">2</view>
        <text class="step-text">配送信息</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 2 }"></view>
      <view class="step-item" :class="{ active: currentStep >= 3 }">
        <view class="step-num">3</view>
        <text class="step-text">支付押金</text>
      </view>
    </view>

    <!-- 产品信息展示 -->
    <view class="product-preview" v-if="productInfo">
      <view class="product-preview-inner">
        <image :src="productInfo.image" mode="aspectFit" class="product-preview-image"></image>
        <view class="product-preview-info">
          <text class="product-preview-name">{{productInfo.name}}</text>
          <text class="product-preview-price">押金：¥{{productInfo.deposit}}</text>
          <text class="product-preview-desc">激活后退还押金</text>
        </view>
      </view>
    </view>

    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 步骤1：申请须知 -->
      <view class="form-step" v-if="currentStep === 1">
        <view class="form-title">申请须知</view>
        <view class="notice-content">
          <view class="notice-item">
            <view class="notice-title">申请条件</view>
            <view class="notice-text">1. 年满18周岁，具有完全民事行为能力</view>
            <view class="notice-text">2. 有固定经营场所或稳定收入来源</view>
            <view class="notice-text">3. 提供真实有效的个人信息</view>
        </view>
          
          <view class="notice-item">
            <view class="notice-title">押金说明</view>
            <view class="notice-text">1. 设备押金：¥{{productInfo.deposit}}，激活后全额退还</view>
            <view class="notice-text">2. 退款周期：激活后1-3个工作日到账</view>
            <view class="notice-text">3. 押金用途：保障设备安全及正常使用</view>
        </view>
          
          <view class="notice-item">
            <view class="notice-title">配送说明</view>
            <view class="notice-text">1. 配送范围：全国各省市区县</view>
            <view class="notice-text">2. 配送时间：订单支付后1-3个工作日发货</view>
            <view class="notice-text">3. 运费说明：全国包邮（偏远地区除外）</view>
        </view>
          
          <view class="notice-item">
            <view class="notice-title">售后服务</view>
            <view class="notice-text">1. 质保期：自设备激活之日起1年内</view>
            <view class="notice-text">2. 客服热线：400-888-8888（工作日9:00-18:00）</view>
            <view class="notice-text">3. 提供7*24小时在线技术支持</view>
      </view>

          <view class="agree-terms">
            <checkbox-group @change="onAgreeChange">
              <label class="agree-label">
                <checkbox :checked="formData.agreeTerms" color="#1296db" />
                <text>我已阅读并同意《服务协议》和《隐私政策》</text>
              </label>
            </checkbox-group>
        </view>
        </view>
      </view>

      <!-- 步骤2：配送方式 -->
      <view class="form-step" v-if="currentStep === 2">
        <view class="form-title">选择配送方式</view>
        <view class="delivery-options">
          <view
            class="delivery-option"
            :class="{ active: formData.deliveryType === 0 }"
            @click="formData.deliveryType = 0"
          >
            <view class="option-icon">📦</view>
            <text class="option-text">邮寄配送</text>
          </view>
          <!-- <view
            class="delivery-option"
            :class="{ active: formData.deliveryType === 1 }"
            @click="formData.deliveryType = 1"
          >
            <view class="option-icon">🚚</view>
            <text class="option-text">上门安装</text>
          </view> -->
        </view>

        <!-- 邮寄配送 -->
        <view v-if="formData.deliveryType === 0">
          <view class="form-item">
            <text class="form-label">收货人</text>
            <input
              class="form-input"
              v-model="formData.receiver"
              placeholder="请输入收货人姓名"
            />
          </view>
          <view class="form-item">
            <text class="form-label">联系电话</text>
            <input
              class="form-input"
              v-model="formData.contactPhone"
              placeholder="请输入联系电话"
              type="number"
              maxlength="11"
            />
          </view>
          <view class="form-item">
            <view class="label-with-btn">
            <text class="form-label">收货地址</text>
              <view class="wx-address-btn" @click="chooseWxAddress">使用微信地址</view>
            </view>
            <textarea
              class="form-textarea"
              v-model="formData.deliveryAddress"
              placeholder="请输入收货地址"
            />
          </view>
        </view>

        <!-- 上门安装 -->
        <!-- <view v-if="formData.deliveryType === 1">
          <view class="form-item">
            <text class="form-label">预约时间</text>
            <picker
              mode="date"
              :start="minDate"
              :end="maxDate"
              @change="onDateChange"
              class="form-picker"
            >
              <view class="picker-value">{{
                formData.appointmentDate || "请选择日期"
              }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">时间段</text>
            <picker
              :range="timeSlots"
              @change="onTimeSlotChange"
              class="form-picker"
            >
              <view class="picker-value">{{
                formData.appointmentTime || "请选择时间段"
              }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">安装地址</text>
            <textarea
              class="form-textarea"
              v-model="formData.installAddress"
              placeholder="请输入详细地址"
            />
          </view>
        </view> -->
      </view>

      <!-- 步骤3：押金支付 -->
      <view class="form-step" v-if="currentStep === 3">
        <view class="form-title">支付押金</view>
        <view class="deposit-info">
          <view class="deposit-left">
            <view class="product-name">{{ productInfo.name }}</view>
            <view class="deposit-amount">押金：¥{{ productInfo.deposit }}</view>
            <view class="deposit-tip">押金将在机器激活后退还</view>
          </view>
          <view class="deposit-right">
            <image
              :src="productInfo.image"
              mode="aspectFit"
              class="product-image"
            ></image>
          </view>
        </view>
        <!-- <view class="payment-methods">
          <view
            class="payment-method"
            :class="{ active: formData.paymentMethod === 'wechat' }"
            @click="formData.paymentMethod = 'wechat'"
          >
            <image src="/static/wechat-pay.png" mode="aspectFit"></image>
            <text>微信支付</text>
          </view>
        </view> -->
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="form-actions">
      <button class="prev-btn" v-if="currentStep > 1" @click="prevStep">
        上一步
      </button>
      <button class="next-btn" v-if="currentStep < 3" @click="nextStep">
        下一步
      </button>
      <button class="submit-btn" v-if="currentStep === 3" @click="submitForm">
        确认支付
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const maxDate = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .split("T")[0];

    return {
      currentStep: 1,
      productId: null,
      productInfo: {
        name: "智能POS机A1",
        deposit: 99,
        image: "/static/banner/99-2.jpg",
      },
      formData: {
        agreeTerms: false,
        name: "",
        phone: "",
        address: "",
        deliveryType: 0, // 0-邮寄，1-上门安装
        receiver: "",
        contactPhone: "",
        deliveryAddress: "",
        appointmentDate: "",
        appointmentTime: "",
        installAddress: "",
        paymentMethod: "wechat",
      },

      minDate: minDate,
      maxDate: maxDate,
      timeSlots: ["9:00-12:00", "13:00-17:00", "18:00-21:00"],
    };
  },
  onLoad(options) {
    // 初始化云环境
    wx.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true,
    });

    if (options.productId) {
      this.productId = options.productId;
      this.loadProductInfo();
    } else if (options.bannerId) {
      // 如果是从banner点击进来的，加载对应banner产品信息
      this.loadBannerProductInfo(options.bannerId);
    }
  },
  methods: {
    // 加载产品信息
    loadProductInfo() {
      // 实际项目中应从服务器获取
      // 这里根据productId获取对应产品信息
      console.log("加载产品ID:", this.productId);

      // 模拟不同产品信息
      const productsData = {
        1: {
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png",
        },
        2: {
          name: "乐积分4G传统199版A",
          deposit: 199,
          image: "/static/banner/199-2.png",
        },
        3: {
          name: "乐积分微智能电签199版A",
          deposit: 199,
          image: "/static/banner/199.png",
        },
      };

      // 根据productId获取产品信息
      if (productsData[this.productId]) {
        this.productInfo = productsData[this.productId];
      } else {
        // 默认产品信息
        this.productInfo = {
          name: "智能POS机",
          deposit: 99,
          image: "/static/banner/99-2.jpg",
        };
      }
    },
    
    // 加载Banner对应的产品信息
    loadBannerProductInfo(bannerId) {
      console.log("加载Banner ID:", bannerId);
      
      // 模拟Banner对应的产品信息映射
      const bannerProductMap = {
        1: {
          productId: 1,
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png",
        },
        2: {
          productId: 1,
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png",
        },
        3: {
          productId: 1,
          name: "智能POS机A1 Pro",
          deposit: 99,
          image: "/static/banner/99.png",
        }
      };
      
      // 根据bannerId获取对应产品信息
      if (bannerProductMap[bannerId]) {
        this.productId = bannerProductMap[bannerId].productId;
        this.productInfo = bannerProductMap[bannerId];
      } else {
        // 默认产品信息
        this.productInfo = {
          name: "智能POS机",
          deposit: 99,
          image: "/static/banner/99-2.jpg",
        };
      }
    },

    // 上一步
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    // 下一步
    nextStep() {
      // 验证当前步骤表单
      if (!this.validateCurrentStep()) {
        return;
      }

      if (this.currentStep < 4) {
        this.currentStep++;
      }
    },

    // 验证当前步骤
    validateCurrentStep() {
      switch (this.currentStep) {
        case 1: // 申请须知验证
          if (!this.formData.agreeTerms) {
            uni.showToast({
              title: "请阅读并同意相关条款",
              icon: "none",
            });
            return false;
          }
          break;

        case 2: // 配送方式验证
          if (this.formData.deliveryType === 0) {
            if (!this.formData.receiver) {
              uni.showToast({
                title: "请输入收货人姓名",
                icon: "none",
              });
              return false;
            }
            if (
              !this.formData.contactPhone ||
              !/^1\d{10}$/.test(this.formData.contactPhone)
            ) {
              uni.showToast({
                title: "请输入正确的联系电话",
                icon: "none",
              });
              return false;
            }
            if (!this.formData.deliveryAddress) {
              uni.showToast({
                title: "请输入收货地址",
                icon: "none",
              });
              return false;
            }
          }
          break;
      }
      return true;
    },

    // 提交表单
    async submitForm() {
      // 表单校验
      if (!this.validateForm()) {
        return;
      }

      // 显示加载状态
      uni.showLoading({
        title: "处理中...",
      });

      // 获取微信用户信息
      const wxUserInfo = await this.getUserInfo();

      // 获取已登录用户ID（如果已登录）
      const userId = uni.getStorageSync("userId");

      // 准备要存储的数据
      const orderData = {
        // 基本信息 - 从配送信息中获取
        name: this.formData.receiver || "",
        phone: this.formData.contactPhone || "",
        // 配送方式
        deliveryType: this.formData.deliveryType,
        receiver: this.formData.receiver,
        contactPhone: this.formData.contactPhone,
        deliveryAddress: this.formData.deliveryAddress,
        // 产品信息
        productId: this.productId,
        productName: this.productInfo.name,
        deposit: this.productInfo.deposit,
        productImage: this.productInfo.image,
        // 订单信息
        status: "待审核",
        createTime: new Date(),
        paymentMethod: this.formData.paymentMethod,
        // 用户信息关联
        wxUserInfo: wxUserInfo,
        userId: userId || null, // 关联用户ID（已登录用户）
      };

      // 保存到云数据库
      const db = wx.cloud.database();
      db.collection("user").add({
        data: orderData,
        success: (res) => {
          console.log("保存成功，记录ID：", res._id);
          uni.hideLoading();
          uni.showToast({
            title: "支付成功",
            icon: "success",
          });

          // 跳转到订单页面(tabbar页面)
          setTimeout(() => {
            // 先将订单ID存入本地缓存，以便在订单页面获取
            uni.setStorageSync("currentOrderId", res._id);

            // 直接使用switchTab跳转到订单页(tabbar页面)
            uni.switchTab({
              url: "/pages/order/index",
              success: () => {
                console.log("成功跳转到订单页面");
              },
              fail: (err) => {
                console.error("跳转失败", err);
                // 如果跳转失败，尝试返回首页
                uni.switchTab({
                  url: "/pages/index/index",
                });
              },
            });
          }, 1500);
        },
        fail: (err) => {
          console.error("保存失败：", err);
          uni.hideLoading();
          uni.showToast({
            title: "提交失败，请重试",
            icon: "none",
          });
        },
      });
    },

    // 表单验证
    validateForm() {
      // 验证基本信息
      if (this.currentStep === 3) {
        // 申请须知验证
        if (!this.formData.agreeTerms) {
          uni.showToast({
            title: "请阅读并同意相关条款",
            icon: "none",
          });
          return false;
        }




        // 配送信息验证
        if (this.formData.deliveryType === 0) {
          if (!this.formData.receiver) {
            uni.showToast({
              title: "请输入收货人姓名",
              icon: "none",
            });
            return false;
          }
          if (
            !this.formData.contactPhone ||
            !/^1\d{10}$/.test(this.formData.contactPhone)
          ) {
            uni.showToast({
              title: "请输入正确的联系电话",
              icon: "none",
            });
            return false;
          }
          if (!this.formData.deliveryAddress) {
            uni.showToast({
              title: "请输入收货地址",
              icon: "none",
            });
            return false;
          }
        }
      }

      return true;
    },



    // 日期变化
    onDateChange(e) {
      this.formData.appointmentDate = e.detail.value;
    },

    // 同意条款变化
    onAgreeChange(e) {
      this.formData.agreeTerms = e.detail.value.length > 0;
    },

    // 时间段变化
    onTimeSlotChange(e) {
      this.formData.appointmentTime = this.timeSlots[e.detail.value];
    },

    // 上传图片
    uploadImage(field) {
      const that = this;
      uni.chooseImage({
        count: 1,
        success(res) {
          const tempFilePath = res.tempFilePaths[0];

          // 显示上传中
          uni.showLoading({
            title: "上传中...",
          });

          // 设置本地预览
          that.formData[field] = tempFilePath;

          // 上传到云存储
          const cloudPath = `idcard/${field}_${new Date().getTime()}${
            tempFilePath.match(/\.[^.]+?$/)[0]
          }`;

          wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: tempFilePath,
            success: (res) => {
              console.log("上传成功", res);
              // 更新为云存储路径
              that.formData[field + "Cloud"] = res.fileID;
              uni.hideLoading();
              uni.showToast({
                title: "上传成功",
                icon: "success",
              });
            },
            fail: (err) => {
              console.error("上传失败", err);
              uni.hideLoading();
              uni.showToast({
                title: "上传失败，请重试",
                icon: "none",
              });
            },
          });
        },
      });
    },

    // 选择微信地址
    chooseWxAddress() {
      const that = this;
      // 调用微信地址选择器
      uni.chooseAddress({
        success(res) {
          console.log('获取微信地址成功', res);
          // 拼接完整地址
          const fullAddress = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`;
          
          // 更新表单数据
          that.formData.receiver = res.userName;
          that.formData.contactPhone = res.telNumber;
          that.formData.deliveryAddress = fullAddress;
          
          uni.showToast({
            title: '地址导入成功',
            icon: 'success'
          });
        },
        fail(err) {
          console.error('获取地址失败', err);
          if (err.errMsg.indexOf('auth deny') > -1) {
            uni.showModal({
              title: '提示',
              content: '请在微信设置中允许小程序访问通讯地址',
              showCancel: false
            });
          } else {
            uni.showToast({
              title: '获取地址失败',
              icon: 'none'
            });
          }
        }
      });
    },

    // 获取用户信息
    async getUserInfo() {
      return new Promise((resolve) => {
        // 获取微信用户信息
        uni.getUserInfo({
          success: (res) => {
            resolve(res.userInfo);
          },
          fail: () => {
            // 如果获取失败，返回空对象
            resolve({});
          },
        });
      });
    },
  },
};
</script>

<style>
.apply-container {
  padding-bottom: 120rpx;
}

.step-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-num {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #ddd;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-bottom: 10rpx;
}

.step-text {
  font-size: 24rpx;
  color: #999;
}

.step-line {
  flex: 1;
  height: 2rpx;
  background-color: #ddd;
  margin: 0 10rpx;
}

.step-item.active .step-num {
  background-color: #1296db;
}

.step-item.active .step-text {
  color: #1296db;
}

.step-item.completed .step-num {
  background-color: #67c23a;
}

.step-line.active {
  background-color: #67c23a;
}

.product-preview {
  background-color: #fff;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
}

.product-preview-inner {
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #eee;
  padding-bottom: 20rpx;
}

.product-preview-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.product-preview-info {
  flex: 1;
}

.product-preview-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.product-preview-price {
  font-size: 30rpx;
  color: #ff6700;
  margin-bottom: 10rpx;
  display: block;
}

.product-preview-desc {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.form-content {
  padding: 30rpx;
  background-color: #fff;
}

.form-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.form-input,
.form-textarea,
.form-picker {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea {
  height: 160rpx;
  padding: 20rpx;
  line-height: 1.6;
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  color: #333;
}

.upload-box {
  width: 100%;
  height: 300rpx;
  border: 1px dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-box image {
  width: 100%;
  height: 100%;
}

.upload-text {
  font-size: 28rpx;
  color: #999;
}

.delivery-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.delivery-option {
  flex: 1;
  height: 160rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  margin: 0 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.delivery-option:first-child {
  margin-left: 0;
}

.delivery-option:last-child {
  margin-right: 0;
}

.delivery-option.active {
  border-color: #1296db;
  background-color: rgba(18, 150, 219, 0.05);
}

.option-icon {
  font-size: 48rpx;
  margin-bottom: 15rpx;
}

.option-text {
  font-size: 28rpx;
  color: #333;
}

.deposit-info {
  padding: 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deposit-left {
  flex: 1;
}

.deposit-right {
  width: 220rpx;
  margin-left: 20rpx;
}

.product-image {
  width: 100%;
  height: 220rpx;
  border-radius: 8rpx;
}

.product-name {
  font-size: 32rpx;
  margin-bottom: 15rpx;
}

.deposit-amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff6700;
  margin-bottom: 15rpx;
}

.deposit-tip {
  font-size: 24rpx;
  color: #999;
}

.payment-methods {
  display: flex;
  margin-bottom: 30rpx;
}

.payment-method {
  flex: 1;
  height: 120rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
}

.payment-method.active {
  border-color: #1296db;
}

.payment-method image {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.form-actions {
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

.prev-btn,
.next-btn,
.submit-btn {
  flex: 1;
  height: 100%;
  margin: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}

.prev-btn {
  background-color: #fff;
  color: #666;
}

.next-btn,
.submit-btn {
  background-color: #1296db;
  color: #fff;
}

.notice-content {
  padding: 20rpx 0;
}

.notice-item {
  margin-bottom: 30rpx;
}

.notice-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #333;
}

.notice-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 10rpx;
  padding-left: 10rpx;
}

.agree-terms {
  margin-top: 40rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.agree-label {
  display: flex;
  align-items: center;
  font-size: 26rpx;
}

.agree-label text {
  margin-left: 10rpx;
}

.label-with-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.wx-address-btn {
  font-size: 24rpx;
  color: #1296db;
  background-color: rgba(18, 150, 219, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
}
</style>
