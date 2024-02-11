import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class UserSeedService {
	constructor(
		@InjectRepository(UserEntity)
		private repository: Repository<UserEntity>,
	) {}

	async run() {
		const countAdmin = await this.repository.count({
			where: {
				role: {
					id: RoleEnum.Admin,
				},
			},
		});

		if (!countAdmin) {
			const salt = await bcrypt.genSalt();
			const password = await bcrypt.hash('secret', salt);

			await this.repository.save(
				this.repository.create({
					firstName: 'Super',
					lastName: 'Admin',
					email: 'admin@example.com',
					password,
					role: {
						id: RoleEnum.Admin,
						name: 'Admin',
					},
					status: {
						id: StatusEnum.Active,
						name: 'Active',
					},
				}),
			);
		}

		const countUser = await this.repository.count({
			where: {
				role: {
					id: RoleEnum.User,
				},
			},
		});

		if (!countUser) {
			const salt = await bcrypt.genSalt();
			const password = await bcrypt.hash('secret', salt);

			await this.repository.save(
				this.repository.create({
					firstName: 'John',
					lastName: 'Doe',
					email: 'john.doe@example.com',
					password,
					role: {
						id: RoleEnum.User,
						name: 'Admin',
					},
					status: {
						id: StatusEnum.Active,
						name: 'Active',
					},
				}),
			);
		}
	}
}
