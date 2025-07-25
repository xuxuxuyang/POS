<template>
  <view class="order-container">
    <!-- 顶部标签栏 -->
    <view class="tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: currentTab === index }"
        @click="switchTab(index)"
      >
        <text>{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view 
      scroll-y 
      class="order-list" 
      @scrolltolower="loadMoreOrders"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-if="orders.length > 0">
        <view 
          class="order-item" 
          v-for="(order, index) in orders" 
          :key="index"
          @click="goToOrderDetail(order._id)"
        >
          <view class="order-header">
            <view class="order-number">订单号：{{ order.orderNumber }}</view>
            <view class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</view>
          </view>
          
          <view class="order-product">
            <image :src="order.productImage" class="product-image"></image>
            <view class="product-info">
              <view class="product-name">{{ order.productName }}</view>
              <view class="product-spec">{{ order.productSpec }}</view>
              <view class="product-price">
                <text class="price-symbol">¥</text>
                <text class="price-value">{{ order.price }}</text>
                <text class="price-count">x{{ order.quantity }}</text>
              </view>
            </view>
          </view>
          
          <view class="order-footer">
            <view class="order-time">{{ formatDate(order.createTime) }}</view>
            <view class="order-total">合计：<text class="total-amount">¥{{ order.totalAmount }}</text></view>
          </view>
          
          <view class="order-actions">
            <view class="action-btn cancel" v-if="order.status === '待审核' || order.status === '待发货'" @click.stop="cancelOrder(order._id)">取消订单</view>
            <view class="action-btn pay" v-if="order.status === '待支付'" @click.stop="payOrder(order._id)">立即支付</view>
            <view class="action-btn track" v-if="order.status === '已发货'" @click.stop="trackOrder(order._id)">查看物流</view>
            <view class="action-btn confirm" v-if="order.status === '已发货'" @click.stop="confirmOrder(order._id)">确认收货</view>
            <view class="action-btn review" v-if="order.status === '已完成' && !order.hasReviewed" @click.stop="reviewOrder(order._id)">评价订单</view>
            <view class="action-btn rebuy" v-if="order.status === '已完成'" @click.stop="rebuyOrder(order)">再次购买</view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="orders.length === 0 && !isLoading">
        <image src="https://cdn-icons-png.flaticon.com/128/4076/4076432.png" class="empty-icon"></image>
        <view class="empty-text">暂无相关订单</view>
        <view class="action-btn browse" @click="browsePOS">浏览POS机</view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-state" v-if="isLoading && !isRefreshing">
        <view class="loading-icon"></view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 加载完成 -->
      <view class="loading-complete" v-if="!hasMore && orders.length > 0 && !isLoading">
        <text>— 已经到底了 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: ['全部', '待审核', '待发货', '已发货', '已完成'],
      currentTab: 0,
      orders: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      isLoading: false,
      isRefreshing: false,
      orderType: 'all' // 默认加载全部订单
    }
  },
  onLoad(options) {
    // 如果有传入类型参数，切换到对应标签
    if (options.type) {
      switch(options.type) {
        case 'pending':
          this.currentTab = 1;
          this.orderType = 'pending';
          break;
        case 'approved':
          this.currentTab = 2;
          this.orderType = 'approved';
          break;
        case 'shipped':
          this.currentTab = 3;
          this.orderType = 'shipped';
          break;
        case 'completed':
          this.currentTab = 4;
          this.orderType = 'completed';
          break;
        default:
          this.currentTab = 0;
          this.orderType = 'all';
      }
    }
    
    // 加载订单数据
    this.loadOrders();
  },
  methods: {
    // 切换标签
    switchTab(index) {
      if (this.currentTab === index) return;
      this.currentTab = index;
      this.page = 1;
      this.orders = [];
      this.hasMore = true;
      
      // 根据标签设置加载的订单类型
      switch(index) {
        case 0:
          this.orderType = 'all';
          break;
        case 1:
          this.orderType = 'pending';
          break;
        case 2:
          this.orderType = 'approved';
          break;
        case 3:
          this.orderType = 'shipped';
          break;
        case 4:
          this.orderType = 'completed';
          break;
      }
      
      this.loadOrders();
    },
    
    // 加载订单数据
    loadOrders() {
      if (!this.hasMore || this.isLoading) return;
      
      this.isLoading = true;
      
      // 检查登录状态
      const userId = uni.getStorageSync('userId');
      if (!userId) {
        this.isLoading = false;
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      // 根据订单类型设置查询条件
      let statusCondition = {};
      switch(this.orderType) {
        case 'pending':
          statusCondition = '待审核';
          break;
        case 'approved':
          statusCondition = '待发货';
          break;
        case 'shipped':
          statusCondition = '已发货';
          break;
        case 'completed':
          statusCondition = '已完成';
          break;
      }
      
      // 模拟从云数据库加载数据
      setTimeout(() => {
        // 在真实项目中，应从云数据库查询
        // const db = wx.cloud.database();
        // db.collection('orders')
        //   .where({
        //     userId: userId,
        //     ...(this.orderType !== 'all' ? { status: statusCondition } : {})
        //   })
        //   .skip((this.page - 1) * this.pageSize)
        //   .limit(this.pageSize)
        //   .orderBy('createTime', 'desc')
        //   .get()
        //   .then(res => { ... })
        
        // 模拟数据
        const mockOrders = this.getMockOrders(statusCondition);
        
        // 追加数据
        this.orders = this.page === 1 ? mockOrders : [...this.orders, ...mockOrders];
        
        // 判断是否还有更多数据
        this.hasMore = mockOrders.length === this.pageSize;
        
        // 页码增加
        this.page++;
        
        this.isLoading = false;
        
        // 如果是下拉刷新，结束刷新状态
        if (this.isRefreshing) {
          this.isRefreshing = false;
        }
      }, 800);
    },
    
    // 获取模拟订单数据
    getMockOrders(status) {
      // 模拟不同状态的订单数据
      const mockData = [];
      const startIndex = (this.page - 1) * this.pageSize;
      const maxItems = this.page === 1 ? Math.min(5, this.pageSize) : Math.min(3, this.pageSize); // 模拟第一页有5条，后续页有3条
      
      for (let i = 0; i < maxItems; i++) {
        const orderIndex = startIndex + i;
        const randomPrice = Math.floor(Math.random() * 1000 + 500);
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        let orderStatus = status;
        if (!status) {
          // 全部订单时随机状态
          const statuses = ['待审核', '待发货', '已发货', '已完成'];
          orderStatus = statuses[Math.floor(Math.random() * statuses.length)];
        }
        
        mockData.push({
          _id: 'order_' + orderIndex,
          orderNumber: 'POS' + (1000000 + orderIndex).toString(),
          status: orderStatus,
          productName: 'POS机' + ['标准版', '高级版', 'Pro版', '商用版'][Math.floor(Math.random() * 4)],
          productSpec: ['蓝牙连接', 'WiFi连接', '4G连接'][Math.floor(Math.random() * 3)],
          productImage: [
            'https://img01.yzcdn.cn/vant/cat.jpeg',
            'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
            'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
          ][Math.floor(Math.random() * 3)],
          price: randomPrice,
          quantity: quantity,
          totalAmount: (randomPrice * quantity).toFixed(2),
          createTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          hasReviewed: Math.random() > 0.5 // 随机是否已评价
        });
      }
      
      return mockData;
    },
    
    // 加载更多订单
    loadMoreOrders() {
      this.loadOrders();
    },
    
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.orders = [];
      this.hasMore = true;
      this.loadOrders();
    },
    
    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    // 获取状态对应的样式类
    getStatusClass(status) {
      switch(status) {
        case '待审核':
          return 'status-pending';
        case '待发货':
          return 'status-approved';
        case '已发货':
          return 'status-shipped';
        case '已完成':
          return 'status-completed';
        default:
          return '';
      }
    },
    
    // 跳转到订单详情
    goToOrderDetail(orderId) {
      uni.navigateTo({
        url: `/pages/order/detail?id=${orderId}`
      });
    },
    
    // 取消订单
    cancelOrder(orderId) {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消该订单吗？',
        success: (res) => {
          if (res.confirm) {
            // 实际项目中调用云函数取消订单
            uni.showLoading({
              title: '处理中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              });
              
              // 更新本地数据状态
              const orderIndex = this.orders.findIndex(order => order._id === orderId);
              if (orderIndex !== -1) {
                this.orders.splice(orderIndex, 1);
              }
            }, 1000);
          }
        }
      });
    },
    
    // 支付订单
    payOrder(orderId) {
      uni.navigateTo({
        url: `/pages/payment/index?orderId=${orderId}`
      });
    },
    
    // 查看物流
    trackOrder(orderId) {
      uni.navigateTo({
        url: `/pages/order/logistics?id=${orderId}`
      });
    },
    
    // 确认收货
    confirmOrder(orderId) {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '已确认收货',
                icon: 'success'
              });
              
              // 更新本地数据状态
              const orderIndex = this.orders.findIndex(order => order._id === orderId);
              if (orderIndex !== -1) {
                this.orders[orderIndex].status = '已完成';
              }
            }, 1000);
          }
        }
      });
    },
    
    // 评价订单
    reviewOrder(orderId) {
      uni.navigateTo({
        url: `/pages/order/review?id=${orderId}`
      });
    },
    
    // 再次购买
    rebuyOrder(order) {
      // 实际项目中可能需要跳转产品详情页或直接添加到购物车
      uni.showToast({
        title: '正在处理...',
        icon: 'none'
      });
    },
    
    // 浏览POS机
    browsePOS() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
};
</script>

<style>
.order-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;
}

/* 标签栏样式 */
.tabs {
  display: flex;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #1296db;
  font-weight: bold;
}

.tab-line {
  position: absolute;
  bottom: 0;
  width: 40rpx;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}

/* 订单列表样式 */
.order-list {
  flex: 1;
  padding: 20rpx;
}

.order-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 26rpx;
  color: #999;
}

.order-status {
  font-size: 26rpx;
  font-weight: bold;
}

.status-pending {
  color: #ff9800;
}

.status-approved {
  color: #2196f3;
}

.status-shipped {
  color: #9c27b0;
}

.status-completed {
  color: #4caf50;
}

/* 订单商品样式 */
.order-product {
  display: flex;
  padding: 20rpx 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
}

.product-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.product-spec {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.product-price {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 24rpx;
  color: #333;
}

.price-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.price-count {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

/* 订单底部样式 */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0 30rpx;
}

.order-time {
  font-size: 24rpx;
  color: #999;
}

.order-total {
  font-size: 26rpx;
  color: #666;
}

.total-amount {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff5252;
}

/* 订单按钮样式 */
.order-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.action-btn {
  height: 60rpx;
  padding: 0 30rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  margin-bottom: 10rpx;
}

.cancel {
  background-color: #f5f5f5;
  color: #666;
  border: 1rpx solid #ddd;
}

.pay, .confirm, .rebuy {
  background-color: #1296db;
  color: #fff;
}

.track, .review {
  background-color: #fff;
  color: #1296db;
  border: 1rpx solid #1296db;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.browse {
  width: 300rpx;
  height: 80rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
}

.loading-icon {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #1296db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 26rpx;
  color: #999;
}

.loading-complete {
  text-align: center;
  padding: 30rpx 0;
  font-size: 24rpx;
  color: #999;
}
</style>
