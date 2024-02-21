import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards, Patch, Delete, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { SessionType } from './types/login-response.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from 'src/users/domain/user';
import { AuthResendEmailDto } from './dto/auth-resend-email.dto';

@ApiTags('Auth')
@Controller({
	path: 'auth',
	version: '1',
})
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@SerializeOptions({
		groups: ['me'],
	})
	@Post('email/login')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: SessionType })
	public login(@Body() loginDto: AuthEmailLoginDto): Promise<SessionType> {
		return this.service.validateLogin(loginDto);
	}

	@Post('email/register')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse()
	async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
		return this.service.register(createUserDto);
	}

	@Post('email/confirm')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse()
	async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto): Promise<void> {
		return this.service.confirmEmail(confirmEmailDto.hash);
	}

	@Post('email/resend')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse()
	async sendVerificationEmail(@Body() resendEmailDto: AuthResendEmailDto): Promise<void> {
		return this.service.sendVerificationEmail(resendEmailDto);
	}

	@Post('forgot/password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse()
	async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto): Promise<void> {
		return this.service.forgotPassword(forgotPasswordDto.email);
	}

	@Post('reset/password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse()
	resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
		return this.service.resetPassword(resetPasswordDto.hash, resetPasswordDto.password);
	}

	@ApiBearerAuth()
	@SerializeOptions({
		groups: ['me'],
	})
	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: User })
	public me(@Request() request): Promise<NullableType<User>> {
		return this.service.me(request.user);
	}

	@ApiBearerAuth()
	@SerializeOptions({
		groups: ['me'],
	})
	@Post('refresh')
	@UseGuards(AuthGuard('jwt-refresh'))
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({
		schema: {
			type: 'object',
			required: ['token', 'refreshToken', 'tokenExpires'],
			properties: {
				token: {
					type: 'string',
				},
				refreshToken: {
					type: 'string',
				},
				tokenExpires: {
					type: 'number',
				},
			},
		},
	})
	public refresh(@Request() request): Promise<Omit<SessionType, 'user'>> {
		return this.service.refreshToken({
			sessionId: request.user.sessionId,
		});
	}

	@ApiBearerAuth()
	@Post('logout')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse()
	public async logout(@Request() request): Promise<void> {
		await this.service.logout({
			sessionId: request.user.sessionId,
		});
	}

	@ApiBearerAuth()
	@SerializeOptions({
		groups: ['me'],
	})
	@Patch('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ type: User })
	public update(@Request() request, @Body() userDto: AuthUpdateDto): Promise<NullableType<User>> {
		return this.service.update(request.user, userDto);
	}

	@ApiBearerAuth()
	@Delete('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.NO_CONTENT)
	public async delete(@Request() request): Promise<void> {
		return this.service.softDelete(request.user);
	}
}
