<template>
  <view class="address-edit-container">
    <view class="form-container">
      <view class="form-group">
        <text class="form-label">收货人</text>
        <input
          type="text"
          class="form-input"
          placeholder="请输入收货人姓名"
          v-model="addressData.name"
        />
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <text class="form-label">手机号码</text>
        <input
          type="number"
          class="form-input"
          placeholder="请输入收货人手机号"
          maxlength="11"
          v-model="addressData.phone"
        />
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <text class="form-label">所在地区</text>
        <view class="region-picker" @click="showRegionPicker">
          <text
            class="picker-value"
            :class="{ placeholder: !addressData.region }"
          >
            {{ addressData.region || "请选择省/市/区" }}
          </text>
          <image
            class="arrow-icon"
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
          ></image>
        </view>
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <text class="form-label">详细地址</text>
        <textarea
          class="form-textarea"
          placeholder="请输入详细地址信息"
          v-model="addressData.address"
        />
      </view>

      <view class="form-divider"></view>

      <view class="form-group switch-group">
        <text class="form-label">设为默认地址</text>
        <switch
          :checked="addressData.isDefault"
          @change="setDefaultChange"
          color="#1296db"
        />
      </view>
    </view>

    <view class="submit-btn" @click="saveAddress">保存</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressId: "",
      userId: "",
      addressData: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        region: "",
        address: "",
        isDefault: false,
      },
    };
  },
  onLoad(options) {
    // 检查登录状态
    this.checkLoginStatus();

    // 如果有地址ID，说明是编辑模式
    if (options.id) {
      this.addressId = options.id;
      this.loadAddressData(options.id);
    }
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        this.userId = parsedInfo._id;
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

    // 加载地址数据
    loadAddressData(addressId) {
      uni.showLoading({
        title: "加载中...",
      });

      const db = wx.cloud.database();
      db.collection("address")
        .doc(addressId)
        .get()
        .then((res) => {
          if (res.data) {
            this.addressData = res.data;
            // 重构地区显示
            this.addressData.region =
              res.data.province + " " + res.data.city + " " + res.data.district;
          }
          uni.hideLoading();
        })
        .catch((err) => {
          console.error("获取地址详情失败", err);
          uni.hideLoading();
          uni.showToast({
            title: "加载失败",
            icon: "none",
          });
        });
    },

    // 显示地区选择器
    showRegionPicker() {
      uni.chooseAddress({
        success: (res) => {
          // 成功获取微信地址
          this.addressData.name = res.userName;
          this.addressData.phone = res.telNumber;
          this.addressData.province = res.provinceName;
          this.addressData.city = res.cityName;
          this.addressData.district = res.countyName;
          this.addressData.address = res.detailInfo;
          this.addressData.region =
            res.provinceName + " " + res.cityName + " " + res.countyName;
        },
        fail: (err) => {
          // 如果用户拒绝授权或选择失败，使用普通选择器
          uni.showToast({
            title: "请选择地区",
            icon: "none",
          });

          // 使用小程序提供的区域选择器
          uni.showModal({
            title: "提示",
            content: "地区选择需要调用原生组件，这里先使用模拟数据",
            showCancel: false,
            success: () => {
              // 模拟用户选择了地区
              setTimeout(() => {
                this.addressData.province = "广东省";
                this.addressData.city = "深圳市";
                this.addressData.district = "南山区";
                this.addressData.region =
                  this.addressData.province +
                  " " +
                  this.addressData.city +
                  " " +
                  this.addressData.district;
              }, 500);
            },
          });
        },
      });
    },

    // 设置默认地址
    setDefaultChange(e) {
      this.addressData.isDefault = e.detail.value;
    },

    // 验证表单
    validateForm() {
      if (!this.addressData.name) {
        uni.showToast({
          title: "请输入收货人姓名",
          icon: "none",
        });
        return false;
      }

      if (!this.addressData.phone) {
        uni.showToast({
          title: "请输入手机号码",
          icon: "none",
        });
        return false;
      }

      if (!/^1\d{10}$/.test(this.addressData.phone)) {
        uni.showToast({
          title: "手机号格式不正确",
          icon: "none",
        });
        return false;
      }

      if (
        !this.addressData.province ||
        !this.addressData.city ||
        !this.addressData.district
      ) {
        uni.showToast({
          title: "请选择所在地区",
          icon: "none",
        });
        return false;
      }

      if (!this.addressData.address) {
        uni.showToast({
          title: "请输入详细地址",
          icon: "none",
        });
        return false;
      }

      return true;
    },

    // 保存地址
    saveAddress() {
      if (!this.validateForm()) return;

      uni.showLoading({
        title: "保存中...",
      });

      const db = wx.cloud.database();
      const addressData = {
        userId: this.userId,
        name: this.addressData.name,
        phone: this.addressData.phone,
        province: this.addressData.province,
        city: this.addressData.city,
        district: this.addressData.district,
        address: this.addressData.address,
        isDefault: this.addressData.isDefault,
        updateTime: new Date(),
      };

      // 如果是默认地址，需要先将其他地址设为非默认
      const updateDefaultPromise = this.addressData.isDefault
        ? this.updateOtherAddressDefault()
        : Promise.resolve();

      updateDefaultPromise
        .then(() => {
          if (this.addressId) {
            // 更新地址
            return db.collection("address").doc(this.addressId).update({
              data: addressData,
            });
          } else {
            // 新增地址
            addressData.createTime = new Date();
            return db.collection("address").add({
              data: addressData,
            });
          }
        })
        .then(() => {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success",
          });

          // 返回上一页
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        })
        .catch((err) => {
          console.error("保存地址失败", err);
          uni.hideLoading();

          // 处理集合不存在的错误
          if (
            err.errCode === -502005 ||
            (err.errMsg && err.errMsg.includes("collection not exists"))
          ) {
            // 尝试创建集合并再次保存
            this.createCollectionAndSave(addressData);
          } else {
            uni.showToast({
              title: "保存失败",
              icon: "none",
            });
          }
        });
    },

    // 更新其他地址为非默认
    updateOtherAddressDefault() {
      const db = wx.cloud.database();
      const _ = db.command;

      return db
        .collection("address")
        .where({
          userId: this.userId,
          isDefault: true,
          _id: _.neq(this.addressId || ""),
        })
        .update({
          data: {
            isDefault: false,
          },
        })
        .catch((err) => {
          // 如果集合不存在，返回一个已解决的promise
          if (
            err.errCode === -502005 ||
            (err.errMsg && err.errMsg.includes("collection not exists"))
          ) {
            return Promise.resolve();
          }
          return Promise.reject(err);
        });
    },

    // 创建集合并保存地址
    createCollectionAndSave(addressData) {
      // 在微信小程序云开发中，当你第一次添加记录时会自动创建集合
      // 所以我们直接再次尝试添加
      uni.showModal({
        title: "提示",
        content: "正在初始化地址数据，请稍候...",
        showCancel: false,
        success: () => {
          // 延迟一点再尝试，让用户有时间看到提示
          setTimeout(() => {
            const db = wx.cloud.database();
            // 新增地址
            addressData.createTime = new Date();
            db.collection("address")
              .add({
                data: addressData,
              })
              .then(() => {
                uni.hideLoading();
                uni.showToast({
                  title: "保存成功",
                  icon: "success",
                });

                // 返回上一页
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              })
              .catch((err) => {
                console.error("二次尝试保存地址失败", err);
                uni.showToast({
                  title: "保存失败，请联系客服",
                  icon: "none",
                });
              });
          }, 1000);
        },
      });
    },
  },
};
</script>

<style>
.address-edit-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 120rpx;
}

.form-container {
  background-color: #fff;
  margin-top: 20rpx;
}

.form-group {
  display: flex;
  align-items: center;
  padding: 30rpx;
}

.form-label {
  width: 160rpx;
  font-size: 30rpx;
  color: #333;
}

.form-input {
  flex: 1;
  font-size: 30rpx;
  height: 60rpx;
}

.form-textarea {
  flex: 1;
  height: 160rpx;
  font-size: 30rpx;
  line-height: 1.4;
}

.form-divider {
  height: 1rpx;
  background-color: #eee;
  margin-left: 30rpx;
}

.region-picker {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
}

.picker-value {
  font-size: 30rpx;
  color: #333;
}

.placeholder {
  color: #999;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
}

.switch-group {
  justify-content: space-between;
}

.submit-btn {
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
</style>
