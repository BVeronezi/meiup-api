import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { TipoUsuario } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { GetUser } from './get-user.decorator';

@Controller('api/v1/auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = req.user.jwt;

    const user = JSON.stringify(req.user.user);

    response.redirect(
      `https://meiup-frontend.herokuapp.com/loading?jwt=${jwt}&user=${user}`,
    );
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }

  @Post('/cadastra')
  @ApiOperation({ summary: 'Realiza o cadastro do usuário no sistema' })
  async cadastra(
    @Body(ValidationPipe) createUserDto: CreateUsuarioDto,
  ): Promise<{ message: string }> {
    await this.authService.cadastra(createUserDto);
    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Post('/login')
  @ApiOperation({ summary: 'Realiza o login do usuário no sistema' })
  async login(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.login(credentiaslsDto);
  }

  @Post('/send-recover-email')
  @ApiOperation({ summary: 'Envia e-mail para resetar a senha' })
  async sendRecoverPasswordEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendRecoverPasswordEmail(email);
    return {
      message: 'Foi enviado um email com instruções para resetar sua senha',
    };
  }

  @Patch('/reset-password/:token')
  @ApiOperation({ summary: 'Altera a senha do usuário através do e-mail' })
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, changePasswordDto);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Altera a senha do usuário pelo sistema' })
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() user: Usuario,
  ) {
    if (user.tipo !== TipoUsuario.ADMINISTRADOR && user.id.toString() !== id)
      throw new UnauthorizedException(
        'Você não tem permissão para realizar esta operação',
      );

    await this.authService.changePassword(id, changePasswordDto);
    return {
      message: 'Senha alterada',
    };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Retorna os dados do usuário' })
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user: Usuario): Usuario {
    return user;
  }
}
