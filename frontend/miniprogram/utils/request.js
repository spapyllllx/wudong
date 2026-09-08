// 封装请求
const app = getApp()

function request(url, data, method = 'GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (app.globalData.token || '')
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
}

module.exports = {
  request
}
