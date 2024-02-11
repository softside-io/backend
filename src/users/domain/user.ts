import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { FileType } from 'src/files/domain/file';
import { Role } from 'src/roles/domain/role';
import { Status } from 'src/statuses/domain/status';

export class User {
	@ApiProperty({ anyOf: [{ type: 'string' }, { type: 'number' }] })
	id: number | string;

	@Expose({ groups: ['me', 'admin'] })
	@ApiProperty({ type: String })
	email: string | null;

	@Exclude({ toPlainOnly: true })
	@ApiProperty({ required: false })
	password?: string;

	@Exclude({ toPlainOnly: true })
	@ApiProperty({ required: false })
	previousPassword?: string;

	@Expose({ groups: ['me', 'admin'] })
	@ApiProperty()
	provider: string;

	@Expose({ groups: ['me', 'admin'] })
	@ApiProperty({ type: String, required: false })
	socialId?: string | null;
	@ApiProperty({ required: false })
	firstName?: string;
	@ApiProperty({ required: false })
	lastName?: string;
	@ApiProperty({ type: FileType, required: false })
	photo?: FileType | null;
	@ApiProperty({ required: false })
	address?: string;
	@ApiProperty({ type: String, required: false })
	phone?: string;
	@ApiProperty({ type: Role })
	role?: Role | null;
	@ApiProperty({ type: Status })
	status?: Status;
	@ApiProperty()
	createdAt: Date;
	@ApiProperty()
	updatedAt: Date;
	@ApiProperty({ required: false })
	deletedAt: Date;
}
