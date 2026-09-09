const api = require('../../utils/api');
const app = getApp();

Page({
  data: {
    logged: false,
    loginForm: { phone: '13800000000', password: '123456' },
    favorites: [],
    orders: [],
    reviews: [],
    addresses: [],
    addrVisible: false,
    addrForm: { id: null, contact: '', phone: '', province: '', city: '', district: '', address: '', isDefault: false },
    refundVisible: false,
    refundForm: { orderId: null, reason: '' },
    statusText: {
      pending: '待支付',
      paid: '已支付',
      shipped: '已发货',
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
      this.loadReviews();
      this.loadAddresses();
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
    this.setData({ logged: false, favorites: [], orders: [], reviews: [] });
  },

  async loadFav() {
    try {
      const res = await api.myFavorites();
      this.setData({ favorites: res.list || [] });
    } catch (e) {}
  },

  async loadOrders() {
    try {
      const [oRes, rfRes] = await Promise.all([api.myOrders(), api.refundList()]);
      const refundMap = {};
      for (const rf of rfRes.list || []) {
        refundMap[rf.order_id] = rf;
      }
      const orders = (oRes.list || []).map((o) => {
        const rf = refundMap[o.id];
        if (!rf) return o;
        // 退款中:隐藏取消/支付/确认/评价按钮,展示状态
        if (rf.status === 'pending' || rf.status === 'approved') {
          return { ...o, refunding: true };
        }
        if (rf.status === 'rejected') {
          return { ...o, refundRejected: true, rejectReason: rf.reject_reason };
        }
        return o;
      });
      this.setData({ orders });
    } catch (e) {}
  },

  async loadReviews() {
    try {
      const res = await api.myReviews();
      this.setData({ reviews: res.list || [] });
    } catch (e) {}
  },

  // ---------- 收货地址 ----------
  async loadAddresses() {
    try {
      const res = await api.addressList();
      this.setData({ addresses: res.list || [] });
    } catch (e) {}
  },

  openAddrForm() {
    this.setData({
      addrVisible: true,
      addrForm: { id: null, contact: '', phone: '', province: '', city: '', district: '', address: '', isDefault: false }
    });
  },
  editAddr(e) {
    const a = e.currentTarget.dataset.item;
    this.setData({
      addrVisible: true,
      addrForm: {
        id: a.id,
        contact: a.contact,
        phone: a.phone,
        province: a.province,
        city: a.city,
        district: a.district,
        address: a.address,
        isDefault: !!a.isDefault
      }
    });
  },
  hideAddr() {
    this.setData({ addrVisible: false });
  },
  onAddr(e) {
    const k = e.currentTarget.dataset.k;
    const v = k === 'isDefault' ? e.detail.value : e.detail.value;
    this.setData({ ['addrForm.' + k]: v });
  },
  onAddrSwitch(e) {
    this.setData({ 'addrForm.isDefault': e.detail.value });
  },
  async saveAddr() {
    const f = this.data.addrForm;
    if (!f.contact || !f.phone || !f.address) {
      return wx.showToast({ title: '请填写完整地址信息', icon: 'none' });
    }
    try {
      if (f.id) {
        await api.addressUpdate({ id: f.id, ...f });
      } else {
        await api.addressAdd(f);
      }
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ addrVisible: false });
      this.loadAddresses();
    } catch (e) {
      wx.showToast({ title: e.message || '保存失败', icon: 'none' });
    }
  },
  async delAddr(e) {
    const id = Number(e.currentTarget.dataset.id);
    wx.showModal({
      title: '删除地址',
      content: '确定删除该收货地址吗?',
      success: async (r) => {
        if (!r.confirm) return;
        try {
          await api.addressDelete(id);
          this.loadAddresses();
        } catch (e) {}
      }
    });
  },

  // ---------- 退款 ----------
  openRefund(e) {
    const o = e.currentTarget.dataset.order;
    if (!o || !o.id) return;
    this.setData({
      refundVisible: true,
      refundForm: { orderId: o.id, reason: '' }
    });
  },
  hideRefund() {
    this.setData({ refundVisible: false });
  },
  onRefundReason(e) {
    this.setData({ 'refundForm.reason': e.detail.value });
  },
  async submitRefund() {
    const { orderId, reason } = this.data.refundForm;
    if (!reason.trim()) return wx.showToast({ title: '请填写退款原因', icon: 'none' });
    try {
      await api.refundApply({ orderId, reason: reason.trim() });
      wx.showToast({ title: '退款申请已提交', icon: 'success' });
      this.setData({ refundVisible: false });
      this.loadOrders();
    } catch (e) {
      wx.showToast({ title: e.message || '提交失败', icon: 'none' });
    }
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
