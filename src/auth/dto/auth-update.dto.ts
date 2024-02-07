import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { FileDto } from 'src/files/dto/file.dto';

export class AuthUpdateDto {
	@ApiProperty({ type: () => FileDto })
	@IsOptional()
	photo?: FileDto;

	@ApiProperty({ example: 'John' })
	@IsOptional()
	@IsNotEmpty({ message: 'mustBeNotEmpty' })
	firstName?: string;

	@ApiProperty({ example: 'Doe' })
	@IsOptional()
	@IsNotEmpty({ message: 'mustBeNotEmpty' })
	lastName?: string;

	@ApiProperty({ example: '+1 000000' })
	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@ApiProperty({ example: 'Address' })
	@IsOptional()
	address?: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty()
	@MinLength(6)
	password?: string;

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty({ message: 'mustBeNotEmpty' })
	oldPassword?: string;
}
