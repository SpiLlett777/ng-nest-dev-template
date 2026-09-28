import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@sl/web/data-access/auth';

export const canActivateNonAuth: CanActivateFn = () => {
	return !inject(AuthService).isAuthorized$.value;
};
