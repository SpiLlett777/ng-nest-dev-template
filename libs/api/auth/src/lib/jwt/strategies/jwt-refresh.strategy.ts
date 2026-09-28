import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaMainService } from '@sl/api/database-main';
import { UserStatus } from '@sl/shared/users';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtTokenPayload, RefreshPayload } from '../../interfaces';
import { extractFromCookie } from '../../utils';
import { refreshTokenDigest } from '../../utils/refresh-token-hash';
import { jwtConfig, jwtStrategies } from '../consts';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	jwtStrategies.refresh.name
) {
	constructor(
		private readonly config: ConfigService,
		private readonly prisma: PrismaMainService
	) {
		const secret = config.get<string>('JWT_REFRESH_SECRET');

		if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				extractFromCookie(jwtConfig.refreshToken.name),
			]),
			secretOrKey: secret,
			passReqToCallback: true,
		});
	}

	async validate(
		req: Request,
		payload: JwtTokenPayload
	): Promise<RefreshPayload> {
		const refreshToken = extractFromCookie(jwtConfig.refreshToken.name)(req);

		if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
		// Legacy hashes cannot reliably identify a device: bcrypt truncated JWTs.
		// Accepting them could let a revoked token match another surviving session.
		if (!Number.isInteger(payload.sid))
			throw new UnauthorizedException('Please sign in again');

		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { status: true },
		});

		if (!user || user.status === UserStatus.BLOCKED)
			throw new UnauthorizedException('Account is unavailable');

		const session = await this.prisma.userSession.findFirst({
			where: {
				id: payload.sid,
				userId: payload.sub,
				expiresAt: { gt: new Date() },
			},
		});

		if (!session) throw new UnauthorizedException('No active refresh tokens');

		const valid = await bcrypt.compare(
			refreshTokenDigest(refreshToken),
			session.tokenHash
		);
		if (!valid) throw new UnauthorizedException('Invalid refresh token');

		return {
			userId: payload.sub,
			accountId: payload.accountId,
			sessionId: session.id,
		};
	}
}
