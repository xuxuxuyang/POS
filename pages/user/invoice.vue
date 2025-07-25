<template>
  <view class="invoice-container">
    <!-- 页面头部 -->
    <view class="header-section">
      <image
        src="https://cdn-icons-png.flaticon.com/128/3371/3371540.png"
        class="header-icon"
      ></image>
      <view class="header-title">发票管理</view>
      <view class="header-desc">查看和申请您的电子发票</view>
    </view>

    <!-- 操作栏 -->
    <view class="action-bar">
      <view class="tabs">
        <view
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'all' }"
          @click="switchTab('all')"
          >全部</view
        >
        <view
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'pending' }"
          @click="switchTab('pending')"
          >开票中</view
        >
        <view
          class="tab-item"
          :class="{ 'tab-active': activeTab === 'completed' }"
          @click="switchTab('completed')"
          >已开票</view
        >
      </view>
      <view class="apply-btn" @click="showApplyForm">申请发票</view>
    </view>

    <!-- 发票列表 -->
    <view class="invoice-list" v-if="filteredInvoices.length > 0">
      <view
        class="invoice-item"
        v-for="(invoice, index) in filteredInvoices"
        :key="index"
        @click="viewInvoiceDetail(invoice)"
      >
        <view class="invoice-left">
          <view class="invoice-title">{{ invoice.title }}</view>
          <view class="invoice-info">
            <text>金额: ¥{{ invoice.amount }}</text>
            <text>开票日期: {{ invoice.date }}</text>
          </view>
          <view class="invoice-order">订单号: {{ invoice.orderNo }}</view>
        </view>
        <view class="invoice-right">
          <view class="invoice-status" :class="getStatusClass(invoice.status)">
            {{ getStatusText(invoice.status) }}
          </view>
          <view class="invoice-actions">
            <view
              class="action-btn download"
              v-if="invoice.status === 'completed'"
              @click.stop="downloadInvoice(invoice)"
            >
              <image
                src="https://cdn-icons-png.flaticon.com/128/2550/2550364.png"
                class="action-icon"
              ></image>
              <text>下载</text>
            </view>
            <view
              class="action-btn send-email"
              v-if="invoice.status === 'completed'"
              @click.stop="sendEmail(invoice)"
            >
              <image
                src="https://cdn-icons-png.flaticon.com/128/561/561127.png"
                class="action-icon"
              ></image>
              <text>发送邮箱</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="filteredInvoices.length === 0">
      <image
        src="https://cdn-icons-png.flaticon.com/128/7486/7486754.png"
        class="empty-icon"
      ></image>
      <view class="empty-text">暂无发票记录</view>
      <view class="empty-subtext">您可以点击"申请发票"按钮申请开具发票</view>
      <view class="empty-btn" @click="showApplyForm">申请发票</view>
    </view>

    <!-- 发票申请表单弹窗 -->
    <view class="modal" v-if="showModal">
      <view class="modal-mask" @click="hideApplyForm"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">申请发票</text>
          <text class="modal-close" @click="hideApplyForm">×</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <view class="form-label">发票类型</view>
            <picker
              mode="selector"
              :range="invoiceTypes"
              @change="onInvoiceTypeChange"
              class="form-picker"
            >
              <view class="picker-text">{{
                invoiceTypes[invoiceTypeIndex]
              }}</view>
            </picker>
          </view>
          <view class="form-group">
            <view class="form-label">抬头类型</view>
            <view class="radio-group">
              <view
                class="radio-item"
                @click="applyForm.titleType = 'personal'"
              >
                <view
                  class="radio"
                  :class="{
                    'radio-active': applyForm.titleType === 'personal',
                  }"
                ></view>
                <text>个人</text>
              </view>
              <view class="radio-item" @click="applyForm.titleType = 'company'">
                <view
                  class="radio"
                  :class="{ 'radio-active': applyForm.titleType === 'company' }"
                ></view>
                <text>企业</text>
              </view>
            </view>
          </view>
          <view class="form-group">
            <view class="form-label">发票抬头</view>
            <input
              type="text"
              v-model="applyForm.title"
              placeholder="请输入发票抬头"
              class="form-input"
            />
          </view>
          <view class="form-group" v-if="applyForm.titleType === 'company'">
            <view class="form-label">税号</view>
            <input
              type="text"
              v-model="applyForm.taxNumber"
              placeholder="请输入纳税人识别号"
              class="form-input"
            />
          </view>
          <view class="form-group">
            <view class="form-label">订单选择</view>
            <picker
              mode="selector"
              :range="orderOptions"
              range-key="text"
              @change="onOrderChange"
              class="form-picker"
            >
              <view class="picker-text">{{
                orderOptions[orderIndex].text
              }}</view>
            </picker>
          </view>
          <view class="form-group">
            <view class="form-label">收票邮箱</view>
            <input
              type="text"
              v-model="applyForm.email"
              placeholder="请输入接收电子发票的邮箱"
              class="form-input"
            />
          </view>
          <view class="form-group">
            <view class="form-label">备注</view>
            <textarea
              v-model="applyForm.remark"
              placeholder="选填"
              class="form-textarea"
            ></textarea>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn cancel" @click="hideApplyForm">取消</view>
          <view class="modal-btn confirm" @click="submitApply">确认申请</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "all",
      showModal: false,
      invoiceTypes: ["增值税电子普通发票", "增值税专用发票"],
      invoiceTypeIndex: 0,
      orderOptions: [
        { id: 0, text: "请选择订单", value: "" },
        {
          id: 1,
          text: "订单号: PO20231001001 - ¥99.00",
          value: "PO20231001001",
        },
        {
          id: 2,
          text: "订单号: PO20231005002 - ¥199.00",
          value: "PO20231005002",
        },
        {
          id: 3,
          text: "订单号: PO20231010003 - ¥299.00",
          value: "PO20231010003",
        },
      ],
      orderIndex: 0,
      applyForm: {
        titleType: "personal",
        title: "",
        taxNumber: "",
        orderId: "",
        email: "",
        remark: "",
      },
      invoices: [
        {
          id: 1,
          title: "张三",
          amount: "99.00",
          date: "2023-10-15",
          orderNo: "PO20231001001",
          status: "completed",
          type: "增值税电子普通发票",
          pdfUrl: "https://example.com/invoice_1.pdf",
          email: "zhangsan@example.com",
        },
        {
          id: 2,
          title: "北京科技有限公司",
          amount: "199.00",
          date: "2023-10-20",
          orderNo: "PO20231005002",
          status: "pending",
          type: "增值税专用发票",
          taxNumber: "91110000123456789A",
          email: "finance@company.com",
        },
        {
          id: 3,
          title: "李四",
          amount: "299.00",
          date: "2023-10-25",
          orderNo: "PO20231010003",
          status: "completed",
          type: "增值税电子普通发票",
          pdfUrl: "https://example.com/invoice_3.pdf",
          email: "lisi@example.com",
        },
      ],
    };
  },
  computed: {
    filteredInvoices() {
      if (this.activeTab === "all") {
        return this.invoices;
      } else if (this.activeTab === "pending") {
        return this.invoices.filter((invoice) => invoice.status === "pending");
      } else if (this.activeTab === "completed") {
        return this.invoices.filter(
          (invoice) => invoice.status === "completed"
        );
      }
      return this.invoices;
    },
  },
  methods: {
    // 切换标签
    switchTab(tab) {
      this.activeTab = tab;
    },

    // 获取状态样式类
    getStatusClass(status) {
      return {
        completed: status === "completed",
        pending: status === "pending",
      };
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        completed: "已开票",
        pending: "开票中",
      };
      return statusMap[status] || status;
    },

    // 查看发票详情
    viewInvoiceDetail(invoice) {
      uni.showModal({
        title: "发票详情",
        content: `发票抬头: ${invoice.title}\n发票金额: ¥${
          invoice.amount
        }\n开票日期: ${invoice.date}\n发票类型: ${invoice.type}\n${
          invoice.taxNumber ? "税号: " + invoice.taxNumber : ""
        }`,
        showCancel: false,
        confirmText: "确定",
      });
    },

    // 下载发票
    downloadInvoice(invoice) {
      // 实际项目中应该跳转到文件下载链接或调用相关API
      uni.showLoading({
        title: "准备下载...",
      });

      setTimeout(() => {
        uni.hideLoading();

        uni.showModal({
          title: "下载提示",
          content: `由于微信小程序限制，请复制链接在浏览器中下载发票`,
          confirmText: "复制链接",
          success: (res) => {
            if (res.confirm) {
              uni.setClipboardData({
                data: invoice.pdfUrl,
                success: () => {
                  uni.showToast({
                    title: "链接已复制",
                    icon: "success",
                  });
                },
              });
            }
          },
        });
      }, 1000);
    },

    // 发送邮箱
    sendEmail(invoice) {
      uni.showLoading({
        title: "发送中...",
      });

      setTimeout(() => {
        uni.hideLoading();

        uni.showToast({
          title: "发票已发送至邮箱",
          icon: "success",
        });
      }, 1500);
    },

    // 显示申请表单
    showApplyForm() {
      this.showModal = true;
    },

    // 隐藏申请表单
    hideApplyForm() {
      this.showModal = false;

      // 重置表单
      this.applyForm = {
        titleType: "personal",
        title: "",
        taxNumber: "",
        orderId: "",
        email: "",
        remark: "",
      };
      this.invoiceTypeIndex = 0;
      this.orderIndex = 0;
    },

    // 选择发票类型
    onInvoiceTypeChange(e) {
      this.invoiceTypeIndex = e.detail.value;
    },

    // 选择订单
    onOrderChange(e) {
      this.orderIndex = e.detail.value;
      this.applyForm.orderId = this.orderOptions[this.orderIndex].value;
    },

    // 提交申请
    submitApply() {
      // 表单验证
      if (!this.applyForm.title) {
        uni.showToast({
          title: "请输入发票抬头",
          icon: "none",
        });
        return;
      }

      if (this.applyForm.titleType === "company" && !this.applyForm.taxNumber) {
        uni.showToast({
          title: "请输入税号",
          icon: "none",
        });
        return;
      }

      if (!this.applyForm.orderId) {
        uni.showToast({
          title: "请选择订单",
          icon: "none",
        });
        return;
      }

      if (!this.applyForm.email) {
        uni.showToast({
          title: "请输入收票邮箱",
          icon: "none",
        });
        return;
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.applyForm.email)) {
        uni.showToast({
          title: "邮箱格式不正确",
          icon: "none",
        });
        return;
      }

      // 显示加载中
      uni.showLoading({
        title: "提交中...",
      });

      // 模拟提交过程
      setTimeout(() => {
        uni.hideLoading();

        // 添加新的发票记录
        const selectedOrder = this.orderOptions.find(
          (order) => order.value === this.applyForm.orderId
        );
        if (selectedOrder) {
          const orderAmount = selectedOrder.text.match(/¥([\d.]+)/)[1];

          const newInvoice = {
            id: this.invoices.length + 1,
            title: this.applyForm.title,
            amount: orderAmount,
            date: new Date().toISOString().split("T")[0],
            orderNo: this.applyForm.orderId,
            status: "pending",
            type: this.invoiceTypes[this.invoiceTypeIndex],
            email: this.applyForm.email,
          };

          if (this.applyForm.titleType === "company") {
            newInvoice.taxNumber = this.applyForm.taxNumber;
          }

          this.invoices.unshift(newInvoice);
        }

        // 隐藏弹窗
        this.hideApplyForm();

        // 显示提交成功
        uni.showToast({
          title: "申请提交成功",
          icon: "success",
        });

        // 切换到开票中标签
        this.activeTab = "pending";
      }, 1500);
    },
  },
};
</script>

<style>
.invoice-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 40rpx;
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background: linear-gradient(to right, #1296db, #14b8e4);
  color: #fff;
}

.header-icon {
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.header-desc {
  font-size: 28rpx;
  opacity: 0.9;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.tabs {
  display: flex;
}

.tab-item {
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-active {
  color: #1296db;
  font-weight: bold;
}

.tab-active::after {
  content: "";
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}

.apply-btn {
  padding: 10rpx 30rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
}

.invoice-list {
  padding: 0 30rpx;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.invoice-left {
  flex: 1;
}

.invoice-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.invoice-info {
  display: flex;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.invoice-info text {
  margin-right: 30rpx;
}

.invoice-order {
  font-size: 24rpx;
  color: #999;
}

.invoice-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.invoice-status {
  font-size: 26rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.invoice-status.completed {
  background-color: #e6f7ff;
  color: #1296db;
}

.invoice-status.pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.invoice-actions {
  display: flex;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 30rpx;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 6rpx;
}

.action-btn text {
  font-size: 22rpx;
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
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.empty-subtext {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.empty-btn {
  padding: 15rpx 60rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 0 20rpx;
}

.modal-body {
  padding: 30rpx;
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.form-input,
.form-picker {
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
}

.picker-text {
  color: #333;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.radio-group {
  display: flex;
}

.radio-item {
  display: flex;
  align-items: center;
  margin-right: 60rpx;
}

.radio {
  width: 36rpx;
  height: 36rpx;
  border: 1rpx solid #ddd;
  border-radius: 50%;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-active {
  border-color: #1296db;
}

.radio-active::after {
  content: "";
  width: 20rpx;
  height: 20rpx;
  background-color: #1296db;
  border-radius: 50%;
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.modal-btn.cancel {
  background-color: #f7f7f7;
  color: #666;
}

.modal-btn.confirm {
  background-color: #1296db;
  color: #fff;
}
</style>
