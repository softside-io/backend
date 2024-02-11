import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/domain/user';

export class LoginResponseType
	implements
		Readonly<{
			token: string;
			refreshToken: string;
			tokenExpires: number;
			user: User;
		}>
{
	@ApiProperty()
	user: User;
	@ApiProperty()
	refreshToken: string;
	@ApiProperty()
	token: string;
	@ApiProperty()
	tokenExpires: number;
}
