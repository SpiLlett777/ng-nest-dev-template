import { inject } from '@angular/core';
import { AuthService } from '@sl/web/data-access/auth';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInitializer = async () => {
	const authService = inject(AuthService);

	return firstValueFrom(
		authService.restoreSession().pipe(
			catchError(() => {
				return of(null);
			})
		)
	).then();
};
