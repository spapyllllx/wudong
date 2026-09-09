const proxy = {
	// 前台(app)公开接口(衣模块商城预览等页面使用)
	'/app/': {
		target: 'http://127.0.0.1:8001',
		changeOrigin: true
	},
	'/dev/': {
		target: 'http://127.0.0.1:8001',
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, '')
	},

	'/prod/': {
		target: 'https://show.cool-admin.com',
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/prod/, '/api')
	}
};

const value = 'dev';
const host = proxy[`/${value}/`]?.target;

export { proxy, host, value };
