<template>
	<div class="back" @click="back">
		<i class="iconfont icon-zuo"></i>
	</div>

	<div
		class="loader"
		:class="{
			'is-show': loader.visible
		}"
	>
		<div class="preload__loading"></div>
		<p class="loader__text">{{ loader.text }}</p>
	</div>

	<ai-code-dev path="/ai/code" :ref="setRefs('aiCode')" @message="onMessage" />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useCool } from '/@/cool';
import { useMenu } from '../hooks';
import { startsWith } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import AiCodeDev from '../components/ai-code/dev.vue';
import { ctx } from 'virtual:ctx';

const { router, service, refs, setRefs } = useCool();
const menu = useMenu();
const { t } = useI18n();

// 加载框
const loader = reactive({
	visible: false,
	text: '',

	setText(val: string) {
		loader.text = val;
	},

	open() {
		loader.visible = true;
	},

	close() {
		loader.visible = false;
	}
});

function back() {
	ElMessageBox.confirm(t('确定要退出编码吗？'), t('提示'))
		.then(() => {
			router.replace('/');
		})
		.catch(() => {});
}

// 监听消息
async function onMessage({
	name,
	data
}: {
	name: string;
	data: { menu: EpsModule[]; files: { path: string; content: string }[] };
}) {
	// 创建文件、菜单
	if (name === 'aiCode.create') {
		loader.open();

		// 创建菜单
		await Promise.all(
			data.menu.map(async e => {
				if (e.type == 0 && e.router) {
					await menu.del(e.router);

					loader.setText(t('创建目录：{name}', { name: e.name }));

					await service.base.sys.menu.add(e).then(async res => {
						const arr = data.menu.map(a => {
							if (a.router && a.router?.indexOf(e.router + '/') >= 0) {
								loader.setText(t('创建菜单：{name}', { name: a.name }));

								return menu.create({
									...a,
									parentId: res.id,
									module: e.router.replace('/', ''),
									prefix: a.router.slice(1)
								});
							}
						});

						await Promise.all(arr);
					});
				}
			})
		);

		if (ctx.serviceLang == 'Java') {
			loader.setText(t('创建 Java 文件'));

			// 创建后端文件
			await service.base.coding.createCode({
				codes: data.files.filter(e => {
					return startsWith(e.path, 'java');
				})
			});
		}

		if (ctx.serviceLang == 'Node') {
			loader.setText(t('创建 Node 文件'));

			// 创建后端文件
			await service.base.coding.createCode({
				codes: data.files
					.filter(e => {
						return startsWith(e.path, 'node');
					})
					.map(e => {
						return {
							path: e.path.replace(/^node\//, 'src/modules/'),
							content: e.content
						};
					})
			});
		}

		loader.setText(t('正在重启服务'));

		// 等待服务重启
		await checkService();

		loader.setText(t('创建 Vue 文件'));

		// // 创建前端文件
		await Promise.all(
			data.files.map(e => {
				if (startsWith(e.path, 'vue')) {
					return service.request({
						url: '/__cool_createFile',
						method: 'POST',
						proxy: false,
						data: {
							path: e.path.replace(/^vue\//, 'modules/'),
							code: e.content
						}
					});
				}
			})
		);

		loader.close();

		// 刷新
		location.reload();
	}

	// 获取目录
	if (name === 'aiCode.loaded') {
		service.base.coding.getModuleTree().then(res => {
			refs.aiCode.send('aiCode.setDir', res);
		});
	}
}

// 检测服务，3s一次
async function checkService() {
	return new Promise(resolve => {
		const tryRequest = () => {
			setTimeout(() => {
				service.base.open
					.eps()
					.then(() => {
						resolve(1);
					})
					.catch(() => {
						tryRequest();
					});
			}, 3000);
		};

		tryRequest();
	});
}
</script>

<style scoped lang="scss">
.iframe {
	border: none;
	width: 100%;
	height: 100%;
}

.loader {
	position: fixed;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	opacity: 0;
	pointer-events: none;
	transition: all 0.3s;

	&__text {
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		color: #fff;
		text-align: center;
		margin-top: 15px;
	}

	&.is-show {
		opacity: 1;
		pointer-events: auto;
	}
}

.back {
	position: fixed;
	left: 20px;
	top: 20px;
	background-color: transparent;
	height: 36px;
	width: 36px;
	border-radius: 8px;
	color: #fff;
	transition: all 0.3s;
	font-size: 15px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-sizing: border-box;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: #000;
	}
}
</style>
