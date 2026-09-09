// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:8080'
  },

  onLaunch() {
    // 检查本地存储的token
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },

  /**
   * 发起带Token的请求
   */
  request(url, data, method = 'GET') {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.baseUrl + url,
        data: data,
        method: method,
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (this.globalData.token || '')
        },
        success: (res) => {
          if (res.statusCode === 401) {
            // Token失效，跳转登录
            wx.redirectTo({
              url: '/pages/login/login'
            });
            reject(new Error('未登录'));
            return;
          }
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 登录
   */
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送code到后端换取token
            this.request('/api/auth/login', { code: res.code }, 'POST')
              .then(data => {
                this.globalData.token = data.data.token;
                this.globalData.userInfo = data.data.userInfo;
                wx.setStorageSync('token', data.data.token);
                resolve(data);
              })
              .catch(reject);
          } else {
            reject(new Error('wx.login失败'));
          }
        },
        fail: reject
      });
    });
  }
});
