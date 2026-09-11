<template>
	<div class="page-login">
		<div class="box">
			<div class="logo">
				<div class="icon">
					<img src="/logo.png" alt="Logo" />
				</div>

				<span>{{ app.info.name }}</span>
			</div>

			<p class="desc">{{ $t('快速开发后台权限管理系统') }}</p>

			<div class="form">
				<el-form label-position="top" class="form" :disabled="saving">
					<el-form-item :label="$t('用户名')">
						<el-input
							v-model="form.username"
							:placeholder="$t('请输入用户名')"
							maxlength="20"
						/>
					</el-form-item>

					<el-form-item :label="$t('密码')">
						<el-input
							v-model="form.password"
							type="password"
							:placeholder="$t('请输入密码')"
							maxlength="20"
							show-password
							autocomplete="new-password"
						/>
					</el-form-item>

					<el-form-item :label="$t('验证码')">
						<el-input
							v-model="form.verifyCode"
							:placeholder="$t('验证码')"
							maxlength="4"
							@keyup.enter="toLogin"
						>
							<template #suffix>
								<pic-captcha
									:ref="setRefs('picCaptcha')"
									v-model="form.captchaId"
									@change="
										() => {
											form.verifyCode = '';
										}
									"
								/>
							</template>
						</el-input>
					</el-form-item>

					<div class="op">
						<el-button type="primary" :loading="saving" @click="toLogin">
							{{ $t('登录') }}
						</el-button>
					</div>
				</el-form>
			</div>
		</div>

		<div class="bg">
			<cl-svg name="bg"></cl-svg>
		</div>

		<a href="https://cool-js.com" class="copyright"> Copyright © COOL </a>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'login'
});

import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCool } from '/@/cool';
import { useBase } from '/$/base';
import { storage } from '/@/cool/utils';
import { useI18n } from 'vue-i18n';
import PicCaptcha from './components/pic-captcha.vue';

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();
const { t } = useI18n();

// 状态
const saving = ref(false);

// 表单数据
const form = reactive({
	username: storage.get('username') || '',
	password: '',
	captchaId: '',
	verifyCode: ''
});

// 演示模式
if (import.meta.env.MODE == 'demo') {
	form.username = 'admin';
	form.password = '123456';
}

// 登录
async function toLogin() {
	if (!form.username) {
		return ElMessage.error(t('用户名不能为空'));
	}

	if (!form.password) {
		return ElMessage.error(t('密码不能为空'));
	}

	if (!form.verifyCode) {
		return ElMessage.error(t('图片验证码不能为空'));
	}

	saving.value = true;

	try {
		// 登录
		await service.base.open.login(form).then(user.setToken);

		// token 事件
		await Promise.all(app.events.hasToken.map(e => e()));

		// 设置缓存
		storage.set('username', form.username);

		// 跳转首页
		router.push('/');
	} catch (err) {
		// 刷新验证码
		refs.picCaptcha.refresh();

		// 提示错误
		ElMessageBox.alert((err as Error).message, {
			title: t('提示'),
			type: 'error'
		});
	}

	saving.value = false;
}
</script>

<style lang="scss" scoped>
.page-login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	position: relative;
	// 靛蓝渐变 + 梯田层次
	background: linear-gradient(135deg, #1B4F72 0%, #2E7CB5 50%, #27AE60 100%);
	color: #F8F9FA;
	overflow: hidden;

	// 梯田纹理背景
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(to bottom, transparent 0%, transparent 48%, rgba(255, 255, 255, 0.02) 48%, rgba(255, 255, 255, 0.02) 52%, transparent 52%),
			linear-gradient(to bottom, transparent 0%, transparent 68%, rgba(255, 255, 255, 0.015) 68%, rgba(255, 255, 255, 0.015) 72%, transparent 72%),
			linear-gradient(to bottom, transparent 0%, transparent 88%, rgba(255, 255, 255, 0.01) 88%, rgba(255, 255, 255, 0.01) 92%, transparent 92%);
		opacity: 0.6;
		z-index: 0;
	}

	// 蜡染几何纹样
	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		background-image:
			url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h10v10H0zM30 20h10v10H30zM10 0h10v10H10zM10 30h10v10H10z' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/svg%3E");
		background-size: 40px 40px;
		opacity: 0.3;
		z-index: 0;
	}

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 90%;
		pointer-events: none;
		opacity: 0.03;
		z-index: 0;

		.cl-svg {
			height: 100%;
			width: 100%;
		}
	}

	.copyright {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.7);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.02em;
		user-select: none;
		z-index: 10;
		padding: 10px 24px;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 20px;
		backdrop-filter: blur(20px) saturate(180%);
		transition: all 0.3s ease;

		&:hover {
			color: rgba(255, 255, 255, 0.95);
			background: rgba(255, 255, 255, 0.18);
			border-color: rgba(255, 255, 255, 0.35);
		}
	}

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 420px;
		position: relative;
		z-index: 9;
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid rgba(27, 79, 114, 0.2);
		border-radius: 24px;
		padding: 48px 40px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.2),
			0 0 1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(40px) saturate(180%);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		// 顶部民族装饰条
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 4px;
			background: linear-gradient(90deg, #8B6F47 0%, #C9A063 30%, #1B4F72 70%, #2E7CB5 100%);
			border-radius: 24px 24px 0 0;
		}

		// 右上角蜡染装饰
		&::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 80px;
			height: 80px;
			background-image:
				url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20c-3 0-5 2-5 5 0 2 1 3 2 4-2 1-4 3-4 6 0 4 3 7 7 7s7-3 7-7c0-3-2-5-4-6 1-1 2-2 2-4 0-3-2-5-5-5z' fill='%231B4F72' fill-opacity='0.08'/%3E%3C/svg%3E");
			background-size: 60px 60px;
			opacity: 0.5;
			pointer-events: none;
		}

		&:hover {
			box-shadow:
				0 24px 80px rgba(0, 0, 0, 0.25),
				0 0 1px rgba(0, 0, 0, 0.1),
				inset 0 1px 0 rgba(255, 255, 255, 0.7);
			transform: translateY(-4px);
		}

		.logo {
			margin-bottom: 28px;
			display: flex;
			flex-direction: column;
			align-items: center;
			user-select: none;
			gap: 16px;

			.icon {
				width: 72px;
				height: 72px;
				background: linear-gradient(135deg, #1B4F72 0%, #2E7CB5 100%);
				border-radius: 18px;
				padding: 14px;
				box-shadow:
					0 8px 24px rgba(27, 79, 114, 0.35),
					0 2px 6px rgba(0, 0, 0, 0.1),
					inset 0 -2px 0 rgba(0, 0, 0, 0.1),
					inset 0 1px 0 rgba(255, 255, 255, 0.3);
				position: relative;
				overflow: hidden;
				transition: all 0.3s ease;

				// 银饰光泽动画
				&::before {
					content: '';
					position: absolute;
					top: -50%;
					left: -50%;
					width: 200%;
					height: 200%;
					background: linear-gradient(45deg, transparent, rgba(168, 178, 184, 0.5), transparent);
					transform: rotate(45deg);
					animation: silver-shine 3s infinite;
				}

				@keyframes silver-shine {
					0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
					100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
				}

				&:hover {
					transform: scale(1.05);
					box-shadow:
						0 12px 32px rgba(27, 79, 114, 0.45),
						0 4px 8px rgba(0, 0, 0, 0.15);
				}

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
					filter: brightness(1.2);
					position: relative;
					z-index: 2;
				}
			}

			span {
				font-size: 32px;
				font-weight: 700;
				background: linear-gradient(135deg, #1B4F72 0%, #2E7CB5 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				letter-spacing: 0.02em;
			}
		}

		.desc {
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 0.01em;
			margin-bottom: 32px;
			user-select: none;
			color: rgba(27, 47, 60, 0.6);
			text-align: center;
			position: relative;

			// 民族装饰符号
			&::before,
			&::after {
				content: '◆';
				color: #C23934;
				margin: 0 8px;
				opacity: 0.6;
				font-size: 10px;
			}
		}

		.form {
			width: 100%;

			:deep(.el-form) {
				.el-form-item {
					margin-bottom: 20px;

					.el-form-item__label {
						color: rgba(27, 47, 60, 0.7);
						font-weight: 600;
						font-size: 13px;
						letter-spacing: 0.01em;
						padding: 0 0 8px 0;
					}

					.el-input {
						.el-input__wrapper {
							background: rgba(255, 255, 255, 0.8);
							border: 1.5px solid rgba(27, 79, 114, 0.15);
							border-radius: 10px;
							box-shadow:
								inset 0 1px 3px rgba(27, 79, 114, 0.08),
								0 1px 2px rgba(0, 0, 0, 0.02);
							padding: 12px 16px;
							transition: all 0.2s ease;

							&:hover {
								background: rgba(255, 255, 255, 0.95);
								border-color: rgba(27, 79, 114, 0.25);
							}

							&.is-focus {
								background: rgba(255, 255, 255, 1);
								border-color: #1B4F72;
								box-shadow:
									0 0 0 4px rgba(27, 79, 114, 0.1),
									inset 0 1px 3px rgba(27, 79, 114, 0.08),
									0 2px 8px rgba(0, 0, 0, 0.08);
							}

							.el-input__inner {
								color: rgba(27, 47, 60, 0.9);
								font-weight: 500;
								font-size: 15px;
								height: auto;

								&::placeholder {
									color: rgba(27, 47, 60, 0.3);
									font-weight: 400;
								}
							}
						}

						&:-webkit-autofill {
							-webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.8) inset;
							box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.8) inset;
							-webkit-text-fill-color: rgba(27, 47, 60, 0.9);
						}
					}
				}
			}

			:deep(.pic-captcha) {
				position: absolute;
				right: 6px;
				top: 6px;
				border: 1.5px solid rgba(27, 79, 114, 0.15);
				border-radius: 8px;
				overflow: hidden;
				background: rgba(255, 255, 255, 0.9);
				cursor: pointer;
				transition: all 0.2s ease;
				box-shadow: 0 2px 8px rgba(27, 79, 114, 0.08);

				&:hover {
					border-color: rgba(27, 79, 114, 0.3);
					box-shadow: 0 4px 12px rgba(27, 79, 114, 0.12);
				}

				.svg, .base64 {
					filter: brightness(1) contrast(1.05);
				}
			}
		}

		.op {
			display: flex;
			justify-content: center;
			margin-top: 28px;

			:deep(.el-button) {
				width: 100%;
				height: auto;
				background: linear-gradient(135deg, #1B4F72 0%, #2E7CB5 100%);
				border: none;
				border-radius: 12px;
				padding: 14px 32px;
				font-size: 15px;
				font-weight: 600;
				letter-spacing: 0.01em;
				color: #fff;
				box-shadow:
					0 4px 16px rgba(27, 79, 114, 0.4),
					inset 0 1px 0 rgba(255, 255, 255, 0.25),
					inset 0 -1px 0 rgba(0, 0, 0, 0.1);
				transition: all 0.2s ease;
				position: relative;
				overflow: hidden;

				// 银饰光泽效果
				&::before {
					content: '';
					position: absolute;
					inset: 0;
					background: linear-gradient(90deg, transparent 0%, rgba(168, 178, 184, 0.3) 50%, transparent 100%);
					transform: translateX(-100%);
					transition: transform 0.6s ease;
				}

				&:hover:not(.is-disabled) {
					transform: translateY(-2px);
					box-shadow:
						0 8px 24px rgba(27, 79, 114, 0.5),
						inset 0 1px 0 rgba(255, 255, 255, 0.35);

					&::before {
						transform: translateX(100%);
					}
				}

				&:active:not(.is-disabled) {
					transform: translateY(0);
					box-shadow:
						0 2px 8px rgba(27, 79, 114, 0.4),
						inset 0 1px 2px rgba(0, 0, 0, 0.1);
				}

				&.is-loading {
					opacity: 0.7;
					cursor: not-allowed;
				}
			}
		}
	}
}

@media screen and (max-width: 1024px) {
	.page-login {
		.box {
			max-width: 90%;
			padding: 40px 28px;

			.logo {
				span {
					font-size: 28px;
				}
			}
		}
	}
}
</style>
