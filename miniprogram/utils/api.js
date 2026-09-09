// C 端接口封装
function request(method, path, data = {}) {
  const app = getApp();
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + '/app' + path,
      method,
      data,
      header: app.globalData.token ? { Authorization: app.globalData.token } : {},
      success(res) {
        const body = res.data || {};
        if (body.code === 1000) {
          resolve(body.data);
        } else if (res.statusCode === 401) {
          reject({ message: '登录失效,请重新登录', auth: true });
        } else {
          reject({ message: body.message || '请求失败' });
        }
      },
      fail(err) {
        reject({ message: '网络错误,请检查后端是否启动', detail: err });
      }
    });
  });
}

module.exports = {
  get: (path, data) => request('GET', path, data),
  post: (path, data) => request('POST', path, data),

  // 商品
  categories: () => request('GET', '/clothing/category/list'),
  productList: (params) => request('GET', '/clothing/product/list', params),
  productDetail: (id) => request('GET', '/clothing/product/detail', { id }),
  productReviews: (params) => request('GET', '/clothing/product/reviews', params),
  favorite: (productId) => request('POST', '/clothing/product/favorite', { productId }),
  myFavorites: () => request('GET', '/clothing/product/my-favorites', { page: 1, size: 50 }),
  // 登录
  login: (phone, password) => request('POST', '/user/login/password', { phone, password }),
  // 订单
  orderCreate: (data) => request('POST', '/clothing/order/create', data),
  orderPay: (orderId) => request('POST', '/clothing/order/pay', { orderId }),
  orderCancel: (orderId) => request('POST', '/clothing/order/cancel', { orderId }),
  orderConfirm: (orderId) => request('POST', '/clothing/order/confirm', { orderId }),
  myOrders: () => request('GET', '/clothing/order/list', { page: 1, size: 20 }),
  // 购物车
  cartAdd: (skuId, quantity) => request('POST', '/clothing/cart/add', { skuId, quantity }),
  cartList: () => request('GET', '/clothing/cart/list'),
  cartUpdate: (id, quantity) => request('POST', '/clothing/cart/update', { id, quantity }),
  cartRemove: (ids) => request('POST', '/clothing/cart/remove', { ids }),
  // 评价
  reviewSubmit: (data) => request('POST', '/clothing/product/review', data),
  myReviews: () => request('GET', '/clothing/product/my-reviews', { page: 1, size: 20 })
};
