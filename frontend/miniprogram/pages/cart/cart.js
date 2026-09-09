// 购物车
const app = getApp()

Page({
  data: {
    cartList: [],
    totalAmount: 0,
    totalCount: 0
  },

  onLoad() {
    this.loadCart();
  },

  loadCart() {
    app.request('/api/cart/list')
      .then(res => {
        if (res.code === 200 && res.data.list) {
          this.setData({ 
            cartList: res.data.list,
            totalAmount: res.data.totalAmount || 0,
            totalCount: res.data.totalCount || 0
          });
        }
      })
      .catch(err => console.log('购物车加载失败', err));
  },

  decreaseQty(e) {
    const { index } = e.currentTarget.dataset;
    const item = this.data.cartList[index];
    if (item.quantity > 1) {
      // TODO: 调用API减少数量
      item.quantity--;
      this.setData({ cartList: this.data.cartList });
      this.calculateTotal();
    }
  },

  increaseQty(e) {
    const { index } = e.currentTarget.dataset;
    const item = this.data.cartList[index];
    // TODO: 检查库存
    item.quantity++;
    this.setData({ cartList: this.data.cartList });
    this.calculateTotal();
  },

  calculateTotal() {
    let totalAmount = 0;
    let totalCount = 0;
    this.data.cartList.forEach(item => {
      totalAmount += parseFloat(item.price) * item.quantity;
      totalCount += item.quantity;
    });
    this.setData({ totalAmount, totalCount });
  },

  checkout() {
    if (this.data.cartList.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: '/pages/checkout/checkout'
    });
  }
});
