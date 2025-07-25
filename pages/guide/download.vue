<template>
  <view class="download-container">
    <!-- 页面头部 -->
    <view class="header-section">
      <view class="search-box">
        <image
          src="https://cdn-icons-png.flaticon.com/128/751/751463.png"
          class="search-icon"
        ></image>
        <input
          type="text"
          v-model="searchKey"
          placeholder="搜索资料"
          confirm-type="search"
          @confirm="searchDocs"
          class="search-input"
        />
        <view class="search-btn" @click="searchDocs">搜索</view>
      </view>
    </view>

    <!-- 分类切换 -->
    <view class="tab-container">
      <view
        class="tab-item"
        :class="{ 'tab-active': activeTab === item.id }"
        v-for="item in tabs"
        :key="item.id"
        @click="switchTab(item.id)"
      >
        {{ item.name }}
      </view>
    </view>

    <!-- 文档列表 -->
    <view class="docs-list">
      <view
        class="doc-item"
        v-for="(item, index) in filteredDocs"
        :key="index"
        @click="viewDocument(item)"
      >
        <view class="doc-icon">
          <image :src="getFileIcon(item.fileType)" class="file-icon"></image>
        </view>
        <view class="doc-content">
          <view class="doc-title">{{ item.title }}</view>
          <view class="doc-desc">{{ item.description }}</view>
          <view class="doc-info">
            <text class="doc-size">{{ item.fileSize }}</text>
            <text class="doc-time">{{ item.updateTime }}</text>
            <text class="doc-downloads">{{ item.downloads }}次下载</text>
          </view>
        </view>
        <view class="doc-actions">
          <view
            class="action-btn download-btn"
            @click.stop="downloadFile(item)"
          >
            <image
              src="https://cdn-icons-png.flaticon.com/128/724/724933.png"
              class="action-icon"
            ></image>
          </view>
        </view>
      </view>

      <!-- 无数据提示 -->
      <view class="empty-container" v-if="filteredDocs.length === 0">
        <image
          src="https://cdn-icons-png.flaticon.com/128/8832/8832119.png"
          class="empty-icon"
        ></image>
        <view class="empty-text">暂无相关资料</view>
      </view>
    </view>

    <!-- 热门下载 -->
    <view class="hot-section" v-if="filteredDocs.length > 0">
      <view class="section-title">热门下载</view>
      <view class="hot-list">
        <view
          class="hot-item"
          v-for="(item, index) in hotDocs"
          :key="index"
          @click="viewDocument(item)"
        >
          <image :src="getFileIcon(item.fileType)" class="hot-icon"></image>
          <view class="hot-info">
            <view class="hot-title">{{ item.title }}</view>
            <view class="hot-downloads">{{ item.downloads }}次下载</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 资料申请 -->
    <view class="apply-section">
      <view class="section-title">没找到需要的资料？</view>
      <view class="apply-desc"
        >您可以向我们申请获取更多资料，我们会尽快为您提供</view
      >
      <view class="apply-form">
        <view class="form-item">
          <view class="form-label">资料名称</view>
          <input
            type="text"
            v-model="applyForm.title"
            placeholder="请输入需要的资料名称"
            class="form-input"
          />
        </view>
        <view class="form-item">
          <view class="form-label">资料描述</view>
          <textarea
            v-model="applyForm.description"
            placeholder="请描述您需要的资料内容"
            class="form-textarea"
          ></textarea>
        </view>
        <view class="form-item">
          <view class="form-label">联系方式</view>
          <input
            type="text"
            v-model="applyForm.contact"
            placeholder="请输入您的联系方式"
            class="form-input"
          />
        </view>
        <view class="submit-btn" @click="submitApply">提交申请</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKey: "",
      activeTab: "all",
      tabs: [
        { id: "all", name: "全部" },
        { id: "manual", name: "用户手册" },
        { id: "tutorial", name: "操作教程" },
        { id: "form", name: "表格模板" },
        { id: "software", name: "软件工具" },
      ],
      documents: [
        {
          id: "d001",
          title: "POS机用户使用手册",
          description: "详细介绍POS机的功能、操作方法及注意事项",
          fileType: "pdf",
          fileSize: "2.5MB",
          updateTime: "2023-10-15",
          downloads: 1245,
          category: "manual",
          url: "https://example.com/files/pos_manual.pdf",
        },
        {
          id: "d002",
          title: "收款交易操作指南",
          description: "包含各种收款方式的详细操作流程",
          fileType: "pdf",
          fileSize: "1.8MB",
          updateTime: "2023-09-25",
          downloads: 986,
          category: "tutorial",
          url: "https://example.com/files/payment_guide.pdf",
        },
        {
          id: "d003",
          title: "商户结算对账表",
          description: "标准商户结算对账表格模板",
          fileType: "excel",
          fileSize: "568KB",
          updateTime: "2023-11-05",
          downloads: 752,
          category: "form",
          url: "https://example.com/files/settlement_template.xlsx",
        },
        {
          id: "d004",
          title: "POS机故障排查手册",
          description: "常见故障原因分析与解决方案",
          fileType: "pdf",
          fileSize: "3.2MB",
          updateTime: "2023-10-28",
          downloads: 645,
          category: "manual",
          url: "https://example.com/files/troubleshooting_guide.pdf",
        },
        {
          id: "d005",
          title: "POS机系统升级工具",
          description: "用于升级POS机系统版本的PC端工具",
          fileType: "exe",
          fileSize: "12.5MB",
          updateTime: "2023-11-10",
          downloads: 423,
          category: "software",
          url: "https://example.com/files/pos_updater.exe",
        },
        {
          id: "d006",
          title: "商户日常交易记录表",
          description: "用于记录日常交易流水的Excel模板",
          fileType: "excel",
          fileSize: "425KB",
          updateTime: "2023-09-18",
          downloads: 389,
          category: "form",
          url: "https://example.com/files/transaction_record.xlsx",
        },
        {
          id: "d007",
          title: "POS机收银员培训教程",
          description: "面向收银员的POS机操作培训教程",
          fileType: "ppt",
          fileSize: "5.7MB",
          updateTime: "2023-08-20",
          downloads: 347,
          category: "tutorial",
          url: "https://example.com/files/cashier_training.pptx",
        },
        {
          id: "d008",
          title: "交易数据导出工具",
          description: "用于导出POS机交易数据的小工具",
          fileType: "zip",
          fileSize: "4.3MB",
          updateTime: "2023-10-05",
          downloads: 298,
          category: "software",
          url: "https://example.com/files/data_export_tool.zip",
        },
        {
          id: "d009",
          title: "POS机硬件规格说明书",
          description: "详细介绍POS机硬件参数与接口说明",
          fileType: "pdf",
          fileSize: "1.5MB",
          updateTime: "2023-07-15",
          downloads: 276,
          category: "manual",
          url: "https://example.com/files/hardware_specs.pdf",
        },
        {
          id: "d010",
          title: "商户进件资料清单",
          description: "商户申请所需提交的资料清单",
          fileType: "word",
          fileSize: "325KB",
          updateTime: "2023-11-02",
          downloads: 254,
          category: "form",
          url: "https://example.com/files/merchant_checklist.docx",
        },
      ],
      applyForm: {
        title: "",
        description: "",
        contact: "",
      },
    };
  },
  computed: {
    // 根据当前分类和搜索关键词过滤文档
    filteredDocs() {
      let result = this.documents;

      // 按分类筛选
      if (this.activeTab !== "all") {
        result = result.filter((item) => item.category === this.activeTab);
      }

      // 按关键词搜索
      if (this.searchKey.trim()) {
        const key = this.searchKey.trim().toLowerCase();
        result = result.filter(
          (item) =>
            item.title.toLowerCase().includes(key) ||
            item.description.toLowerCase().includes(key)
        );
      }

      return result;
    },

    // 热门文档列表
    hotDocs() {
      // 按下载量排序取前5个
      return [...this.documents]
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 5);
    },
  },
  onLoad() {
    // 页面加载时获取文档列表
    this.getDocumentList();

    // 获取用户信息填充申请表单
    this.getUserInfo();
  },
  methods: {
    // 获取文档列表
    getDocumentList() {
      // 实际项目中应该从服务器获取数据
      // 这里使用模拟数据

      uni.showLoading({
        title: "加载中...",
      });

      // 模拟请求延迟
      setTimeout(() => {
        uni.hideLoading();
      }, 500);
    },

    // 获取用户信息
    getUserInfo() {
      const userInfoStr = uni.getStorageSync("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo && userInfo.phone) {
            this.applyForm.contact = userInfo.phone;
          }
        } catch (e) {
          console.error("解析用户信息失败", e);
        }
      }
    },

    // 切换分类标签
    switchTab(tabId) {
      this.activeTab = tabId;
      this.searchKey = "";
    },

    // 搜索文档
    searchDocs() {
      if (!this.searchKey.trim()) {
        this.showToast("请输入搜索关键词");
        return;
      }

      // 实际项目中应该发送请求搜索
      // 这里直接通过计算属性过滤

      // 隐藏键盘
      uni.hideKeyboard();
    },

    // 获取文件图标
    getFileIcon(fileType) {
      const iconMap = {
        pdf: "https://cdn-icons-png.flaticon.com/128/337/337946.png",
        word: "https://cdn-icons-png.flaticon.com/128/337/337932.png",
        excel: "https://cdn-icons-png.flaticon.com/128/337/337958.png",
        ppt: "https://cdn-icons-png.flaticon.com/128/337/337949.png",
        zip: "https://cdn-icons-png.flaticon.com/128/337/337960.png",
        exe: "https://cdn-icons-png.flaticon.com/128/337/337940.png",
        img: "https://cdn-icons-png.flaticon.com/128/337/337942.png",
        txt: "https://cdn-icons-png.flaticon.com/128/337/337956.png",
      };

      return (
        iconMap[fileType] ||
        "https://cdn-icons-png.flaticon.com/128/337/337937.png"
      );
    },

    // 查看文档详情
    viewDocument(doc) {
      uni.showActionSheet({
        itemList: ["查看详情", "立即下载", "分享文档"],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 查看详情
            uni.navigateTo({
              url: `/pages/guide/document-detail?id=${doc.id}`,
            });
          } else if (res.tapIndex === 1) {
            // 立即下载
            this.downloadFile(doc);
          } else if (res.tapIndex === 2) {
            // 分享文档
            this.shareDocument(doc);
          }
        },
      });
    },

    // 下载文件
    downloadFile(doc) {
      // 检查是否登录
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.showModal({
          title: "提示",
          content: "请先登录后再下载文档",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/user/index",
              });
            }
          },
        });
        return;
      }

      uni.showLoading({
        title: "准备下载...",
        mask: true,
      });

      // 实际项目中应该调用真实的下载接口
      setTimeout(() => {
        uni.hideLoading();

        // 模拟下载过程
        uni.showModal({
          title: "文件下载",
          content: `是否下载"${doc.title}"(${doc.fileSize})？`,
          success: (res) => {
            if (res.confirm) {
              this.showToast("开始下载，请稍候...");

              // 更新下载次数
              doc.downloads += 1;

              // 模拟下载完成
              setTimeout(() => {
                this.showToast("下载完成");
              }, 2000);
            }
          },
        });
      }, 500);
    },

    // 分享文档
    shareDocument(doc) {
      // 实际项目中应该调用分享API
      uni.showToast({
        title: "分享功能开发中",
        icon: "none",
      });
    },

    // 提交资料申请
    submitApply() {
      // 表单验证
      if (!this.applyForm.title) {
        this.showToast("请输入资料名称");
        return;
      }

      if (!this.applyForm.description) {
        this.showToast("请描述需要的资料内容");
        return;
      }

      if (!this.applyForm.contact) {
        this.showToast("请输入联系方式");
        return;
      }

      // 检查是否登录
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.showModal({
          title: "提示",
          content: "请先登录后再提交申请",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/user/index",
              });
            }
          },
        });
        return;
      }

      uni.showLoading({
        title: "提交中...",
        mask: true,
      });

      // 实际项目中应该调用提交API
      setTimeout(() => {
        uni.hideLoading();

        uni.showModal({
          title: "申请提交成功",
          content: "您的资料申请已提交，我们会尽快处理并与您联系",
          showCancel: false,
          success: () => {
            // 清空表单
            this.applyForm = {
              title: "",
              description: "",
              contact: this.applyForm.contact,
            };
          },
        });
      }, 1000);
    },

    // 显示提示
    showToast(title) {
      uni.showToast({
        title: title,
        icon: "none",
      });
    },
  },
};
</script>

<style>
.download-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 30rpx;
}

.header-section {
  padding: 30rpx;
  background-color: #1296db;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 40rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 15rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
}

.search-btn {
  width: 100rpx;
  height: 60rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 28rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-container {
  display: flex;
  background-color: #fff;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #eee;
}

.tab-item {
  padding: 30rpx 0;
  margin-right: 40rpx;
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
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}

.docs-list {
  background-color: #fff;
  margin: 20rpx 30rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.doc-item {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.doc-item:last-child {
  border-bottom: none;
}

.doc-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.file-icon {
  width: 100%;
  height: 100%;
}

.doc-content {
  flex: 1;
}

.doc-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.doc-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-info {
  font-size: 24rpx;
  color: #999;
  display: flex;
  align-items: center;
}

.doc-size,
.doc-time {
  margin-right: 20rpx;
}

.doc-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10rpx;
}

.download-btn {
  background-color: #1296db;
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
}

.empty-container {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.hot-section {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
}

.hot-item {
  width: 48%;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.hot-item:nth-child(2n) {
  margin-left: 4%;
}

.hot-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 15rpx;
  flex-shrink: 0;
}

.hot-info {
  flex: 1;
}

.hot-title {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 6rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-downloads {
  font-size: 22rpx;
  color: #999;
}

.apply-section {
  margin: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding: 30rpx;
}

.apply-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 30rpx;
}

.apply-form {
  margin-top: 20rpx;
}

.form-item {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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

.submit-btn {
  height: 80rpx;
  background-color: #1296db;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
</style>
