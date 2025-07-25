<template>
  <view class="points-container">
    <!-- 积分头部 -->
    <view class="points-header">
      <view class="header-content">
        <view class="points-title">我的积分</view>
        <view class="points-value">{{ userInfo.points || 0 }}</view>
        <view class="points-desc">可用于兑换商品和服务</view>
      </view>
    </view>

    <!-- 积分操作区 -->
    <view class="action-card">
      <view
        class="action-item"
        @click="navigateTo('/pages/user/points-history')"
      >
        <image
          src="https://cdn-icons-png.flaticon.com/128/2961/2961543.png"
          class="action-icon"
        ></image>
        <text class="action-text">积分明细</text>
      </view>
      <view
        class="action-item"
        @click="navigateTo('/pages/user/points-exchange')"
      >
        <image
          src="https://cdn-icons-png.flaticon.com/128/1611/1611179.png"
          class="action-icon"
        ></image>
        <text class="action-text">积分兑换</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/user/points-task')">
        <image
          src="https://cdn-icons-png.flaticon.com/128/3208/3208615.png"
          class="action-icon"
        ></image>
        <text class="action-text">赚取积分</text>
      </view>
    </view>

    <!-- 积分规则说明 -->
    <view class="rule-card">
      <view class="card-header">
        <text class="card-title">积分规则</text>
      </view>
      <view class="rule-content">
        <view class="rule-item">
          <text class="rule-title">如何获取积分？</text>
          <view class="rule-detail">
            <text>• 首次注册：+100积分</text>
            <text>• 每日签到：+10积分</text>
            <text>• 完成订单：订单金额的1%转换为积分</text>
            <text>• 评价订单：+5积分/次</text>
            <text>• 分享商品：+2积分/次（每日上限10次）</text>
          </view>
        </view>
        <view class="rule-item">
          <text class="rule-title">积分使用说明</text>
          <view class="rule-detail">
            <text>• 100积分 = ¥1元</text>
            <text>• 积分可用于商品抵扣</text>
            <text>• 积分可兑换优惠券</text>
            <text>• 积分有效期为一年</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 积分任务 -->
    <view class="task-card">
      <view class="card-header">
        <text class="card-title">今日任务</text>
        <text class="header-desc">完成任务获取积分</text>
      </view>
      <view class="task-list">
        <view class="task-item" v-for="(item, index) in taskList" :key="index">
          <view class="task-info">
            <image :src="item.icon" class="task-icon"></image>
            <view class="task-detail">
              <text class="task-name">{{ item.name }}</text>
              <text class="task-desc">{{ item.desc }}</text>
            </view>
          </view>
          <view
            :class="['task-btn', item.completed ? 'completed' : '']"
            @click="completeTask(index)"
          >
            {{ item.completed ? "已完成" : "+" + item.points }}
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
      userInfo: {
        points: 0,
      },
      taskList: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2997/2997933.png",
          name: "每日签到",
          desc: "完成每日签到任务",
          points: 10,
          completed: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/1968/1968666.png",
          name: "浏览商品",
          desc: "浏览5个商品详情",
          points: 5,
          completed: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3898/3898082.png",
          name: "分享商品",
          desc: "分享商品给好友",
          points: 2,
          completed: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2361/2361728.png",
          name: "评价订单",
          desc: "评价已完成的订单",
          points: 5,
          completed: false,
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/9464/9464086.png",
          name: "完善资料",
          desc: "完善个人资料",
          points: 20,
          completed: true,
        },
      ],
    };
  },
  onLoad() {
    // 从本地缓存获取用户信息
    const userInfoStr = uni.getStorageSync("userInfo");
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr);
    }

    // 加载任务完成状态
    this.loadTaskStatus();
  },
  methods: {
    // 导航到指定页面
    navigateTo(url) {
      // 检查页面是否开发完成
      if (
        url.includes("points-history") ||
        url.includes("points-exchange") ||
        url.includes("points-task")
      ) {
        uni.showToast({
          title: "功能开发中...",
          icon: "none",
        });
        return;
      }

      uni.navigateTo({
        url: url,
      });
    },

    // 加载任务状态
    loadTaskStatus() {
      // 从缓存中获取任务状态
      const taskStatus = uni.getStorageSync("pointsTaskStatus");
      if (taskStatus) {
        const taskData = JSON.parse(taskStatus);
        // 检查是否是今天的数据
        const today = new Date().toDateString();
        if (taskData.date === today) {
          // 更新任务状态
          this.taskList.forEach((task, index) => {
            if (taskData.completed && taskData.completed.includes(index)) {
              this.taskList[index].completed = true;
            }
          });
        } else {
          // 新的一天，重置任务状态（保留永久完成的任务）
          this.taskList[4].completed = true; // 假设"完善资料"是永久完成的
          this.saveTaskStatus();
        }
      }
    },

    // 保存任务状态
    saveTaskStatus() {
      const completed = this.taskList
        .map((task, index) => (task.completed ? index : -1))
        .filter((index) => index !== -1);

      const taskStatus = {
        date: new Date().toDateString(),
        completed: completed,
      };

      uni.setStorageSync("pointsTaskStatus", JSON.stringify(taskStatus));
    },

    // 完成任务
    completeTask(index) {
      // 已完成的任务不能再次点击
      if (this.taskList[index].completed) {
        return;
      }

      // 根据任务类型执行不同操作
      switch (index) {
        case 0: // 每日签到
          this.signIn();
          break;
        case 1: // 浏览商品
        case 2: // 分享商品
        case 3: // 评价订单
          uni.showToast({
            title: "请在对应页面完成任务",
            icon: "none",
          });
          break;
        default:
          break;
      }
    },

    // 签到功能
    signIn() {
      uni.showLoading({
        title: "签到中...",
      });

      // 模拟网络请求
      setTimeout(() => {
        // 更新积分
        const points = this.userInfo.points || 0;
        this.userInfo.points = points + 10;

        // 更新本地存储
        uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));

        // 更新任务状态
        this.taskList[0].completed = true;
        this.saveTaskStatus();

        uni.hideLoading();
        uni.showToast({
          title: "签到成功 +10积分",
          icon: "success",
        });

        // 实际项目中应该调用云函数更新用户积分
        if (this.userInfo._id) {
          const db = wx.cloud.database();
          db.collection("userinfo")
            .doc(this.userInfo._id)
            .update({
              data: {
                points: this.userInfo.points,
              },
            })
            .then(() => {
              console.log("积分更新成功");
            })
            .catch((err) => {
              console.error("积分更新失败", err);
            });
        }
      }, 1000);
    },
  },
};
</script>

<style>
.points-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 30rpx;
}

.points-header {
  height: 300rpx;
  background: linear-gradient(to right, #1296db, #14b8e4);
  color: #fff;
  position: relative;
  overflow: hidden;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.points-title {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.points-value {
  font-size: 80rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.points-desc {
  font-size: 24rpx;
  opacity: 0.8;
}

.action-card {
  margin: -50rpx 30rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-around;
  padding: 30rpx 0;
  position: relative;
  z-index: 3;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 15rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.rule-card,
.task-card {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
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

.header-desc {
  font-size: 24rpx;
  color: #999;
}

.rule-item {
  margin-bottom: 30rpx;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.rule-detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
}

.task-list {
  padding: 10rpx 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.task-item:last-child {
  border-bottom: none;
}

.task-info {
  display: flex;
  align-items: center;
}

.task-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.task-detail {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.task-desc {
  font-size: 24rpx;
  color: #999;
}

.task-btn {
  width: 120rpx;
  height: 60rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-btn.completed {
  background-color: #ddd;
}
</style>
