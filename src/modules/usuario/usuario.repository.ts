import { EntityRepository, Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRole } from './enum/user-roles.enum';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindUsuariosQueryDto } from './dto/find-usuarios-query.dto';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
  async findUsers(
    queryDto: FindUsuariosQueryDto,
    empresaId: string,
  ): Promise<{ users: Usuario[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { email, nome } = queryDto;
    const query = this.createQueryBuilder('usuario');

    query.andWhere('usuario.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (email) {
      query.andWhere('usuario.email ILIKE :email', { email: `%${email}%` });
    }

    if (nome) {
      query.andWhere('usuario.nome ILIKE :nome', { nome: `%${nome}%` });
    }
    query.andWhere('usuario.role NOT ILIKE :role', { role: 'MEI' });

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'usuario.id',
      'usuario.nome',
      'usuario.email',
      'usuario.dataCriacao',
      'usuario.role',
    ]);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async createUser(
    createUserDto: CreateUsuarioDto,
    role: UserRole,
  ): Promise<Usuario> {
    const { email, nome, senha, celular, telefone, empresa } = createUserDto;

    const user = this.create();
    user.email = email;
    user.nome = nome ? nome : email;
    user.celular = celular ? Number(celular) : 0;
    user.telefone = telefone ? Number(telefone) : 0;
    user.empresa = empresa;
    user.role = role;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.senha = await this.hashPassword(senha, user.salt);

    try {
      await user.save();
      delete user.senha;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async creteUserSocial(profile, token): Promise<Usuario> {
    const { email, name } = profile._json;

    const user = this.create();
    user.email = email;
    user.nome = name ? name : email;
    user.role = UserRole.MEI;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.senha = token;
    user.googleId = profile.id;

    try {
      await user.save();
      delete user.senha;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }

  async changePassword(id: string, senha: string) {
    const user = await this.findOne(id);
    user.salt = await bcrypt.genSalt();
    user.senha = await this.hashPassword(senha, user.salt);
    user.recuperarToken = null;
    await user.save();
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<Usuario> {
    const { email, senha } = credentialsDto;
    const user = await this.findOne({ email });

    if (user && (await user.checkPassword(senha))) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
