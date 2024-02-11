import { Allow, IsEnum } from 'class-validator';
import { StatusEnum } from '../statuses.enum';
import { ApiProperty } from '@nestjs/swagger';
import { populateEnum } from 'src/utils/swagger-enum-transformer';

export class Status {
	@Allow()
	@IsEnum(StatusEnum)
	@ApiProperty({
		enum: populateEnum(StatusEnum),
		enumName: 'StatusEnum',
	})
	id: StatusEnum;

	@Allow()
	name?: string;
}
