<template>
	<div class="count-sales">
		<div class="card">
			<div class="card__header">
				<span class="label">{{ $t('总用户数') }}</span>
				<cl-svg name="team" class="icon" />
			</div>

			<div class="card__container">
				<cl-number :value="num" class="num" />

				<div class="rise">
					<el-icon>
						<top-right />
					</el-icon>

					<span>+12%</span>
				</div>
			</div>

			<div class="card__footer">
				<span class="mr-2">{{ $t('日增用户数') }}</span>
				<span>69</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BottomRight, TopRight } from '@element-plus/icons-vue';
import { random } from 'lodash-es';
import { onMounted, ref } from 'vue';

const num = ref(0);

onMounted(() => {
	num.value = random(100000);
});
</script>

<style lang="scss" scoped>
.count-sales {
	.fall,
	.rise {
		display: inline-flex;
		align-items: center;
		margin-left: 10px;
	}

	.fall {
		color: var(--el-color-success);
	}

	.rise {
		color: var(--el-color-danger);
	}
}
</style>
