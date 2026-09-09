App({
  globalData: {
    // 演示环境:后端地址(微信开发者工具需勾选「不校验合法域名」;
    // 真机预览时改成电脑局域网 IP,如 http://192.168.x.x:8001)
    baseUrl: 'http://127.0.0.1:8001',
    token: ''
  },
  onLaunch() {
    const token = wx.getStorageSync('app_token');
    if (token) this.globalData.token = token;
  }
});
