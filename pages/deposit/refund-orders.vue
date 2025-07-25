<template>
  <view class="refund-orders-container">
    
    
    <!-- 记录列表 -->
    <view class="refund-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="refundOrders.length === 0" class="empty-state">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
        <text class="empty-text">暂无退款记录</text>
      </view>
      
      <view v-else>
        <!-- 记录列表项 -->
        <view 
          v-for="(item, index) in refundOrders" 
          :key="index" 
          class="refund-item"
          @click="goToDetail(item._id || item.orderId || item.orderInfo?.id, item)"
        >
          <view class="refund-info">
            <view class="refund-product">{{ item.productName }}</view>
            <view class="refund-amount">¥{{ item.amount }}</view>
          </view>
          
          <view class="refund-meta">
            <view class="refund-order">
              <text class="label">订单号：</text>
              <text class="value">{{ item.orderId }}</text>
            </view>
            <view class="refund-time">
              <text class="label">申请时间：</text>
              <text class="value">{{ formatDate(item.applyTime) }}</text>
            </view>
          </view>
          
          <view class="refund-status">
            <view :class="['status-tag', getStatusClass(item.status)]">{{ getStatusText(item.status) }}</view>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
    </view>
    
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      refundOrders: [],
      userId: "", // 用户ID
    };
  },
  onLoad() {
    // 初始化云环境
    wx.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true,
    });
    
    // 获取用户ID - 这里不再使用，小程序端默认只能查询到自己创建的记录
    this.userId = uni.getStorageSync("userId") || "";
    
    // 加载退款记录
    this.loadRefundOrders();
  },
  
  onShow() {
    // 每次显示页面时都刷新数据，确保能看到最新申请的记录
    this.loadRefundOrders();
    
    // 清除进入详情页时使用的临时缓存
    uni.removeStorageSync("current_refund_detail");
  },
  onPullDownRefresh() {
    this.loadRefundOrders(() => {
      uni.stopPullDownRefresh();
    });
  },
  methods: {
    // 加载退款记录
    loadRefundOrders(callback) {
      this.loading = true;
      
      const db = wx.cloud.database();
      // 不使用userId过滤，直接查询所有记录（小程序端默认只能查询到自己创建的记录）
      
      db.collection("refund_requests")
        .orderBy("applyTime", "desc")
        .get({
          success: (res) => {
            console.log("退款记录查询结果:", res.data);
            this.refundOrders = res.data;
            this.loading = false;
            
            if (typeof callback === "function") {
              callback();
            }
          },
          fail: (err) => {
            console.error("查询退款记录失败:", err);
            this.loading = false;
            uni.showToast({
              title: "加载记录失败",
              icon: "none"
            });
            
            if (typeof callback === "function") {
              callback();
            }
          }
        });
    },
    
    // 格式化日期
    formatDate(dateObj) {
      if (!dateObj) return "";
      
      // 处理云数据库的时间格式
      let date;
      if (typeof dateObj === "object" && dateObj.toDate) {
        date = dateObj.toDate();
      } else if (typeof dateObj === "string") {
        date = new Date(dateObj);
      } else {
        date = new Date(dateObj);
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      
      return `${year}-${month}-${day}`;
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        "待审核": "审核中",
        "已通过": "已通过",
        "已拒绝": "未通过",
        "已退款": "已退款"
      };
      return statusMap[status] || "处理中";
    },
    
    // 获取状态对应的样式类
    getStatusClass(status) {
      if (status === "待审核") {
        return "status-pending";
      } else if (status === "已通过") {
        return "status-approved";
      } else if (status === "已拒绝") {
        return "status-rejected";
      } else if (status === "已退款") {
        return "status-refunded";
      }
      return "";
    },
    
    // 跳转到退押金详情进度页面
    goToDetail(refundId, item) {
      // 显示加载提示
      uni.showLoading({
        title: "加载中...",
        mask: true
      });
      
      console.log("准备跳转到退款详情页，ID:", refundId);
      
      // 如果没有有效ID，直接返回
      if (!refundId) {
        uni.hideLoading();
        uni.showToast({
          title: "无效的记录ID",
          icon: "none"
        });
        return;
      }
      
      // 直接跳转到退款详情页，并传入refundId
      // 每次都直接用ID去查询，不再依赖本地存储
      uni.navigateTo({
        url: `/pages/deposit/pay?id=${refundId}&type=detail&from=records&t=${Date.now()}`,
        success: () => {
          uni.hideLoading();
        },
        fail: (err) => {
          console.error("跳转失败:", err);
          uni.hideLoading();
          uni.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    },
    
    // 跳转到新建退款页
    goToNewRefund() {
      uni.navigateTo({
        url: "/pages/order/list?type=refundable"
      });
    }
  }
};
</script>

<style>
.refund-orders-container {
  padding-bottom: 120rpx;
}

.page-header {
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.header-title {
  font-size: 34rpx;
  font-weight: bold;
  text-align: center;
}

.refund-list {
  padding: 0 30rpx;
}

.loading, .empty-state {
  padding: 100rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.6;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

.refund-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.refund-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.refund-product {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.refund-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff5252;
}

.refund-meta {
  margin-bottom: 20rpx;
}

.refund-order, .refund-time {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.label {
  color: #999;
}

.refund-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx dashed #eee;
}

.status-tag {
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-approved {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-rejected {
  background-color: #fff1f0;
  color: #f5222d;
}

.status-refunded {
  background-color: #f9f0ff;
  color: #722ed1;
}

.arrow {
  color: #ccc;
  font-size: 26rpx;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #f5f5f5;
  z-index: 10;
}

.new-refund-btn {
  width: 100%;
  height: 80rpx;
  background-color: #1296db;
  color: #fff;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}
</style> 