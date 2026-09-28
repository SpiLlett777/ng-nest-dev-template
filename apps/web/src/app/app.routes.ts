import { Routes } from '@angular/router';
import { ErrorComponent } from '@sl/web/common-ui';
import { authRoutes } from './routing/auth.routes';
import { publicRoutes } from './routing/public.routes';

const notFoundRoutes: Routes = [
	{
		path: '**',
		component: ErrorComponent,
		data: {
			seo: {
				title: 'Страница не найдена',
				description: 'Запрошенная страница не найдена.',
				index: false,
			},
		},
	},
];

export const routes: Routes = [
	...publicRoutes,
	...authRoutes,
	...notFoundRoutes,
];
