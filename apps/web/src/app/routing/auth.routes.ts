import { Routes } from '@angular/router';
import {
	canActivateNonAuth,
	LoginPageComponent,
	RegisterPageComponent,
} from '@sl/web/auth';
import { AuthLayoutComponent } from '@sl/web/layout/auth';

export const authRoutes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		canActivate: [canActivateNonAuth],
		children: [
			{
				path: 'login',
				component: LoginPageComponent,
				data: {
					seo: {
						title: 'Вход',
						description: 'Вход в аккаунт Sport Link.',
						index: false,
					},
				},
			},
			{
				path: 'register',
				component: RegisterPageComponent,
				data: {
					seo: {
						title: 'Регистрация',
						description: 'Создание аккаунта Sport Link.',
						index: false,
					},
				},
			},
		],
	},
];
