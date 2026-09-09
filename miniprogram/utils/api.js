// C 端接口封装
function request(method, path, data = {}) {
  const app = getApp();
  const { baseUrl } = app.globalData;

  // 图片 URL 统一处理:库内可能存 127.0.0.1:8001 绝对地址或 /upload 相对地址,
  // 一律按小程序当前 baseUrl 重组,保证真机预览(改局域网 IP)图片也能加载
  function normalizeImgUrl(v) {
    if (typeof v === 'string') {
      if (v.indexOf('/upload/') === 0) return baseUrl + v;
      if (/^https?:\/\/(127\.0\.0\.1|localhost):8001\/upload\//.test(v)) {
        return baseUrl + '/upload/' + v.slice(v.indexOf('/upload/') + 8);
      }
      return v;
    }
    if (Array.isArray(v)) return v.map(normalizeImgUrl);
    if (v && typeof v === 'object') {
      Object.keys(v).forEach((k) => {
        v[k] = normalizeImgUrl(v[k]);
      });
    }
    return v;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + '/app' + path,
      method,
      data,
      header: app.globalData.token ? { Authorization: app.globalData.token } : {},
      success(res) {
        const body = res.data || {};
        if (body.code === 1000) {
          resolve(normalizeImgUrl(body.data));
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
  myReviews: () => request('GET', '/clothing/product/my-reviews', { page: 1, size: 20 }),
  // 退款
  refundApply: (data) => request('POST', '/clothing/refund/apply', data),
  refundList: () => request('GET', '/clothing/refund/list', { page: 1, size: 20 }),
  // 收货地址(user 模块既有接口)
  addressList: () => request('POST', '/user/address/page', { page: 1, size: 50 }),
  addressDefault: () => request('GET', '/user/address/default'),
  addressAdd: (data) => request('POST', '/user/address/add', data),
  addressUpdate: (data) => request('POST', '/user/address/update', data),
  addressDelete: (id) => request('POST', '/user/address/delete', { ids: [id] })
};
