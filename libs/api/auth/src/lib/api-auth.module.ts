import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseMainModule } from '@sl/api/database-main';
import { AuthController } from './controllers';
import {
	JwtAccessGuard,
	JwtAccessStrategy,
	JwtRefreshGuard,
	JwtRefreshStrategy,
	jwtStrategies,
	OptionalJwtAccessGuard,
} from './jwt';
import { RolesGuard } from './roles';
import { AuthService } from './services';

@Module({
	imports: [
		DatabaseMainModule,
		ConfigModule,
		PassportModule.register({ defaultStrategy: jwtStrategies.access.name }),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		JwtAccessGuard,
		JwtRefreshGuard,
		OptionalJwtAccessGuard,
		RolesGuard,
	],
	exports: [
		PassportModule,
		JwtAccessGuard,
		JwtRefreshGuard,
		OptionalJwtAccessGuard,
		RolesGuard,
	],
})
export class ApiAuthModule {}
