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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #F8F9FA;
	overflow: hidden;

	// 柔和的光晕背景
	&::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle at 30% 50%, rgba(102, 126, 234, 0.3), transparent 50%),
					radial-gradient(circle at 70% 50%, rgba(118, 75, 162, 0.3), transparent 50%);
		animation: gentle-float 15s ease-in-out infinite;
		z-index: 0;
	}

	@keyframes gentle-float {
		0%, 100% { transform: translate(0, 0) scale(1); }
		50% { transform: translate(-20px, -20px) scale(1.05); }
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
		color: rgba(255, 255, 255, 0.6);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.02em;
		user-select: none;
		z-index: 10;
		padding: 10px 24px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		backdrop-filter: blur(20px) saturate(180%);
		transition: all 0.3s ease;

		&:hover {
			color: rgba(255, 255, 255, 0.9);
			background: rgba(255, 255, 255, 0.15);
			border-color: rgba(255, 255, 255, 0.3);
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
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 24px;
		padding: 48px 40px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.15),
			0 0 1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(40px) saturate(180%);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			box-shadow:
				0 24px 80px rgba(0, 0, 0, 0.2),
				0 0 1px rgba(0, 0, 0, 0.1),
				inset 0 1px 0 rgba(255, 255, 255, 0.6);
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
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 18px;
				padding: 14px;
				box-shadow:
					0 8px 24px rgba(102, 126, 234, 0.3),
					0 2px 6px rgba(0, 0, 0, 0.1),
					inset 0 -2px 0 rgba(0, 0, 0, 0.1),
					inset 0 1px 0 rgba(255, 255, 255, 0.2);
				position: relative;
				overflow: hidden;
				transition: all 0.3s ease;

				&:hover {
					transform: scale(1.05);
					box-shadow:
						0 12px 32px rgba(102, 126, 234, 0.4),
						0 4px 8px rgba(0, 0, 0, 0.15);
				}

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
					filter: brightness(1.1);
					position: relative;
					z-index: 2;
				}
			}

			span {
				font-size: 32px;
				font-weight: 600;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				letter-spacing: -0.02em;
			}
		}

		.desc {
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 0.01em;
			margin-bottom: 32px;
			user-select: none;
			color: rgba(0, 0, 0, 0.5);
			text-align: center;
		}

		.form {
			width: 100%;

			:deep(.el-form) {
				.el-form-item {
					margin-bottom: 20px;

					.el-form-item__label {
						color: rgba(0, 0, 0, 0.7);
						font-weight: 600;
						font-size: 13px;
						letter-spacing: 0.01em;
						padding: 0 0 8px 0;
					}

					.el-input {
						.el-input__wrapper {
							background: rgba(0, 0, 0, 0.04);
							border: 1px solid rgba(0, 0, 0, 0.1);
							border-radius: 10px;
							box-shadow: none;
							padding: 12px 16px;
							transition: all 0.2s ease;

							&:hover {
								background: rgba(0, 0, 0, 0.05);
								border-color: rgba(102, 126, 234, 0.3);
							}

							&.is-focus {
								background: rgba(255, 255, 255, 0.8);
								border-color: #667eea;
								box-shadow:
									0 0 0 4px rgba(102, 126, 234, 0.1),
									0 2px 8px rgba(0, 0, 0, 0.08);
							}

							.el-input__inner {
								color: rgba(0, 0, 0, 0.9);
								font-weight: 500;
								font-size: 15px;
								height: auto;

								&::placeholder {
									color: rgba(0, 0, 0, 0.3);
									font-weight: 400;
								}
							}
						}

						&:-webkit-autofill {
							-webkit-box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.04) inset;
							box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.04) inset;
							-webkit-text-fill-color: rgba(0, 0, 0, 0.9);
						}
					}
				}
			}

			:deep(.pic-captcha) {
				position: absolute;
				right: 6px;
				top: 6px;
				border: 1px solid rgba(0, 0, 0, 0.1);
				border-radius: 8px;
				overflow: hidden;
				background: rgba(255, 255, 255, 0.8);
				cursor: pointer;
				transition: all 0.2s ease;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

				&:hover {
					border-color: rgba(102, 126, 234, 0.3);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border: none;
				border-radius: 12px;
				padding: 14px 32px;
				font-size: 15px;
				font-weight: 600;
				letter-spacing: 0.01em;
				color: #fff;
				box-shadow:
					0 4px 16px rgba(102, 126, 234, 0.4),
					inset 0 1px 0 rgba(255, 255, 255, 0.2),
					inset 0 -1px 0 rgba(0, 0, 0, 0.1);
				transition: all 0.2s ease;
				position: relative;
				overflow: hidden;

				&::before {
					content: '';
					position: absolute;
					inset: 0;
					background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
					transform: translateX(-100%);
					transition: transform 0.6s ease;
				}

				&:hover:not(.is-disabled) {
					transform: translateY(-2px);
					box-shadow:
						0 8px 24px rgba(102, 126, 234, 0.5),
						inset 0 1px 0 rgba(255, 255, 255, 0.3);

					&::before {
						transform: translateX(100%);
					}
				}

				&:active:not(.is-disabled) {
					transform: translateY(0);
					box-shadow:
						0 2px 8px rgba(102, 126, 234, 0.4),
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
