import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusDto } from 'src/statuses/dto/status.dto';
import { FileDto } from 'src/files/dto/file.dto';

export class CreateUserDto {
	@ApiProperty({ example: 'test1@example.com' })
	@Transform(lowerCaseTransformer)
	@IsNotEmpty()
	@IsEmail()
	email: string | null;

	@ApiProperty()
	@MinLength(6)
	password?: string;

	provider?: string;

	socialId?: string | null;

	@ApiProperty({ example: 'John' })
	firstName?: string;

	@ApiProperty({ example: 'Doe' })
	lastName?: string;

	@ApiProperty({ type: FileDto, required: false })
	@IsOptional()
	photo?: FileDto | null;

	@ApiProperty({ type: RoleDto, required: false })
	@IsOptional()
	@Type(() => RoleDto)
	role?: RoleDto | null;

	@ApiProperty({ type: StatusDto, required: false })
	@IsOptional()
	@Type(() => StatusDto)
	status?: StatusDto;

	hash?: string | null;

	@ApiProperty()
	phone?: string;

	@ApiProperty()
	address?: string;
}
