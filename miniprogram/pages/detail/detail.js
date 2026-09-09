const api = require('../../utils/api');
const app = getApp();

Page({
  data: {
    detail: null,
    images: [],
    reviews: [],
    favorited: false,
    buy: { skuId: null, quantity: 1, consignee: '', phone: '', detail: '' }
  },

  onLoad(options) {
    this.id = Number(options.id);
    this.load();
  },

  async load() {
    try {
      const detail = await api.productDetail(this.id);
      const images = detail.images && detail.images.length ? detail.images : [detail.main_image];
      this.setData({
        detail,
        images,
        'buy.skuId': detail.skus && detail.skus.length ? detail.skus[0].id : null
      });
      wx.setNavigationBarTitle({ title: detail.title });
      const rs = await api.productReviews({ product_id: this.id, size: 20 });
      this.setData({ reviews: rs.list || [] });
      this.checkFav();
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  async checkFav() {
    try {
      const fav = await api.myFavorites();
      this.setData({ favorited: fav.list.some((p) => Number(p.id) === this.id) });
    } catch (e) {}
  },

  preview(e) {
    wx.previewImage({ current: e.currentTarget.dataset.url, urls: this.data.images });
  },

  pickSku(e) {
    this.setData({ 'buy.skuId': Number(e.currentTarget.dataset.id) });
  },
  qty(e) {
    const q = Math.max(1, this.data.buy.quantity + Number(e.currentTarget.dataset.d));
    this.setData({ 'buy.quantity': q });
  },
  onInput(e) {
    this.setData({ ['buy.' + e.currentTarget.dataset.k]: e.detail.value });
  },

  async doFav() {
    if (!this.ensureLogin()) return;
    try {
      const fav = await api.favorite(this.id);
      this.setData({ favorited: fav });
      wx.showToast({ title: fav ? '收藏成功' : '已取消收藏', icon: 'none' });
    } catch (e) {
      this.handleErr(e);
    }
  },

  async doAddCart() {
    if (!this.data.buy.skuId) return wx.showToast({ title: '请先选择规格', icon: 'none' });
    if (!this.ensureLogin()) return;
    try {
      const res = await api.cartAdd(this.data.buy.skuId, this.data.buy.quantity);
      wx.showToast({ title: '已加入购物车(' + res.quantity + '件)', icon: 'success' });
    } catch (e) {
      this.handleErr(e);
    }
  },

  ensureLogin() {
    if (app.globalData.token) return true;
    wx.showModal({
      title: '请先登录',
      content: '未登录,前往「我的」页使用演示账号登录?',
      success: (r) => {
        if (r.confirm) wx.switchTab({ url: '/pages/mine/mine' });
      }
    });
    return false;
  },

  async doBuy() {
    if (!this.data.buy.skuId) return wx.showToast({ title: '请先选择规格', icon: 'none' });
    if (!this.data.buy.consignee || !this.data.buy.phone || !this.data.buy.detail) {
      return wx.showToast({ title: '请填写完整收货信息', icon: 'none' });
    }
    if (!this.ensureLogin()) return;
    wx.showLoading({ title: '下单中' });
    try {
      const orderId = await api.orderCreate({
        skuId: this.data.buy.skuId,
        quantity: this.data.buy.quantity,
        consignee: this.data.buy.consignee,
        phone: this.data.buy.phone,
        province: '',
        city: '',
        district: '',
        detail: this.data.buy.detail
      });
      wx.hideLoading();
      wx.showModal({
        title: '下单成功',
        content: '订单号:' + orderId + ',可在「我的」中模拟支付。是否查看?',
        success: (r) => {
          if (r.confirm) wx.switchTab({ url: '/pages/mine/mine' });
        }
      });
    } catch (e) {
      wx.hideLoading();
      this.handleErr(e);
    }
  },

  handleErr(e) {
    if (e && e.auth) {
      wx.switchTab({ url: '/pages/mine/mine' });
    }
    wx.showToast({ title: (e && e.message) || '操作失败', icon: 'none' });
  }
});
