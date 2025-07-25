<template>
  <view class="address-container">
    <view class="address-header">
      <text class="header-title">收货地址管理</text>
    </view>

    <!-- 地址列表 -->
    <view v-if="addressList.length > 0" class="address-list">
      <view
        class="address-item"
        v-for="(item, index) in addressList"
        :key="index"
        @click="selectAddress(item)"
      >
        <view class="item-info">
          <view class="info-header">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <view class="tag" v-if="item.isDefault">默认</view>
          </view>
          <view class="address-detail"
            >{{ item.province }}{{ item.city }}{{ item.district
            }}{{ item.address }}</view
          >
        </view>
        <view class="item-actions">
          <view class="action-edit" @click.stop="editAddress(item)">编辑</view>
          <view class="action-delete" @click.stop="deleteAddress(item)"
            >删除</view
          >
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <image
        src="https://cdn-icons-png.flaticon.com/128/4076/4076445.png"
        class="empty-icon"
      ></image>
      <text class="empty-text">暂无收货地址</text>
    </view>

    <!-- 添加按钮 -->
    <view class="add-address" @click="addNewAddress">
      <text class="add-icon">+</text>
      <text class="add-text">新增收货地址</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressList: [],
      userId: "",
    };
  },
  onLoad() {
    // 检查登录状态
    this.checkLoginStatus();
  },
  onShow() {
    // 每次显示页面时刷新地址列表
    this.fetchAddressList();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        this.userId = parsedInfo._id;
        this.fetchAddressList();
      } else {
        uni.showToast({
          title: "请先登录",
          icon: "none",
          success: () => {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
      }
    },

    // 获取地址列表
    fetchAddressList() {
      uni.showLoading({
        title: "加载中...",
      });

      const db = wx.cloud.database();

      // 先检查集合是否存在，如果不存在则显示空列表
      // 由于微信小程序云开发没有直接检查集合是否存在的API，
      // 我们通过捕获错误的方式处理
      db.collection("address")
        .where({
          userId: this.userId,
        })
        .get()
        .then((res) => {
          this.addressList = res.data;
          uni.hideLoading();
        })
        .catch((err) => {
          console.error("获取地址列表失败", err);
          uni.hideLoading();

          // 处理集合不存在的错误
          if (
            err.errCode === -502005 ||
            (err.errMsg && err.errMsg.includes("collection not exists"))
          ) {
            this.addressList = []; // 设置为空列表

            // 可以选择自动创建集合的示例数据
            this.createAddressCollection();
          } else {
            uni.showToast({
              title: "加载失败",
              icon: "none",
            });
          }
        });
    },

    // 创建地址集合
    createAddressCollection() {
      // 在实际应用中，集合应该在云函数中创建
      // 这里我们只是提示用户
      uni.showModal({
        title: "提示",
        content: "地址数据初始化中，请添加您的第一个收货地址",
        showCancel: false,
        success: () => {
          // 可以引导用户添加第一个地址
        },
      });
    },

    // 选择地址
    selectAddress(address) {
      // 获取来源页面的事件通道
      const eventChannel = this.getOpenerEventChannel();

      // 如果有页面需要返回地址信息，通过事件通道传递
      eventChannel.emit("selectAddress", address);

      // 返回上一页
      uni.navigateBack();
    },

    // 编辑地址
    editAddress(address) {
      uni.navigateTo({
        url: "/pages/user/address-edit?id=" + address._id,
      });
    },

    // 删除地址
    deleteAddress(address) {
      uni.showModal({
        title: "提示",
        content: "确定要删除该地址吗？",
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: "删除中...",
            });

            const db = wx.cloud.database();
            db.collection("address")
              .doc(address._id)
              .remove()
              .then(() => {
                uni.hideLoading();
                uni.showToast({
                  title: "删除成功",
                  icon: "success",
                });
                this.fetchAddressList();
              })
              .catch((err) => {
                console.error("删除地址失败", err);
                uni.hideLoading();
                uni.showToast({
                  title: "删除失败",
                  icon: "none",
                });
              });
          }
        },
      });
    },

    // 新增地址
    addNewAddress() {
      uni.navigateTo({
        url: "/pages/user/address-edit",
      });
    },
  },
};
</script>

<style>
.address-container {
  padding: 20rpx 0;
  min-height: 100vh;
  background-color: #f7f7f7;
}

.address-header {
  padding: 30rpx;
  background-color: #fff;
}

.header-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.address-list {
  margin-top: 20rpx;
}

.address-item {
  display: flex;
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-info {
  flex: 1;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.phone {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
}

.tag {
  font-size: 22rpx;
  color: #fff;
  background-color: #1296db;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.address-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 20rpx;
}

.action-edit,
.action-delete {
  font-size: 24rpx;
  padding: 6rpx 0;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
}

.add-address {
  position: fixed;
  bottom: 40rpx;
  left: 30rpx;
  right: 30rpx;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1296db;
  border-radius: 45rpx;
  color: #fff;
  font-size: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(18, 150, 219, 0.3);
}

.add-icon {
  font-size: 40rpx;
  margin-right: 10rpx;
  margin-top: -5rpx;
}
</style>
