import { Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';

export const HomeRoutes: Routes = [
	{
		path: '',
		component: HomePageComponent,
		data: {
			seo: {
				title: 'Sport Link — платформа для сделок спортсменов и рекламодателей',
				description:
					'Sport Link помогает спортсменам и рекламодателям описать рекламные возможности, подобрать партнера, согласовать условия, провести оплату и подтвердить результат.',
				index: true,
				canonicalPath: '/home',
			},
		},
	},
];
