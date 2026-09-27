import { Routes } from '@angular/router';
import {
  ProfilePageFavouriteComponent,
  ProfilePageLayoutComponent,
  ProfilePageEditComponent,
} from '../feature-profile-page/index';

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfilePageLayoutComponent,
    children: [
      {
        path: 'edit',
        component: ProfilePageEditComponent,
      },
      {
        path: 'favourite',
        component: ProfilePageFavouriteComponent,
      },
    ],
  },
];
