import { Module } from '@nestjs/common';
import { ApiAuthModule } from '@sl/api/auth';
import { DatabaseMainModule } from '@sl/api/database-main';
import { UsersController } from './controllers';
import { UsersService } from './services';

@Module({
	imports: [DatabaseMainModule, ApiAuthModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [],
})
export class UsersModule {}
