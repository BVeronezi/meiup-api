import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { EmpresaService } from '../empresa/empresa.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { UserRole } from '../usuario/enum/user-roles.enum';
import { Usuario } from '../usuario/usuario.entity';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { UsuarioService } from '../usuario/usuario.service';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioRepository)
    private userRepository: UsuarioRepository,
    private jwtService: JwtService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
  ) {}

  async validateOAuthLogin(profile: any, token: string): Promise<string> {
    try {
      let user = await this.usuarioService.findUserByGoogleId(profile.id);

      console.log(user);

      if (!user) {
        user = await this.usuarioService.registerOAuthUser(profile, token);

        const createUserDto: CreateUsuarioDto = {
          email: user.email,
          nome: user.nome,
          senha: user.senha,
          role: UserRole.MEI,
          empresa: user.empresa,
        };

        const empresa = await this.empresaService.createCompany(createUserDto);
        user.empresa = empresa;

        user.save();
      }

      const payload = {
        id: user.id,
      };

      const jwt: string = this.jwtService.sign(payload, {
        secret: process.env.SECRET_JWT,
        expiresIn: 18000,
      });

      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async signUp(createUserDto: CreateUsuarioDto): Promise<Usuario> {
    const user = await this.userRepository.createUser(
      createUserDto,
      UserRole.MEI,
    );

    const empresa = await this.empresaService.createCompany(createUserDto);
    user.empresa = empresa;

    user.save();
    return user;
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id,
    };

    const token = this.jwtService.sign(jwtPayload, {
      secret: process.env.SECRET_JWT,
      expiresIn: 18000,
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: process.env.SECRET_JWT,
      expiresIn: 18000,
    });

    return {
      token,
      refreshToken,
      empresa: user.empresa,
      nome: user.nome,
      roles: user.role,
    };
  }

  async confirmEmail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null },
    );
    if (result.affected === 0) throw new NotFoundException('Token inválido');
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    user.recuperarToken = randomBytes(32).toString('hex');
    await user.save();

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: user.recuperarToken,
      },
    };
    // await this.mailerService.sendMail(mail);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { senha } = changePasswordDto;

    await this.userRepository.changePassword(id, senha);
  }

  async resetPassword(
    recuperarToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne(
      { recuperarToken },
      {
        select: ['id'],
      },
    );
    if (!user) throw new NotFoundException('Token inválido.');

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
