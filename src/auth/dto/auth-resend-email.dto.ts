import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthResendEmailDto {
	@ApiProperty()
	@IsNotEmpty()
	email: string;
}