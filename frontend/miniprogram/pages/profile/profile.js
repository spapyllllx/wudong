// 个人中心
const app = getApp()

Page({
  data: {
    userInfo: null
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    this.checkLogin();
  },

  checkLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      app.request('/api/user/profile')
        .then(res => {
          if (res.code === 200) {
            this.setData({ userInfo: res.data });
          }
        })
        .catch(() => {});
    }
  },

  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          app.request('/api/auth/login', { code: res.code }, 'POST')
            .then(data => {
              app.globalData.token = data.data.token;
              app.globalData.userInfo = data.data.userInfo;
              wx.setStorageSync('token', data.data.token);
              this.checkLogin();
            })
            .catch(err => {
              wx.showToast({ title: '登录失败', icon: 'none' });
            });
        }
      }
    });
  },

  goToOrders() {
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  goToCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  },

  goToFavorites() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToAddresses() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToMessages() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});
