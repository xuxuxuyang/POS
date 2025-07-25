"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      productId: null,
      productImages: [],
      product: {},
      showAllParams: false,
      isFavorite: false,
      showSpecsPopup: false,
      quantity: 1,
      selectedSpecs: {
        version: "",
        color: "",
        package: ""
      },
      specsOptions: {
        versions: ["标准版", "高级版", "企业版"],
        colors: ["白色", "黑色", "灰色"],
        packages: ["基础套餐", "标准套餐", "豪华套餐"]
      },
      servicePromises: [
        { icon: "icon-quality", text: "正品保证" },
        { icon: "icon-delivery", text: "全国包邮" },
        { icon: "icon-support", text: "7天包换" },
        { icon: "icon-warranty", text: "一年保修" }
      ],
      relatedProducts: []
    };
  },
  onLoad(options) {
    if (options.id) {
      this.productId = options.id;
      this.loadProductDetail();
    }
  },
  onShareAppMessage() {
    return {
      title: this.product.name,
      path: "/pages/product/detail?id=" + this.productId,
      imageUrl: this.product.image
    };
  },
  methods: {
    // 加载产品详情
    loadProductDetail() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      setTimeout(() => {
        this.productImages = [
          "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
          "https://cdn-icons-png.flaticon.com/128/2332/2332039.png",
          "https://cdn-icons-png.flaticon.com/128/1546/1546406.png"
        ];
        this.product = {
          id: this.productId,
          name: "智能POS机A1 Pro",
          desc: "支持扫码/刷卡/NFC，支持多种支付方式，性能稳定可靠，适用于各类商户",
          image: "https://cdn-icons-png.flaticon.com/128/9553/9553028.png",
          price: "1580",
          rate: "0.38%",
          deposit: 99,
          sales: 2386,
          stock: 999,
          deliveryTime: "7天内发货",
          tags: ["热销", "新品", "包邮"],
          params: {
            产品型号: "A1-Pro",
            处理器: "四核1.5GHz",
            内存: "1GB",
            存储: "8GB",
            屏幕: "5.5英寸触摸屏",
            电池: "2500mAh",
            通讯: "4G/WiFi/蓝牙",
            尺寸: "145×78×18mm",
            重量: "350g",
            系统: "Android 8.1",
            支付方式: "扫码/刷卡/NFC",
            接口: "USB/TypeC/HDMI",
            打印: "内置热敏打印机",
            摄像头: "500万像素",
            扫码: "支持一维码/二维码",
            认证: "银联/PCI"
          },
          detailHtml: '<div style="padding:20px;"><h3 style="color:#333;font-size:16px;margin-bottom:15px;">产品介绍</h3><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:15px;">智能POS机A1 Pro是一款集收款、会员管理、营销推广于一体的智能支付终端，满足各类商户的收银需求。支持扫码支付、刷卡支付、NFC支付等多种支付方式，高性能处理器和大容量电池保证全天候稳定工作。</p><img src="https://cdn-icons-png.flaticon.com/128/2332/2332039.png" style="width:100%;margin:15px 0;"><h3 style="color:#333;font-size:16px;margin:15px 0;">功能特点</h3><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">1. 多种支付：支持扫码、刷卡、NFC等多种支付方式</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">2. 快速结算：高性能处理器，秒级完成交易</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">3. 内置打印：热敏打印，无需外接打印机</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">4. 会员管理：支持会员卡、积分、优惠券等功能</p><p style="color:#666;font-size:14px;line-height:1.6;margin-bottom:10px;">5. 营销推广：支持多种营销活动设置</p><img src="https://cdn-icons-png.flaticon.com/128/1546/1546406.png" style="width:100%;margin:15px 0;"></div>'
        };
        this.loadRelatedProducts();
        common_vendor.index.hideLoading();
      }, 500);
    },
    // 加载相关推荐产品
    loadRelatedProducts() {
      this.relatedProducts = [
        {
          id: 2,
          name: "移动POS机B2 Plus",
          price: "980",
          image: "https://cdn-icons-png.flaticon.com/128/1546/1546406.png"
        },
        {
          id: 3,
          name: "多功能收款机C3",
          price: "2680",
          image: "https://cdn-icons-png.flaticon.com/128/2332/2332039.png"
        },
        {
          id: 4,
          name: "商用收银一体机D5",
          price: "3999",
          image: "https://cdn-icons-png.flaticon.com/128/2897/2897780.png"
        }
      ];
    },
    // 跳转到产品详情
    goToProductDetail(product) {
      common_vendor.index.navigateTo({
        url: "/pages/product/detail?id=" + product.id
      });
    },
    // 跳转到首页
    goToHome() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    },
    // 跳转到申请页面
    goToApply() {
      if (!this.isSpecsSelected() && this.specsOptions.versions.length > 0) {
        common_vendor.index.showToast({
          title: "请选择规格",
          icon: "none"
        });
        this.showSpecsPopup = true;
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/apply/index?id=" + this.productId + this.getSpecsQueryString()
      });
    },
    // 联系客服
    contactService() {
      common_vendor.index.showToast({
        title: "正在接入客服...",
        icon: "none"
      });
    },
    // 收藏切换
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      common_vendor.index.showToast({
        title: this.isFavorite ? "收藏成功" : "已取消收藏",
        icon: "success"
      });
    },
    // 数量增加
    increaseQuantity() {
      if (this.quantity < 99) {
        this.quantity++;
      }
    },
    // 数量减少
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    // 选择规格
    selectSpecs(type, value) {
      this.selectedSpecs[type] = value;
    },
    // 确认规格
    confirmSpecs() {
      if (!this.isSpecsSelected()) {
        common_vendor.index.showToast({
          title: "请选择完整规格",
          icon: "none"
        });
        return;
      }
      this.showSpecsPopup = false;
      common_vendor.index.showToast({
        title: "已选择: " + this.getSelectedSpecsText(),
        icon: "success"
      });
    },
    // 检查是否已选择规格
    isSpecsSelected() {
      if (this.specsOptions.versions.length === 0) {
        return true;
      }
      return this.selectedSpecs.version && this.selectedSpecs.color && this.selectedSpecs.package;
    },
    // 获取已选规格文本
    getSelectedSpecsText() {
      if (!this.isSpecsSelected()) {
        return "请选择完整规格";
      }
      return `${this.selectedSpecs.version} ${this.selectedSpecs.color} ${this.selectedSpecs.package}`;
    },
    // 获取规格查询字符串
    getSpecsQueryString() {
      if (!this.isSpecsSelected()) {
        return "";
      }
      return `&version=${encodeURIComponent(
        this.selectedSpecs.version
      )}&color=${encodeURIComponent(
        this.selectedSpecs.color
      )}&package=${encodeURIComponent(this.selectedSpecs.package)}&quantity=${this.quantity}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.productImages, (item, index, i0) => {
      return {
        a: item,
        b: index
      };
    }),
    b: common_vendor.t($data.product.name),
    c: common_vendor.f($data.product.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    d: common_vendor.t($data.product.price),
    e: common_vendor.t($data.product.sales),
    f: common_vendor.t($data.product.rate),
    g: common_vendor.t($data.product.deposit),
    h: common_vendor.t($data.product.deliveryTime),
    i: common_vendor.t($data.product.desc),
    j: common_vendor.f($data.servicePromises, (item, index, i0) => {
      return {
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.text),
        c: index
      };
    }),
    k: common_vendor.t($data.selectedSpecs.version || "请选择"),
    l: common_vendor.o(($event) => $data.showSpecsPopup = true),
    m: common_vendor.t($data.selectedSpecs.color || "请选择"),
    n: common_vendor.o(($event) => $data.showSpecsPopup = true),
    o: common_vendor.t($data.selectedSpecs.package || "请选择"),
    p: common_vendor.o(($event) => $data.showSpecsPopup = true),
    q: common_vendor.t($data.showAllParams ? "收起" : "查看全部"),
    r: common_vendor.o(($event) => $data.showAllParams = !$data.showAllParams),
    s: common_vendor.f($data.product.params, (value, key, index) => {
      return {
        a: common_vendor.t(key),
        b: common_vendor.t(value),
        c: key,
        d: $data.showAllParams || index < 5
      };
    }),
    t: $data.showAllParams ? 1 : "",
    v: $data.product.detailHtml,
    w: $data.relatedProducts.length > 0
  }, $data.relatedProducts.length > 0 ? {
    x: common_vendor.f($data.relatedProducts, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: index,
        e: common_vendor.o(($event) => $options.goToProductDetail(item), index)
      };
    })
  } : {}, {
    y: $data.showSpecsPopup
  }, $data.showSpecsPopup ? {
    z: common_vendor.o(($event) => $data.showSpecsPopup = false),
    A: $data.product.image,
    B: common_vendor.t($data.product.price),
    C: common_vendor.t($data.product.stock),
    D: common_vendor.t($options.getSelectedSpecsText()),
    E: common_vendor.o(($event) => $data.showSpecsPopup = false),
    F: common_vendor.f($data.specsOptions.versions, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $data.selectedSpecs.version === item ? 1 : "",
        d: common_vendor.o(($event) => $options.selectSpecs("version", item), item)
      };
    }),
    G: common_vendor.f($data.specsOptions.colors, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $data.selectedSpecs.color === item ? 1 : "",
        d: common_vendor.o(($event) => $options.selectSpecs("color", item), item)
      };
    }),
    H: common_vendor.f($data.specsOptions.packages, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $data.selectedSpecs.package === item ? 1 : "",
        d: common_vendor.o(($event) => $options.selectSpecs("package", item), item)
      };
    }),
    I: common_vendor.o((...args) => $options.decreaseQuantity && $options.decreaseQuantity(...args)),
    J: $data.quantity,
    K: common_vendor.o(($event) => $data.quantity = $event.detail.value),
    L: common_vendor.o((...args) => $options.increaseQuantity && $options.increaseQuantity(...args)),
    M: common_vendor.o((...args) => $options.confirmSpecs && $options.confirmSpecs(...args))
  } : {}, {
    N: common_vendor.o((...args) => $options.goToHome && $options.goToHome(...args)),
    O: common_vendor.o((...args) => $options.contactService && $options.contactService(...args)),
    P: common_vendor.n($data.isFavorite ? "icon-favorite-filled" : "icon-favorite"),
    Q: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args)),
    R: common_vendor.o(($event) => $data.showSpecsPopup = true),
    S: common_vendor.o((...args) => $options.goToApply && $options.goToApply(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/detail.js.map
