// 我的订单
const app = getApp()

Page({
  data: {
    currentTab: 0,
    orderList: [],
    totalAmount: 0
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    const statusMap = ['', 0, 1, 3]; // 对应不同状态筛选
    app.request(`/api/orders?page=1&size=20&status=${statusMap[this.data.currentTab] || ''}`)
      .then(res => {
        if (res.code === 200) {
          const orders = (res.data.list || []).map(item => ({
            ...item,
            statusText: this.getStatusText(item.status)
          }));
          this.setData({ orderList: orders });
        }
      })
      .catch(err => console.log('订单加载失败', err));
  },

  getStatusText(status) {
    const map = {
      0: '待支付',
      1: '已支付',
      2: '已取消',
      3: '已完成',
      4: '已退款',
      5: '退款中'
    };
    return map[status] || '未知';
  },

  switchTab(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ currentTab: index });
    this.loadOrders();
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${id}`
    });
  },

  cancelOrder(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用取消接口
          this.loadOrders();
        }
      }
    });
  },

  goToPay(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/pay/pay?id=${id}`
    });
  }
});
