import { ApiProperty } from '@nestjs/swagger';
import { authConfig } from '@sl/shared/auth';
import { IsDefined, IsString, Matches, MaxLength } from 'class-validator';

export class LoginDto {
	@ApiProperty()
	@IsDefined({ message: authConfig.email.required.message })
	@IsString()
	@Matches(authConfig.email.correct.pattern, {
		message: authConfig.email.correct.message,
	})
	@MaxLength(authConfig.email.maxLength.value, {
		message: authConfig.email.maxLength.message,
	})
	email!: string;

	@ApiProperty()
	@IsDefined({ message: authConfig.password.required.message })
	@IsString()
	password!: string;
}
