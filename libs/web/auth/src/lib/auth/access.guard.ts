import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@sl/web/data-access/auth';

export const canActivateAuth: CanActivateFn = (_route, state) => {
	const isAuth = inject(AuthService).isAuthorized$.value;

	if (isAuth) return true;

	return inject(Router).createUrlTree(['login'], {
		queryParams: { returnUrl: state.url },
	});
};
