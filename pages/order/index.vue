<template>
  <view class="order-status-container">
    <!-- 订单基本信息 -->
    <view class="status-card">
      <view class="status-header">
        <text class="status-title">订单信息</text>
        <!-- <text class="order-id">订单号: {{ orderId }}</text> -->
      </view>

      <!-- 产品信息 -->
      <view class="product-info">
        <image
          class="product-image"
          :src="orderInfo.productImage"
          mode="aspectFill"
        ></image>
        <view class="product-details">
          <view class="product-name">{{ orderInfo.productName }}</view>

          <view class="deposit-amount">押金：¥{{ orderInfo.deposit }}</view>
          <view class="apply-time">申请时间：{{ orderInfo.applyTime }}</view>
        </view>
      </view>
    </view>

    <!-- 物流状态 -->
    <view class="logistics-card">
      <view class="section-title">物流状态</view>

      <!-- 物流进度条 -->
      <view class="logistics-progress">
        <view class="progress-line"></view>
        <view
          class="progress-item"
          :class="{
            active: logisticsInfo.status >= 1,
            current: logisticsInfo.status === 1,
          }"
        >
          <view class="progress-dot"></view>
          <view class="progress-text">审核通过</view>
          <view class="progress-time" v-if="logisticsInfo.status >= 1">{{
            logisticsInfo.approveTime || ""
          }}</view>
        </view>
        <view
          class="progress-item"
          :class="{
            active: logisticsInfo.status >= 2,
            current: logisticsInfo.status === 2,
          }"
        >
          <view class="progress-dot"></view>
          <view class="progress-text">已发货</view>
          <view class="progress-time" v-if="logisticsInfo.status >= 2">{{
            logisticsInfo.shipTime || ""
          }}</view>
        </view>
        <view
          class="progress-item"
          :class="{
            active: logisticsInfo.status >= 3,
            current: logisticsInfo.status === 3,
          }"
        >
          <view class="progress-dot"></view>
          <view class="progress-text">运输中</view>
          <view class="progress-time" v-if="logisticsInfo.status >= 3">{{
            logisticsInfo.updateTime || ""
          }}</view>
        </view>
        <view
          class="progress-item"
          :class="{
            active: logisticsInfo.status >= 4,
            current: logisticsInfo.status === 4,
          }"
        >
          <view class="progress-dot"></view>
          <view class="progress-text">已签收</view>
          <view class="progress-time" v-if="logisticsInfo.status === 4">{{
            logisticsInfo.deliveryTime || ""
          }}</view>
        </view>
      </view>

      <!-- 物流信息 -->
      <view class="logistics-info" v-if="logisticsInfo.status >= 2">
        <view class="detail-item">
          <text class="detail-label">物流公司</text>
          <text class="detail-value">{{
            logisticsInfo.company || "顺丰速运"
          }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">物流单号</text>
          <view class="address-wrap">
            <text class="detail-value">{{
              logisticsInfo.trackingNumber || ""
            }}</text>
            <text class="copy-btn" @click="copyTrackingNumber">复制</text>
          </view>
        </view>
      </view>

      <!-- 物流明细 -->
      <view
        class="logistics-details"
        v-if="
          logisticsInfo.status >= 2 &&
          logisticsInfo.details &&
          logisticsInfo.details.length
        "
      >
        <view class="info-title">物流明细</view>
        <view class="logistics-timeline">
          <view
            class="timeline-item"
            v-for="(item, index) in logisticsInfo.details"
            :key="index"
            :class="{ 'first-item': index === 0 }"
          >
            <view class="timeline-dot"></view>
            <view class="timeline-content">
              <view class="timeline-message">{{ item.message }}</view>
              <view class="timeline-time">{{ item.time }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 暂无物流信息 -->
      <view class="no-logistics" v-if="logisticsInfo.status < 2">
        <text>订单已审核通过，等待发货中</text>
      </view>
    </view>

    <!-- 客户信息 -->
    <view class="customer-info">
     <!-- <view class="section-title">客户信息</view>

      <view class="info-group">
        <view class="info-title">基本资料</view>
        <view class="detail-item">
          <text class="detail-label">姓名</text>
          <text class="detail-value">{{ orderInfo.name }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">手机号</text>
          <text class="detail-value">{{ orderInfo.phone }}</text>
        </view>
      </view> -->



      <view class="info-group">
        <view class="info-title">收货信息</view>
        <view class="detail-item">
          <text class="detail-label">收货人</text>
          <text class="detail-value">{{ orderInfo.receiver }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">联系电话</text>
          <text class="detail-value">{{ orderInfo.contactPhone }}</text>
        </view>
        <view class="detail-item address-item">
          <text class="detail-label">收货地址</text>
          <view class="address-wrap">
            <text class="detail-value address">{{
              orderInfo.deliveryAddress
            }}</text>
            <text class="copy-btn" @click="copyAddress">复制</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="action-buttons">
      <button class="action-btn primary" @click="contactService">
        联系客服
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      orderInfo: {
        productName: "",
        productImage: "",
        deposit: 0,
        applyTime: "",
        name: "",
        phone: "",
        receiver: "",
        contactPhone: "",
        deliveryAddress: "",
      },
      logisticsInfo: {
        status: 1,
        approveTime: "",
        shipTime: "",
        company: "",
        trackingNumber: "",
        details: [],
        deliveryTime: "",
        updateTime: "",
      },
    };
  },

  onShow() {
    // 每次显示页面时尝试获取订单信息
    const savedOrderId = uni.getStorageSync("currentOrderId");
    if (savedOrderId && (!this.orderId || this.orderId !== savedOrderId)) {
      this.orderId = savedOrderId;
      this.loadOrderInfo();
    }
  },

  onLoad(options) {
    console.log("订单页面加载，参数：", options);
    console.log("本地存储的订单ID：", uni.getStorageSync("currentOrderId"));

    // 获取订单ID，优先从参数获取，其次从本地缓存获取
    if (options && options.id) {
      this.orderId = options.id;
      this.loadOrderInfo();
    } else {
      // 从本地缓存获取订单ID
      const savedOrderId = uni.getStorageSync("currentOrderId");
      if (savedOrderId) {
        this.orderId = savedOrderId;
        this.loadOrderInfo();
      } else {
        console.log("未找到订单ID");
        // 设置一个默认订单ID，避免显示错误
        this.loadDemoData();
      }
    }
  },

  onPullDownRefresh() {
    this.loadOrderInfo(() => {
      uni.stopPullDownRefresh();
    });
  },

  methods: {
    // 加载演示数据（当没有找到订单ID时使用）
    loadDemoData() {
      console.log("加载演示数据");

      // 生成一个示例订单
      const currentTime = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const createTime = new Date(currentTime - oneDay * 2);

      // 更新订单信息
      this.orderInfo = {
        productName: "智能POS机",
        productImage: "/static/banner/99-2.jpg",
                        deposit: 99,
                applyTime: this.formatDate(createTime),
                name: "测试用户",
                phone: "138****8888",
        receiver: "测试用户",
        contactPhone: "138****8888",
        deliveryAddress: "广东省深圳市南山区科技园南区8栋101",
      };

      // 生成物流信息 - 默认设为已发货状态(2)
      this.loadLogisticsDemoData(createTime, 2);

      uni.hideLoading();
    },

    // 加载演示物流数据
    loadLogisticsDemoData(createTime, defaultStatus) {
      const currentTime = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const timeDiff = currentTime - createTime;

      // 根据默认状态或时间差确定物流状态
      let status = defaultStatus || 1;

      if (!defaultStatus) {
        if (timeDiff > oneDay * 3) {
          status = 4; // 已签收
        } else if (timeDiff > oneDay * 1.5) {
          status = 3; // 运输中
        } else if (timeDiff > oneDay * 0.5) {
          status = 2; // 已发货
        } else {
          status = 1; // 审核通过
        }
      }

      this.logisticsInfo.status = status;

      // 根据状态设置物流信息
      if (status >= 1) {
        this.logisticsInfo.approveTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 0.2)
        );
      }

      if (status >= 2) {
        this.logisticsInfo.shipTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 0.5)
        );
        this.logisticsInfo.company = "顺丰速运";
        this.logisticsInfo.trackingNumber =
          "SF" + Math.floor(1000000000 + Math.random() * 9000000000);
        this.logisticsInfo.details = [
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 0.5)
            ),
            message: "您的快递已由【深圳发货中心】揽收，开始分拣",
          },
        ];
      }

      if (status >= 3) {
        this.logisticsInfo.updateTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 1)
        );

        // 添加更多物流信息
        this.logisticsInfo.details.unshift(
          {
            time: this.formatDate(new Date(createTime.getTime() + oneDay * 1)),
            message: "快递已从【深圳集散中心】发出，下一站【广州转运中心】",
          },
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 0.7)
            ),
            message: "快递到达【深圳集散中心】，正在分拣",
          }
        );
      }

      if (status >= 4) {
        this.logisticsInfo.deliveryTime = this.formatDate(
          new Date(createTime.getTime() + oneDay * 2.5)
        );

        // 添加签收信息
        this.logisticsInfo.details.unshift(
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 2.5)
            ),
            message: "您的快递已签收，签收人：本人",
          },
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 2.2)
            ),
            message:
              "快递已到达【广州市天河区网点】，快递员【李师傅，电话：13800138000】正在派送",
          },
          {
            time: this.formatDate(
              new Date(createTime.getTime() + oneDay * 1.5)
            ),
            message: "快递已到达【广州转运中心】，准备发往下一站",
          }
        );
      }
    },

    // 加载订单信息
    loadOrderInfo(callback) {
      console.log("开始加载订单信息:", this.orderId);

      // 如果没有订单ID，直接加载演示数据
      if (!this.orderId) {
        console.log("没有订单ID，加载演示数据");
        this.loadDemoData();
        if (typeof callback === "function") {
          callback();
        }
        return;
      }

      // 初始化云环境（如果尚未初始化）
      try {
        if (!wx.cloud || !wx.cloud.$isInitialized) {
          wx.cloud.init({
            env: "cloud1-9grox8bwd6dbce0c",
            traceUser: true,
          });
        }
      } catch (error) {
        console.error("初始化云环境失败:", error);
        this.loadDemoData();
        if (typeof callback === "function") {
          callback();
        }
        return;
      }

      uni.showLoading({
        title: "加载中...",
      });

      try {
        // 从云数据库获取订单信息
        const db = wx.cloud.database();
        db.collection("user")
          .doc(this.orderId)
          .get({
            success: async (res) => {
              console.log("获取到的订单数据:", res.data);
              if (!res.data) {
                console.log("未找到订单数据，加载演示数据");
                this.loadDemoData();
                uni.hideLoading();
                if (typeof callback === "function") {
                  callback();
                }
                return;
              }

              const orderData = res.data;

              // 更新订单信息
              this.orderInfo = {
                productName: orderData.productName || "智能POS机",
                productImage:
                  orderData.productImage || "/static/banner/99-2.jpg",
                deposit: orderData.deposit || 99,
                applyTime:
                  this.formatDate(orderData.createTime) ||
                  new Date().toLocaleString(),
                name: orderData.name || "",
                phone: orderData.phone || "",
                receiver: orderData.receiver || orderData.name || "",
                contactPhone: orderData.contactPhone || orderData.phone || "",
                deliveryAddress: orderData.deliveryAddress || "未提供地址",
              };

              // 如果有物流单号，查询实时物流信息
              if (
                orderData.logisticsTrackingNumber &&
                orderData.logisticsCompany
              ) {
                try {
                  const logisticsResult = await wx.cloud.callFunction({
                    name: "getLogistics",
                    data: {
                      trackingNumber: orderData.logisticsTrackingNumber,
                      company: orderData.logisticsCompany,
                    },
                  });

                  if (logisticsResult.result.code === 0) {
                    const realLogistics = logisticsResult.result.data;

                    // 将物流状态码转换为我们的状态码
                    const statusMap = {
                      0: 2, // 在途
                      1: 4, // 已签收
                      2: 2, // 疑难
                      3: 2, // 已退签
                      4: 2, // 已退回
                      5: 2, // 派送中
                      6: 2, // 退回中
                    };

                    this.logisticsInfo = {
                      status: statusMap[realLogistics.status] || 2,
                      approveTime: this.formatDate(
                        orderData.logisticsApproveTime
                      ),
                      shipTime: this.formatDate(orderData.logisticsShipTime),
                      company: realLogistics.company,
                      trackingNumber: realLogistics.trackingNumber,
                      details: realLogistics.traces
                        .map((item) => ({
                          time: item.time,
                          message: item.context,
                        }))
                        .reverse(),
                      deliveryTime:
                        realLogistics.status === "1"
                          ? realLogistics.traces[0]?.time
                          : "",
                      updateTime: realLogistics.traces[0]?.time,
                    };
                  } else {
                    console.error(
                      "获取物流信息失败:",
                      logisticsResult.result.msg
                    );
                    this.loadLogisticsDemoData(new Date(orderData.createTime));
                  }
                } catch (error) {
                  console.error("查询物流信息失败:", error);
                  this.loadLogisticsDemoData(new Date(orderData.createTime));
                }
              } else {
                // 如果没有物流信息，加载演示数据
                this.loadLogisticsDemoData(new Date(orderData.createTime));
              }

              uni.hideLoading();
              console.log("订单数据加载完成");

              if (typeof callback === "function") {
                callback();
              }
            },
            fail: (err) => {
              console.error("获取订单数据失败:", err);
              this.loadDemoData();
              uni.hideLoading();
              if (typeof callback === "function") {
                callback();
              }
            },
          });
      } catch (error) {
        console.error("查询订单数据异常:", error);
        this.loadDemoData();
        uni.hideLoading();
        if (typeof callback === "function") {
          callback();
        }
      }
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return "";

      // 如果是字符串格式的日期，转换为Date对象
      if (typeof date === "string") {
        date = new Date(date);
      } else if (date.toDate && typeof date.toDate === "function") {
        // 处理云数据库的Timestamp类型
        date = date.toDate();
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    // 复制地址
    copyAddress() {
      uni.setClipboardData({
        data: this.orderInfo.deliveryAddress,
        success: () => {
          uni.showToast({
            title: "地址已复制",
            icon: "success",
          });
        },
      });
    },

    // 复制物流单号
    copyTrackingNumber() {
      uni.setClipboardData({
        data: this.logisticsInfo.trackingNumber,
        success: () => {
          uni.showToast({
            title: "物流单号已复制",
            icon: "success",
          });
        },
      });
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


  },
};
</script>

<style>
.order-status-container {
  padding: 30rpx;
  padding-bottom: 120rpx;
  background-color: #f6f6f6;
}

.status-card,
.customer-info {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.status-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.status-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
}

.order-id {
  font-size: 24rpx;
  color: #999;
}

/* 产品信息样式 */
.product-info {
  display: flex;
  padding: 20rpx 0;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background-color: #f8f8f8;
}

.product-details {
  flex: 1;
  margin-left: 20rpx;
  padding-top: 10rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.product-spec {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.deposit-amount {
  font-size: 30rpx;
  color: #ff6700;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.apply-time {
  font-size: 24rpx;
  color: #999;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-group {
  margin-bottom: 30rpx;
}

.info-group:last-child {
  margin-bottom: 0;
}

.info-title {
  font-size: 28rpx;
  color: #1296db;
  padding: 15rpx 0;
  border-bottom: 1rpx dashed #eee;
  margin-bottom: 10rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  font-size: 28rpx;
}

.detail-label {
  color: #666;
  min-width: 160rpx;
}

.detail-value {
  color: #333;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

.address-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.detail-value.address {
  margin-right: 10rpx;
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  font-size: 24rpx;
  color: #1296db;
  background-color: #ecf5ff;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  white-space: nowrap;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  background-color: #fff;
  border-top: 1rpx solid #f5f5f5;
  z-index: 100;
}

.action-btn {
  flex: 1;
  height: 100%;
  margin: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}

.action-btn.primary {
  background-color: #1296db;
  color: #fff;
}

/* 物流状态样式 */
.logistics-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.logistics-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40rpx 0;
  position: relative;
}

.progress-line {
  position: absolute;
  top: 10rpx;
  left: 0;
  right: 0;
  height: 2rpx;
  background-color: #eaeaea;
  z-index: 1;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  width: 25%;
}

.progress-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #eaeaea;
  border: 4rpx solid #fff;
  box-shadow: 0 0 0 2rpx #eaeaea;
  margin-bottom: 15rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  white-space: nowrap;
}

.progress-time {
  font-size: 20rpx;
  color: #bbb;
  margin-top: 8rpx;
  text-align: center;
}

.progress-item.active .progress-dot {
  background-color: #1296db;
  box-shadow: 0 0 0 2rpx #1296db;
}

.progress-item.active .progress-text {
  color: #333;
}

.progress-item.current .progress-dot {
  width: 24rpx;
  height: 24rpx;
  background-color: #1296db;
  box-shadow: 0 0 0 2rpx #1296db, 0 0 0 6rpx rgba(18, 150, 219, 0.2);
}

.progress-item.current .progress-text {
  color: #1296db;
  font-weight: bold;
}

.logistics-details {
  border-top: 1rpx solid #f5f5f5;
  padding-top: 20rpx;
  margin-top: 20rpx;
}

.logistics-timeline {
  margin: 20rpx 0;
  padding-left: 10rpx;
}

.timeline-item {
  position: relative;
  padding-left: 30rpx;
  padding-bottom: 30rpx;
  border-left: 2rpx solid #eaeaea;
}

.timeline-item:last-child {
  padding-bottom: 0;
  border-left-color: transparent;
}

.timeline-item.first-item .timeline-message {
  color: #1296db;
  font-weight: bold;
}

.timeline-item.first-item .timeline-dot {
  background-color: #1296db;
  border-color: #1296db;
}

.timeline-dot {
  position: absolute;
  left: -10rpx;
  top: 6rpx;
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background-color: #fff;
  border: 2rpx solid #ddd;
}

.timeline-content {
  margin-bottom: 10rpx;
}

.timeline-message {
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
}

.timeline-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}

.no-logistics {
  text-align: center;
  color: #999;
  font-size: 26rpx;
  padding: 40rpx 0;
}
</style>
