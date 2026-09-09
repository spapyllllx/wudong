import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// PC 游客商城站:前台接口 /app/** 代理到后端 8001
export default defineConfig({
	plugins: [vue()],
	server: {
		port: 3000,
		proxy: {
			'/app/': {
				target: 'http://127.0.0.1:8001',
				changeOrigin: true
			}
		}
	}
});
