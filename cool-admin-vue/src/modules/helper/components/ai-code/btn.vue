<template>
	<div class="cl-comm__icon" @click="toCode">
		<div class="t1">{{ $t('AI极速编码') }}</div>
		<div class="t2">Start</div>
	</div>
</template>

<script setup lang="ts">
import { useCool } from '/@/cool';

const { router } = useCool();

function toCode() {
	router.push('/helper/ai-code');
}
</script>

<style lang="scss" scoped>
.cl-comm__icon {
	width: auto;
	position: relative;
	overflow: hidden;
	width: 90px;

	.t1,
	.t2 {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: top 0.5s;
		letter-spacing: 1px;
		position: absolute;
		width: 100%;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #666 20%);
		background-position: 0;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: shine 3s infinite linear;
		animation-fill-mode: forwards;
		-webkit-text-size-adjust: none;
		font-size: 12px;
		text-align: center;
	}

	.t2 {
		top: 150%;
	}

	&:hover {
		.t1 {
			top: -100%;
		}

		.t2 {
			top: 50%;
		}
	}
}

@keyframes shine {
	0% {
		background-position: 0;
	}
	100% {
		background-position: 90px;
	}
}
</style>
