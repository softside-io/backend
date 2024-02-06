import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthResentEmailDto {
	@ApiProperty()
	@IsNotEmpty()
	email: string;
}
