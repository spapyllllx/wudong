const api = require('../../utils/api');
const app = getApp();

Page({
  data: {
    list: [],
    total: '0.00',
    count: 0,
    checkoutVisible: false,
    form: { consignee: '', phone: '', detail: '' }
  },

  onShow() {
    if (!app.globalData.token) {
      this.setData({ list: [] });
      return wx.showToast({ title: '请先到「我的」登录', icon: 'none' });
    }
    this.load();
  },

  async load() {
    try {
      const res = (await api.cartList()) || [];
      const total = res.reduce((s, c) => s + Number(c.price) * c.quantity, 0).toFixed(2);
      const count = res.reduce((s, c) => s + c.quantity, 0);
      this.setData({ list: res, total, count });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  async qty(e) {
    const { id, d } = e.currentTarget.dataset;
    const item = this.data.list.find((x) => x.id === id);
    if (!item) return;
    const q = item.quantity + Number(d);
    if (q <= 0) return;
    try {
      await api.cartUpdate(id, q);
      this.load();
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
    }
  },

  async remove(e) {
    const id = Number(e.currentTarget.dataset.id);
    try {
      await api.cartRemove([id]);
      this.load();
    } catch (err) {
      wx.showToast({ title: err.message, icon: 'none' });
    }
  },

  showCheckout() {
    this.setData({ checkoutVisible: true });
  },
  hideCheckout() {
    this.setData({ checkoutVisible: false });
  },
  onForm(e) {
    this.setData({ ['form.' + e.currentTarget.dataset.k]: e.detail.value });
  },

  async submit() {
    if (this.submitting) return; // 防双击重复下单
    const { consignee, phone, detail } = this.data.form;
    if (!consignee || !phone || !detail) {
      return wx.showToast({ title: '请填写完整收货信息', icon: 'none' });
    }
    const items = this.data.list.map((c) => ({ skuId: c.sku_id, quantity: c.quantity }));
    const cartIds = this.data.list.map((c) => c.id);
    wx.showLoading({ title: '提交中' });
    this.submitting = true;
    try {
      const orderId = await api.orderCreate({ items, consignee, phone, province: '', city: '', district: '', detail });
      wx.hideLoading();
      this.setData({ checkoutVisible: false, list: [] });
      // 清购物车失败不覆盖"下单成功"(否则会误导用户重试、造成重复下单)
      try {
        await api.cartRemove(cartIds);
      } catch (e) {}
      wx.showModal({
        title: '下单成功',
        content: '订单号:' + orderId + ',请到「我的-订单」模拟支付',
        showCancel: false,
        success: () => wx.switchTab({ url: '/pages/mine/mine' })
      });
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: e.message || '下单失败', icon: 'none' });
    } finally {
      this.submitting = false;
    }
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
