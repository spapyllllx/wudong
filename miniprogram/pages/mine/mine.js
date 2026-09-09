const api = require('../../utils/api');
const app = getApp();

Page({
  data: {
    logged: false,
    loginForm: { phone: '13800000000', password: '123456' },
    favorites: [],
    orders: [],
    statusText: {
      pending: '待支付',
      paid: '已支付',
      cancelled: '已取消',
      completed: '已完成',
      refunded: '已退款'
    }
  },

  onShow() {
    const logged = !!app.globalData.token;
    this.setData({ logged });
    if (logged) {
      this.loadFav();
      this.loadOrders();
    }
  },

  onPullDownRefresh() {
    this.onShow();
    wx.stopPullDownRefresh();
  },

  onLogin(e) {
    this.setData({ ['loginForm.' + e.currentTarget.dataset.k]: e.detail.value });
  },

  async doLogin() {
    wx.showLoading({ title: '登录中' });
    try {
      const { phone, password } = this.data.loginForm;
      const data = await api.login(phone, password);
      app.globalData.token = data.token;
      wx.setStorageSync('app_token', data.token);
      wx.hideLoading();
      this.setData({ logged: true });
      wx.showToast({ title: '登录成功', icon: 'success' });
      this.loadFav();
      this.loadOrders();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: e.message || '登录失败', icon: 'none' });
    }
  },

  logout() {
    app.globalData.token = '';
    wx.removeStorageSync('app_token');
    this.setData({ logged: false, favorites: [], orders: [] });
  },

  async loadFav() {
    try {
      const res = await api.myFavorites();
      this.setData({ favorites: res.list || [] });
    } catch (e) {}
  },

  async loadOrders() {
    try {
      const res = await api.myOrders();
      this.setData({ orders: res.list || [] });
    } catch (e) {}
  },

  async orderOp(e) {
    const { id, op } = e.currentTarget.dataset;
    try {
      await { pay: api.orderPay, cancel: api.orderCancel, confirm: api.orderConfirm }[op](Number(id));
      wx.showToast({ title: '操作成功', icon: 'success' });
      this.loadOrders();
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' });
    }
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  // ---------- 评价 ----------
  openEval(e) {
    const d = e.currentTarget.dataset;
    this.setData({
      evalVisible: true,
      evalOrder: { orderId: Number(d.order), productId: Number(d.product), rating: 5, content: '' }
    });
  },
  hideEval() {
    this.setData({ evalVisible: false });
  },
  pickStar(e) {
    this.setData({ 'evalOrder.rating': Number(e.currentTarget.dataset.v) });
  },
  onEvalContent(e) {
    this.setData({ 'evalOrder.content': e.detail.value });
  },
  async submitEval() {
    const { orderId, productId, rating, content } = this.data.evalOrder;
    if (!content.trim()) return wx.showToast({ title: '请输入评价内容', icon: 'none' });
    try {
      await api.reviewSubmit({ orderId, productId, rating, content: content.trim() });
      wx.showToast({ title: '评价成功', icon: 'success' });
      this.setData({ evalVisible: false });
    } catch (e) {
      wx.showToast({ title: e.message || '评价失败', icon: 'none' });
    }
  }
});
