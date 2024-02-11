import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { FileDto } from 'src/files/dto/file.dto';

export class AuthUpdateDto {
	@ApiProperty({ required: false })
	@IsOptional()
	photo?: FileDto;

	@ApiProperty({ example: 'John', required: false })
	@IsOptional()
	@IsNotEmpty({ message: 'mustBeNotEmpty' })
	firstName?: string;

	@ApiProperty({ example: 'Doe', required: false })
	@IsOptional()
	@IsNotEmpty({ message: 'mustBeNotEmpty' })
	lastName?: string;

	@ApiProperty({ example: '+1 000000', required: false })
	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@ApiProperty({ example: 'Address', required: false })
	@IsOptional()
	address?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNotEmpty()
	@MinLength(6)
	password?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNotEmpty({ message: 'mustBeNotEmpty' })
	oldPassword?: string;
}
