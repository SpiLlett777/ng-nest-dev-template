import { Provider } from '@angular/core';
import { API_CONFIG } from '@sl/web/data-access/shared';
import { environment } from '../environments/environment';

export const provideApiConfig = (): Provider => {
	return {
		provide: API_CONFIG,
		useValue: {
			baseUrl: environment.apiUrl,
		},
	};
};
