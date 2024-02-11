import { Allow, IsEnum } from 'class-validator';
import { RoleEnum } from '../roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { populateEnum } from 'src/utils/swagger-enum-transformer';

export class Role {
	@IsEnum(RoleEnum)
	@ApiProperty({
		enum: populateEnum(RoleEnum),
		enumName: 'RoleEnum',
	})
	id: RoleEnum;

	@Allow()
	name?: string;
}
