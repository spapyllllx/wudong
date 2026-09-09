import axios from 'axios';

// C 端接口封装(与后端 /app/** 直连)
const http = axios.create({ timeout: 15000, baseURL: '/app' });

http.interceptors.request.use(config => {
	const token = localStorage.getItem('app_token');
	if (token) config.headers.Authorization = token;
	return config;
});

// 图片 URL 统一处理(修复:库内硬编码 127.0.0.1:8001,经局域网 IP 访问页面时裂图)
function normalizeImgUrl(v, base = `http://${location.hostname}:8001`) {
	if (typeof v === 'string') {
		if (v.startsWith('/upload/')) return base + v;
		if (/^https?:\/\/(127\.0\.0\.1|localhost):8001\/upload\//.test(v)) {
			return base + '/upload/' + v.slice(v.indexOf('/upload/') + 8);
		}
		return v;
	}
	if (Array.isArray(v)) return v.map(x => normalizeImgUrl(x, base));
	if (v && typeof v === 'object') {
		Object.keys(v).forEach(k => {
			v[k] = normalizeImgUrl(v[k], base);
		});
	}
	return v;
}

http.interceptors.response.use(
	res => {
		const { code, data, message } = res.data || {};
		if (code === 1000) return normalizeImgUrl(data);
		return Promise.reject(new Error(message || '请求失败'));
	},
	err => Promise.reject(new Error(err.response?.data?.message || err.message || '网络错误'))
);

export const api = {
	// 商品
	productList: params => http.get('/clothing/product/list', { params }),
	productDetail: id => http.get('/clothing/product/detail', { params: { id } }),
	productReviews: params => http.get('/clothing/product/reviews', { params }),
	categories: () => http.get('/clothing/category/list'),
	// 收藏(需登录)
	favorite: productId => http.post('/clothing/product/favorite', { productId }),
	myFavorites: params => http.get('/clothing/product/my-favorites', { params }),
	// 订单(需登录)
	orderCreate: data => http.post('/clothing/order/create', data),
	orderPay: orderId => http.post('/clothing/order/pay', { orderId }),
	orderCancel: orderId => http.post('/clothing/order/cancel', { orderId }),
	orderConfirm: orderId => http.post('/clothing/order/confirm', { orderId }),
	myOrders: params => http.get('/clothing/order/list', { params }),
	// 评价(需登录)
	reviewSubmit: data => http.post('/clothing/product/review', data),
	// 购物车(需登录)
	cartList: () => http.get('/clothing/cart/list'),
	cartAdd: (skuId, quantity) => http.post('/clothing/cart/add', { skuId, quantity }),
	cartUpdate: (id, quantity) => http.post('/clothing/cart/update', { id, quantity }),
	cartRemove: ids => http.post('/clothing/cart/remove', { ids }),
	// 登录(演示账号)
	login: (phone, password) => http.post('/user/login/password', { phone, password })
};

export const DEMO_ACCOUNT = { phone: '13800000000', password: '123456' };
