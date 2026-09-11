import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		order: 1,
		views: [
			{
				path: '/home',
				meta: {
					label: '首页',
					isHome: true
				},
				component: () => import('./views/index.vue')
			}
		]
	};
};
