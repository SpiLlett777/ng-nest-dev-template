import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiAuthModule } from '@sl/api/auth';
import { DatabaseMainModule } from '@sl/api/database-main';
import { ApiLogger, validateEnv } from '@sl/api/shared';
import { UsersModule } from '@sl/api/users';
import { HealthController } from './health.controller';

// import { AdminModule } from '@sl/api/admin';

@Module({
	imports: [
		ApiAuthModule,
		DatabaseMainModule,
		UsersModule,
		// AdminModule,
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			validate: validateEnv,
		}),
	],
	controllers: [HealthController],
	providers: [ApiLogger],
})
export class AppModule {}
