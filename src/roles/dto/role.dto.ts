import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../domain/role';
import { RoleEnum } from '../roles.enum';
import { populateEnum } from 'src/utils/swagger-enum-transformer';

export class RoleDto implements Role {
	@IsEnum(RoleEnum)
	@ApiProperty({
		enum: populateEnum(RoleEnum),
		enumName: 'RoleEnum',
	})
	id: RoleEnum;
}
