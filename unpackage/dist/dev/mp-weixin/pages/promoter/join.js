"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      advantages: [
        {
          icon: "https://cdn-icons-png.flaticon.com/128/2258/2258843.png",
          title: "高额返佣",
          desc: "每台设备销售返佣30%，持续推广享受被动收入"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/3297/3297954.png",
          title: "专业支持",
          desc: "提供全套营销物料和培训支持，无需专业知识"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/7315/7315073.png",
          title: "灵活兼职",
          desc: "时间自由，地点不限，适合全职或兼职推广"
        },
        {
          icon: "https://cdn-icons-png.flaticon.com/128/5582/5582915.png",
          title: "成长空间",
          desc: "团队发展模式，可建立自己的销售团队获取更高收益"
        }
      ],
      profitItems: [
        { value: "30%", label: "直接返佣" },
        { value: "10%", label: "团队提成" },
        { value: "¥500", label: "首单奖励" }
      ],
      profitDesc: [
        "销售一台POS机直接获得30%的佣金返还",
        "发展下级推广员，可获得其销售额10%的团队提成",
        "成功销售首单即可获得额外500元新人奖励",
        "月销售额达到目标可获得额外奖金和奖品"
      ],
      processList: [
        {
          title: "提交申请",
          desc: "填写基本信息和联系方式提交加盟申请"
        },
        {
          title: "资质审核",
          desc: "系统审核个人资质，一般1-2个工作日完成"
        },
        {
          title: "签订协议",
          desc: "线上签署合作协议，明确双方权益和义务"
        },
        {
          title: "开通账号",
          desc: "获得专属推广码和后台账号，开始推广"
        }
      ],
      faqList: [
        {
          question: "需要投入多少资金才能成为码商？",
          answer: "成为码商无需前期投入，我们采用零门槛加盟模式。只需通过资质审核即可开始推广赚取佣金。",
          open: false
        },
        {
          question: "佣金如何结算？",
          answer: "佣金每月结算一次，系统自动核算上月业绩，次月10日前打款至您的微信或银行账户。",
          open: false
        },
        {
          question: "没有相关经验可以加盟吗？",
          answer: "完全可以。我们提供完整的产品培训和销售技巧指导，新手也能快速上手。同时提供营销素材和话术，帮助您轻松开展推广。",
          open: false
        },
        {
          question: "如何提高销售业绩？",
          answer: "我们建议：1. 熟悉产品功能和卖点；2. 利用朋友圈和社交媒体进行宣传；3. 参加我们的线上培训；4. 与其他码商交流经验；5. 发展自己的团队提高整体收益。",
          open: false
        }
      ]
    };
  },
  methods: {
    // 切换FAQ展开状态
    toggleFaq(index) {
      this.faqList[index].open = !this.faqList[index].open;
    },
    // 申请加盟
    handleApply() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再申请",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.switchTab({
                url: "/pages/user/index"
              });
            }
          }
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/promoter/apply"
      });
    },
    // 联系客服
    contactService() {
      common_vendor.index.showActionSheet({
        itemList: ["在线客服", "电话咨询"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.showToast({
              title: "正在接入客服...",
              icon: "none"
            });
          } else if (res.tapIndex === 1) {
            common_vendor.index.makePhoneCall({
              phoneNumber: "400-123-4567",
              fail: () => {
                common_vendor.index.showToast({
                  title: "拨打失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.advantages, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.desc),
        d: index
      };
    }),
    b: common_vendor.f($data.profitItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.value),
        b: common_vendor.t(item.label),
        c: index
      };
    }),
    c: common_vendor.f($data.profitDesc, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    d: common_vendor.f($data.processList, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.desc),
        d: index
      };
    }),
    e: common_vendor.f($data.faqList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.question),
        b: common_vendor.t(item.open ? "▼" : "▶"),
        c: item.open ? 1 : "",
        d: item.open
      }, item.open ? {
        e: common_vendor.t(item.answer)
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.toggleFaq(index), index)
      });
    }),
    f: common_vendor.o((...args) => $options.handleApply && $options.handleApply(...args)),
    g: common_vendor.o((...args) => $options.contactService && $options.contactService(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/promoter/join.js.map
