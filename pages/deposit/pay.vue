<template>
  <view class="deposit-container">
    <!-- 顶部状态卡片 -->
    <view class="status-card">
      <view class="card-header">
        <text class="card-title">押金退还</text>
        <view class="refund-records-btn" @click="goToRefundOrders" v-if="!isDetailMode">
          <text>退款记录</text>
          <text class="arrow">></text>
        </view>
      </view>
      <view class="card-content">
        <view class="amount">¥{{ amount }}</view>
        <view class="desc">退还至您的账户</view>
        <view class="order-info">
          <text>订单号：{{ orderId }}</text>
          <text>产品：{{ productName }}</text>
        </view>
      </view>
    </view>
    
    <!-- 退款进度状态 (已申请退款时显示) -->
    <view class="refund-status-section" v-if="hasRefundRequest">
      <view class="section-title">退款进度</view>
      
      <!-- 进度条 -->
      <view class="progress-bar">
        <view class="progress-steps">
          <view class="progress-step" :class="{active: refundInfo.status !== '已拒绝', current: refundInfo.status === '待审核'}">
            <view class="step-dot"></view>
            <text class="step-text">申请提交</text>
            <text class="step-time">{{ formatDate(refundInfo.applyTime) }}</text>
          </view>
          
          <view class="progress-step" :class="{active: ['已通过', '已退款'].includes(refundInfo.status), current: refundInfo.status === '已通过'}">
            <view class="step-dot"></view>
            <text class="step-text">审核通过</text>
            <text class="step-time">{{ refundInfo.approveTime ? formatDate(refundInfo.approveTime) : '' }}</text>
          </view>
          
          <view class="progress-step" :class="{active: refundInfo.status === '已退款', current: refundInfo.status === '已退款'}">
            <view class="step-dot"></view>
            <text class="step-text">退款完成</text>
            <text class="step-time">{{ refundInfo.refundTime ? formatDate(refundInfo.refundTime) : '' }}</text>
          </view>
        </view>
        <view class="progress-line"></view>
      </view>
      
      <!-- 当前状态 -->
      <view class="current-status">
        <view class="status-label">当前状态</view>
        <view :class="['status-value', {'status-rejected': refundInfo.status === '已拒绝'}]">
          {{ statusMap[refundInfo.status] || "处理中" }}
        </view>
      </view>
      
      <!-- 拒绝原因 -->
      <view class="reject-reason" v-if="refundInfo.status === '已拒绝'">
        <view class="reason-label">拒绝原因</view>
        <view class="reason-value">{{ refundInfo.rejectReason || '序列号验证失败，请确认POS机是否已激活' }}</view>
      </view>
      
      <!-- 申请信息 -->
      <view class="refund-detail">
        <view class="detail-item">
          <text class="detail-label">序列号</text>
          <text class="detail-value">{{ refundInfo.serialNumber }}</text>
        </view>
        <view class="detail-item" v-if="refundInfo.machineImage">
          <text class="detail-label">上传凭证</text>
          <text class="detail-value img-preview" @click="previewImage(refundInfo.machineImage)">查看</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">申请时间</text>
          <text class="detail-value">{{ formatDate(refundInfo.applyTime) }}</text>
        </view>
      </view>
      
      <!-- 重新申请按钮 (仅当申请被拒绝时显示) -->
      <view class="reapply-btn-wrap" v-if="refundInfo.status === '已拒绝'">
        <button class="reapply-btn" @click="resetApplication">重新申请</button>
      </view>
    </view>

    <!-- POS机序列号输入 (未申请退款时显示) -->
    <view class="serial-number-section" v-if="!hasRefundRequest">
      <view class="section-title">POS机序列号</view>
      <view class="form-item">
        <input 
          class="serial-input" 
          v-model="serialNumber"
          placeholder="请输入POS机背面的序列号"
          maxlength="20"
        />
      </view>
      <view class="serial-tip">请确认序列号正确，否则将影响押金退还</view>
      
      <view class="upload-section">
        <view class="upload-title">上传机器照片凭证（可选）</view>
        <view class="upload-box" @click="uploadImage">
          <image v-if="machineImage" :src="machineImage" mode="aspectFit" class="preview-image"></image>
          <view v-else class="upload-placeholder">
            <text class="upload-icon">+</text>
            <text class="upload-text">上传照片</text>
          </view>
        </view>
        <view class="upload-tip">上传POS机背面照片(包含序列号)，有助于加快审核</view>
      </view>
    </view>

    <!-- 退还方式选择 (未申请退款时显示) -->
    <view class="payment-methods" v-if="!hasRefundRequest">
      <view class="section-title">退还方式</view>
      <view
        class="payment-method"
        :class="{ active: refundMethod === 'wechat' }"
        @click="refundMethod = 'wechat'"
      >
        <image src="/static/wechat-pay.png" mode="aspectFit"></image>
        <text class="method-name">原路退回</text>
        <text class="method-select"></text>
      </view>
    </view>

    <!-- 注意事项 -->
    <view class="notice" v-if="!hasRefundRequest">
      <view class="section-title">注意事项</view>
      <view class="notice-item">
        <text class="dot">•</text>
        <text class="notice-text">请确保POS机已成功激活并正常使用</text>
      </view>
      <view class="notice-item">
        <text class="dot">•</text>
        <text class="notice-text">审核通过后，退款将在1-3个工作日内到账</text>
      </view>
      <view class="notice-item">
        <text class="dot">•</text>
        <text class="notice-text">如有疑问，请联系客服</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn cancel" @click="goBack">{{ isDetailMode ? '返回列表' : '返回' }}</button>
      <button class="action-btn confirm" v-if="!hasRefundRequest" @click="handleAction">
        申请退还
      </button>
      <button class="action-btn contact" v-if="hasRefundRequest" @click="contactService">
        联系客服
      </button>
    </view>

    <!-- 退款申请结果弹窗 -->
    <view class="result-popup" v-if="showResult">
      <view class="result-content">
        <view class="result-icon" :class="{ success: paymentSuccess }">
          <text>{{ paymentSuccess ? "√" : "×" }}</text>
        </view>
        <view class="result-title">
          {{ paymentSuccess ? "申请成功" : "申请失败" }}
        </view>
        <view class="result-desc">
          {{ paymentSuccess 
              ? "您的退款申请已提交，将在1-3个工作日内处理" 
              : "请稍后重试或联系客服" }}
        </view>
        <button class="result-btn" @click="handleResultAction">
          {{ paymentSuccess ? "确定" : "重试" }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      productName: "POS机A1",
      amount: 99,
      refundMethod: "wechat",
      serialNumber: "",
      machineImage: "",
      machineImageCloud: "", // 云存储路径
      showResult: false,
      paymentSuccess: false,
      orderInfo: {}, // 存储订单详情
      hasRefundRequest: false, // 是否已申请退款
      refundStatus: "", // 退款状态
      refundInfo: {}, // 退款申请信息
      isDetailMode: false, // 是否是详情查看模式
      statusMap: {
        "待审核": "审核中",
        "已通过": "审核通过，退款处理中",
        "已拒绝": "审核未通过",
        "已退款": "退款已完成"
      }
    };
  },
  onLoad(options) {
    console.log("页面加载，参数:", options);
    
    // 记录原始ID
    if (options.id) {
      this.orderId = options.id;
    }
    
    // 如果type参数为detail，则强制进入详情模式
    if (options.type === 'detail') {
      console.log("进入详情模式");
      
      // ===== 强制显示进度页而非表单 =====
      this.isDetailMode = true;
      this.hasRefundRequest = true; // 关键！确保显示进度区域
      
      // 显示加载中
      uni.showLoading({
        title: "加载中...",
        mask: true
      });
      
      // 初始化云环境
      wx.cloud.init({
        env: "cloud1-9grox8bwd6dbce0c",
        traceUser: true,
      });
      
      // 直接查询数据
      const db = wx.cloud.database();
      console.log("开始查询记录:", options.id);
      
      db.collection("refund_requests").doc(options.id).get()
        .then(res => {
          console.log("查询结果:", res);
          if (res.data) {
            // 找到数据，设置详情
            const record = res.data;
            this.refundInfo = record;
            this.refundStatus = record.status || "待审核";
            this.productName = record.productName || "POS机";
            this.amount = record.amount || 99;
            this.serialNumber = record.serialNumber || "";
            uni.hideLoading();
          } else {
            throw new Error("未找到记录");
          }
        })
        .catch(err => {
          console.error("查询失败:", err);
          // 即使查询失败，也保持详情模式，只是显示默认数据
          this.refundInfo = {
            status: "待审核",
            serialNumber: "加载失败",
            applyTime: new Date()
          };
          uni.hideLoading();
          uni.showToast({
            title: "加载详情失败",
            icon: "none"
          });
        });
      
      return; // 不执行后续代码
    }

    // 初始化云环境
    wx.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true,
    });
    
    // 加载订单信息
    this.loadOrderInfo();
    
    // 检查是否已申请退款
    this.checkRefundRequest();
  },
  
  // 加载退款记录详情
  loadRefundDetailById(refundId, fromRecords = false) {
    console.log("尝试加载退款记录详情:", refundId, "来自列表:", fromRecords);
    
    // 先强制设置为已有退款申请和详情模式，确保显示进度而不是表单
    this.hasRefundRequest = true;
    this.isDetailMode = true;
    
    // 显示加载
    uni.showLoading({
      title: "加载中...",
      mask: true
    });
    
    // 直接从数据库查询，确保100%准确
    // 初始化云环境
    wx.cloud.init({
      env: "cloud1-9grox8bwd6dbce0c",
      traceUser: true,
    });
    
    // 直接通过_id查询文档
    const db = wx.cloud.database();
    db.collection("refund_requests").doc(refundId).get({
      success: (res) => {
        console.log("直接通过ID查询退款记录成功:", res.data);
        uni.hideLoading();
        if (res.data) {
          const refundData = res.data;
          
          // 设置退款记录信息
          this.refundInfo = refundData;
          this.refundStatus = refundData.status || "待审核";
          this.orderId = refundData.orderId || this.orderId;
          this.productName = refundData.productName || "POS机";
          this.amount = refundData.amount || 99;
          this.serialNumber = refundData.serialNumber || "";
          
          // 如果有订单ID，再尝试获取订单详情
          if (refundData.orderId) {
            this.loadOriginalOrder(refundData.orderId);
          }
        } else {
          console.error("查询结果为空");
          uni.showToast({
            title: "找不到退款记录",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        console.error("直接查询退款记录失败:", err);
        uni.hideLoading();
        
        // 再尝试用where查询
        this.tryWhereQuery(refundId);
      }
    });
  },
  
  // 使用where条件查询
  tryWhereQuery(refundId) {
    console.log("尝试使用where条件查询:", refundId);
    uni.showLoading({
      title: "重试查询...",
      mask: true
    });
    
    const db = wx.cloud.database();
    db.collection("refund_requests")
      .where({
        _id: refundId
      })
      .get({
        success: (res) => {
          console.log("where查询结果:", res.data);
          uni.hideLoading();
          if (res.data && res.data.length > 0) {
            const refundData = res.data[0];
            
            // 设置退款记录信息
            this.refundInfo = refundData;
            this.refundStatus = refundData.status || "待审核";
            this.orderId = refundData.orderId || this.orderId;
            this.productName = refundData.productName || "POS机";
            this.amount = refundData.amount || 99;
            this.serialNumber = refundData.serialNumber || "";
            
            // 如果有订单ID，再尝试获取订单详情
            if (refundData.orderId) {
              this.loadOriginalOrder(refundData.orderId);
            }
          } else {
            console.error("where查询没有结果");
            uni.showToast({
              title: "找不到退款记录",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          console.error("where查询失败:", err);
          uni.hideLoading();
          uni.showToast({
            title: "加载记录失败",
            icon: "none"
          });
        }
      });
  },
  

  methods: {
    // 加载订单信息
    loadOrderInfo() {
      if (!this.orderId) {
        console.log("未找到订单ID");
        return;
      }
      
      uni.showLoading({
        title: "加载中..."
      });
      
      // 判断是否是退款记录ID而不是订单ID
      const db = wx.cloud.database();
      
      // 先尝试从退款记录中查询
      db.collection("refund_requests").where({
        _id: this.orderId
      }).get({
        success: (res) => {
          if (res.data && res.data.length > 0) {
            // 找到了退款记录
            console.log("找到退款记录:", res.data[0]);
            const refundData = res.data[0];
            this.hasRefundRequest = true;
            this.refundInfo = refundData;
            this.refundStatus = refundData.status || "待审核";
            this.orderId = refundData.orderId || "";
            this.productName = refundData.productName || "POS机";
            this.amount = refundData.amount || 99;
            this.serialNumber = refundData.serialNumber || "";
            
            // 如果找到退款记录，则表示是详情模式
            this.isDetailMode = true;
            
            // 如果有订单ID，再尝试获取订单详情
            if (refundData.orderId) {
              this.loadOriginalOrder(refundData.orderId);
            } else {
              uni.hideLoading();
            }
          } else {
            // 没有找到退款记录，尝试直接查订单
            this.loadOrderFromId();
          }
        },
        fail: (err) => {
          console.error("查询退款记录失败:", err);
          // 尝试直接查订单
          this.loadOrderFromId();
        }
      });
    },
    
    // 根据ID直接从订单表加载数据
    loadOrderFromId() {
      const db = wx.cloud.database();
      db.collection("user").doc(this.orderId).get({
        success: (res) => {
          console.log("获取订单信息成功:", res.data);
          this.orderInfo = res.data;
          this.productName = res.data.productName || "POS机";
          this.amount = res.data.deposit || 99;
          uni.hideLoading();
        },
        fail: (err) => {
          console.error("获取订单信息失败:", err);
          // 设置默认值
          this.productName = "POS机";
          this.amount = 99;
          
          uni.hideLoading();
          uni.showToast({
            title: "订单信息加载失败",
            icon: "none"
          });
        }
      });
    },
    
    // 加载原始订单信息
    loadOriginalOrder(originalOrderId) {
      if (!originalOrderId) {
        uni.hideLoading();
        return;
      }
      
      const db = wx.cloud.database();
      db.collection("user").doc(originalOrderId).get({
        success: (res) => {
          console.log("获取原始订单成功:", res.data);
          this.orderInfo = res.data;
          uni.hideLoading();
        },
        fail: (err) => {
          console.error("获取原始订单失败:", err);
          uni.hideLoading();
        }
      });
    },
    
    // 上传机器照片
    uploadImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          
          // 显示本地预览
          this.machineImage = tempFilePath;
          
          // 上传到云存储
          uni.showLoading({
            title: "上传中..."
          });
          
          const cloudPath = `refund/${this.orderId}_${new Date().getTime()}${tempFilePath.match(/\.[^.]+?$/)[0]}`;
          
          wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: tempFilePath,
            success: (res) => {
              console.log("上传成功", res);
              this.machineImageCloud = res.fileID;
              uni.hideLoading();
              uni.showToast({
                title: "上传成功",
                icon: "success"
              });
            },
            fail: (err) => {
              console.error("上传失败", err);
              uni.hideLoading();
              uni.showToast({
                title: "上传失败，请重试",
                icon: "none"
              });
            }
          });
        }
      });
    },

    // 返回上一页
    goBack() {
      if (this.isDetailMode) {
        // 如果是详情模式，返回退款记录列表页面
        uni.navigateBack({
          delta: 1
        });
      } else {
        // 否则正常返回
        uni.navigateBack();
      }
    },

    // 处理退款申请
    handleAction() {
      // 表单验证
      if (!this.serialNumber) {
        uni.showToast({
          title: "请输入POS机序列号",
          icon: "none"
        });
        return;
      }
      
      // 显示加载
      uni.showLoading({
        title: "申请中..."
      });
      
      // 准备提交的数据
      console.log("准备提交退款申请，订单ID:", this.orderId);
      console.log("订单信息:", this.orderInfo);
      
      const refundData = {
        orderId: this.orderId,
        serialNumber: this.serialNumber,
        amount: this.amount,
        refundMethod: this.refundMethod,
        machineImage: this.machineImageCloud,
        applyTime: new Date(),
        status: "待审核", // 待审核、已通过、已拒绝
        productName: this.productName,
        userId: uni.getStorageSync("userId") || this.orderInfo.userId || "", // 优先使用本地存储的用户ID
        refundReason: "机器已激活", // 退款原因
        contactPhone: this.orderInfo.phone || this.orderInfo.contactPhone || "", // 联系电话
        name: this.orderInfo.name || this.orderInfo.receiver || "", // 申请人姓名
        // 添加更多关联信息，方便查询
        orderInfo: {
          id: this.orderId,
          productName: this.productName,
          deposit: this.amount
        }
      };
      
      // 保存到云数据库
      const db = wx.cloud.database();
      db.collection("refund_requests").add({
        data: refundData,
        success: (res) => {
          console.log("申请提交成功", res);
          console.log("生成的记录ID:", res._id);
          
          // 保存记录ID到本地，方便后续查询
          uni.setStorageSync("lastRefundId", res._id);
          uni.setStorageSync("lastRefundOrderId", this.orderId);
          
          uni.hideLoading();
          this.paymentSuccess = true;
          this.showResult = true;
          
          // 更新refundInfo
          this.refundInfo = {
            ...refundData,
            _id: res._id
          };
        },
        fail: (err) => {
          console.error("申请提交失败", err);
          uni.hideLoading();
          this.paymentSuccess = false;
          this.showResult = true;
          
          // 显示详细错误信息
          uni.showModal({
            title: "提交失败",
            content: "错误详情: " + JSON.stringify(err),
            showCancel: false
          });
        }
      });
    },

          // 处理结果弹窗操作
    handleResultAction() {
      if (this.paymentSuccess) {
        // 申请成功，更新页面状态显示进度
        this.showResult = false;
        // 设置基本的退款申请信息，以便立即显示
        this.hasRefundRequest = true;
        // 同时设置为详情模式，隐藏退款记录按钮
        this.isDetailMode = true;
        this.refundInfo = {
          serialNumber: this.serialNumber,
          machineImage: this.machineImageCloud,
          status: "待审核",
          applyTime: new Date()
        };
        
        // 刷新云数据库的引用，确保最新的提交会被查询到
        wx.cloud.init({
          env: "cloud1-9grox8bwd6dbce0c",
          traceUser: true,
        });
        
        // 重新从数据库获取完整信息
        setTimeout(() => {
          this.checkRefundRequest();
        }, 1000); // 增加延迟，确保数据库操作完成
      } else {
        // 申请失败，关闭弹窗重试
        this.showResult = false;
      }
    },

    // 检查是否已申请退款
    checkRefundRequest() {
      if (!this.orderId) {
        return;
      }
      
      uni.showLoading({
        title: "加载中..."
      });
      
      const db = wx.cloud.database();
      db.collection("refund_requests")
        .where({
          orderId: this.orderId
        })
        .orderBy("applyTime", "desc")
        .limit(1)
        .get({
          success: (res) => {
            console.log("退款申请查询结果:", res.data);
            if (res.data && res.data.length > 0) {
              this.hasRefundRequest = true;
              this.refundInfo = res.data[0];
              this.refundStatus = res.data[0].status || "待审核";
            } else {
              this.hasRefundRequest = false;
            }
            uni.hideLoading();
          },
          fail: (err) => {
            console.error("查询退款申请失败:", err);
            this.hasRefundRequest = false;
            uni.hideLoading();
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
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    // 预览图片
    previewImage(fileID) {
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: (res) => {
          const tempUrl = res.fileList[0].tempFileURL;
          uni.previewImage({
            urls: [tempUrl],
            current: tempUrl
          });
        },
        fail: (err) => {
          console.error("获取图片链接失败:", err);
          uni.showToast({
            title: "图片加载失败",
            icon: "none"
          });
        }
      });
    },

    // 重置申请（当申请被拒绝时）
    resetApplication() {
      this.hasRefundRequest = false;
      this.serialNumber = this.refundInfo.serialNumber || "";
      this.machineImage = "";
      this.machineImageCloud = "";
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
              icon: "none"
            });
          } else if (res.tapIndex === 1) {
            // 电话客服
            uni.makePhoneCall({
              phoneNumber: "400-123-4567",
              fail: () => {
                uni.showToast({
                  title: "拨打失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    },

    // 跳转到退款记录页面
    goToRefundOrders() {
      uni.navigateTo({
        url: "/pages/deposit/refund-orders"
      });
    },
  },
};
</script>

<style>
.deposit-container {
  padding: 30rpx;
}

.status-card {
  background-color: #1296db;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  color: #fff;
  box-shadow: 0 4rpx 20rpx rgba(18, 150, 219, 0.2);
}

.card-header {
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refund-records-btn {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8rpx 16rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.arrow {
  margin-left: 6rpx;
}

.amount {
  font-size: 72rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.desc {
  font-size: 28rpx;
  opacity: 0.8;
  margin-bottom: 30rpx;
}

.order-info {
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
  opacity: 0.8;
}

.payment-methods,
.notice {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.payment-method:last-child {
  border-bottom: none;
}

.payment-method.active {
  background-color: rgba(18, 150, 219, 0.05);
}

.payment-method image {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.method-name {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.method-select {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1rpx solid #ddd;
  position: relative;
}

.payment-method.active .method-select:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #1296db;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.dot {
  margin-right: 10rpx;
  color: #1296db;
}

.notice-text {
  flex: 1;
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

/* 序列号输入相关样式 */
.serial-number-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.serial-input {
  width: 100%;
  height: 90rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.serial-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

/* 图片上传相关样式 */
.upload-section {
  margin-top: 30rpx;
}

.upload-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
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

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 60rpx;
  color: #ddd;
  line-height: 1;
}

.upload-text {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.action-buttons {
  display: flex;
  margin-top: 50rpx;
}

.action-btn {
  flex: 1;
  height: 90rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin: 0 15rpx;
}

.action-btn.cancel {
  background-color: #f5f5f5;
  color: #666;
}

.action-btn.confirm {
  background-color: #1296db;
  color: #fff;
}

.result-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.result-content {
  width: 600rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 50rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #ff5252;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 80rpx;
  margin-bottom: 30rpx;
}

.result-icon.success {
  background-color: #67c23a;
}

.result-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.result-desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 40rpx;
}

.result-btn {
  width: 400rpx;
  height: 90rpx;
  border-radius: 45rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 退款进度状态样式 */
.refund-status-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.progress-bar {
  position: relative;
  padding: 30rpx 0;
  margin: 20rpx 0 40rpx;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.progress-line {
  position: absolute;
  top: 60rpx;
  left: 40rpx;
  right: 40rpx;
  height: 2rpx;
  background-color: #eaeaea;
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.33%;
}

.step-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #eaeaea;
  margin-bottom: 15rpx;
}

.step-text {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.step-time {
  font-size: 20rpx;
  color: #bbb;
}

.progress-step.active .step-dot {
  background-color: #67c23a;
}

.progress-step.active .step-text {
  color: #333;
}

.progress-step.current .step-dot {
  width: 24rpx;
  height: 24rpx;
  background-color: #1296db;
  box-shadow: 0 0 0 6rpx rgba(18, 150, 219, 0.2);
}

.progress-step.current .step-text {
  color: #1296db;
  font-weight: bold;
}

.current-status {
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 28rpx;
  color: #666;
}

.status-value {
  font-size: 30rpx;
  color: #1296db;
  font-weight: bold;
}

.status-rejected {
  color: #ff5252;
}

.reject-reason {
  background-color: #fff0f0;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.reason-label {
  font-size: 28rpx;
  color: #ff5252;
  margin-bottom: 10rpx;
}

.reason-value {
  font-size: 26rpx;
  color: #666;
}

.refund-detail {
  margin-top: 30rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  font-size: 28rpx;
  border-bottom: 1px solid #f5f5f5;
}

.detail-label {
  color: #666;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.img-preview {
  color: #1296db;
  text-decoration: underline;
}

.reapply-btn-wrap {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}

.reapply-btn {
  width: 400rpx;
  height: 80rpx;
  background-color: #ff5252;
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.contact {
  background-color: #67c23a;
  color: #fff;
}
</style>
