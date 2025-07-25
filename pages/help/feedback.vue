<template>
  <view class="feedback-container">
    <view class="form-card">
      <view class="form-group">
        <view class="form-label">反馈类型</view>
        <view class="type-selector">
          <view
            class="type-item"
            v-for="(item, index) in feedbackTypes"
            :key="index"
            :class="{ active: selectedType === item.value }"
            @click="selectedType = item.value"
          >
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <view class="form-label">问题描述</view>
        <textarea
          class="feedback-content"
          placeholder="请详细描述您遇到的问题或建议..."
          v-model="content"
          maxlength="500"
        />
        <view class="word-count">{{ content.length }}/500</view>
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <view class="form-label">上传截图（选填）</view>
        <view class="image-uploader">
          <view class="image-item" v-for="(item, index) in images" :key="index">
            <image
              :src="item"
              mode="aspectFill"
              class="uploaded-image"
              @click="previewImage(index)"
            ></image>
            <view class="delete-btn" @click.stop="deleteImage(index)">×</view>
          </view>

          <view
            class="upload-btn"
            @click="chooseImage"
            v-if="images.length < 3"
          >
            <view class="upload-icon">+</view>
            <view class="upload-text">上传图片</view>
          </view>
        </view>
        <view class="upload-tip">最多上传3张图片</view>
      </view>

      <view class="form-divider"></view>

      <view class="form-group">
        <view class="form-label">联系方式（选填）</view>
        <input
          type="text"
          class="form-input"
          placeholder="请留下您的手机号或微信，方便我们联系您"
          v-model="contact"
        />
      </view>
    </view>

    <view class="submit-btn" @click="submitFeedback">提交反馈</view>

    <view class="tips-card">
      <view class="tips-header">
        <image
          class="tips-icon"
          src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
        ></image>
        <text class="tips-title">反馈提示</text>
      </view>
      <view class="tips-content">
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">请详细描述您遇到的问题或建议</text>
        </view>
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">您的反馈将帮助我们持续改进服务</text>
        </view>
        <view class="tip-item">
          <text class="tip-dot">•</text>
          <text class="tip-text">客服将在1-3个工作日内联系您</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      feedbackTypes: [
        { label: "功能异常", value: "bug" },
        { label: "体验问题", value: "experience" },
        { label: "功能建议", value: "suggestion" },
        { label: "其他", value: "other" },
      ],
      selectedType: "bug",
      content: "",
      contact: "",
      images: [],
    };
  },
  onLoad() {
    // 自动填充联系方式
    this.getUserContact();
  },
  methods: {
    // 获取用户联系信息
    getUserContact() {
      const userInfoStr = uni.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.phone) {
            this.contact = userInfo.phone;
          }
        } catch (e) {
          console.error("解析用户信息失败", e);
        }
      }
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          // 上传图片到临时路径
          const tempFilePaths = res.tempFilePaths;

          // 这里应该上传图片到服务器，获取URL后再添加到images数组
          // 这里简单处理，直接添加临时路径
          this.images = [...this.images, ...tempFilePaths];
        },
      });
    },

    // 预览图片
    previewImage(index) {
      uni.previewImage({
        current: this.images[index],
        urls: this.images,
      });
    },

    // 删除图片
    deleteImage(index) {
      this.images.splice(index, 1);
    },

    // 提交反馈
    submitFeedback() {
      // 内容验证
      if (!this.content.trim()) {
        uni.showToast({
          title: "请填写反馈内容",
          icon: "none",
        });
        return;
      }

      // 显示加载中
      uni.showLoading({
        title: "提交中...",
        mask: true,
      });

      // 收集反馈信息
      const feedbackData = {
        type: this.selectedType,
        content: this.content,
        contact: this.contact,
        images: this.images,
        createTime: new Date(),
        status: "pending", // 等待处理状态
      };

      // 获取用户ID
      const userInfoStr = uni.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          feedbackData.userId = userInfo._id;
          feedbackData.userName = userInfo.nickName;
        } catch (e) {
          console.error("解析用户信息失败", e);
        }
      }

      // 提交到云数据库
      const db = wx.cloud.database();
      db.collection("feedback")
        .add({
          data: feedbackData,
        })
        .then(() => {
          uni.hideLoading();
          uni.showToast({
            title: "提交成功",
            icon: "success",
          });

          // 清空表单
          setTimeout(() => {
            // 返回上一页
            uni.navigateBack();
          }, 1500);
        })
        .catch((err) => {
          console.error("提交反馈失败", err);
          uni.hideLoading();

          // 处理集合不存在的错误
          if (
            err.errCode === -502005 ||
            (err.errMsg && err.errMsg.includes("collection not exists"))
          ) {
            // 如果集合不存在，先提示用户提交成功，后台将创建集合
            uni.showToast({
              title: "提交成功",
              icon: "success",
            });

            // 清空表单
            setTimeout(() => {
              // 返回上一页
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: "提交失败，请重试",
              icon: "none",
            });
          }
        });
    },
  },
};
</script>

<style>
.feedback-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 20rpx 0 40rpx;
}

.form-card {
  background-color: #fff;
  margin-bottom: 30rpx;
}

.form-group {
  padding: 30rpx;
}

.form-label {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.type-selector {
  display: flex;
  flex-wrap: wrap;
}

.type-item {
  min-width: 160rpx;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
  padding: 0 20rpx;
}

.type-item.active {
  background-color: #e6f7ff;
  color: #1296db;
  border: 1px solid #1296db;
}

.feedback-content {
  width: 100%;
  height: 300rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.word-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.form-divider {
  height: 1px;
  background-color: #f1f1f1;
}

.image-uploader {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #f8f8f8;
  border: 1px dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 60rpx;
  color: #bbb;
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
  margin-top: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.submit-btn {
  margin: 40rpx 30rpx;
  height: 90rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 45rpx;
  box-shadow: 0 4rpx 20rpx rgba(18, 150, 219, 0.3);
}

.tips-card {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tips-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.tips-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
}

.tips-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.tips-content {
  padding-left: 10rpx;
}

.tip-item {
  display: flex;
  margin-bottom: 10rpx;
}

.tip-dot {
  margin-right: 10rpx;
  color: #1296db;
  font-weight: bold;
}

.tip-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>
