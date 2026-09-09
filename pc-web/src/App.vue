<template>
	<router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { api, DEMO_ACCOUNT } from './api';

// 全局:演示环境自动尝试静默登录(C 端测试账号),失败不打扰
onMounted(async () => {
	if (localStorage.getItem('app_token')) return;
	try {
		const data = await api.login(DEMO_ACCOUNT.phone, DEMO_ACCOUNT.password);
		localStorage.setItem('app_token', data.token);
	} catch (e) {}
});
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
body {
	font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
	background: #f5f6f8;
	color: #333;
}
a {
	text-decoration: none;
	color: inherit;
}
</style>
