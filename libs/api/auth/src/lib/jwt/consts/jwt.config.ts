import { getFromEnv } from '@sl/api/shared';
import { parseDurationToMs } from '../../utils';

export const jwtConfig = {
	accessToken: {
		name: 'access_token',
		path: '/api',
		expiresIn: parseDurationToMs(getFromEnv('JWT_ACCESS_EXPIRES', '15m')),
	},
	refreshToken: {
		name: 'refresh_token',
		path: '/api',
		expiresIn: parseDurationToMs(getFromEnv('JWT_REFRESH_EXPIRES', '30d')),
	},
};
