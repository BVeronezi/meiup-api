import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindUsuariosQueryDto } from './dto/find-usuarios-query.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuarioRepository } from './usuario.repository';
import { isEmpty, values } from 'lodash';
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepository)
    private userRepository: UsuarioRepository,
    private enderecoService: EnderecoService,
  ) {}

  async createUser(createUserDto: CreateUsuarioDto): Promise<Usuario> {
    return await this.userRepository.createUser(
      createUserDto,
      createUserDto.role,
    );
  }

  async registerOAuthUser(profile, token) {
    return await this.userRepository.creteUserSocial(profile, token);
  }

  async findUserById(userId: string): Promise<Usuario> {
    const user = await this.userRepository.findOne(userId, {
      select: ['email', 'nome', 'role', 'id'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findUserByGoogleId(googleId: string): Promise<Usuario> {
    return await this.userRepository.findOne({
      select: ['email', 'nome', 'role', 'id'],
      where: {
        googleId: googleId,
      },
    });
  }

  async updateUser(updateUserDto: UpdateUsuarioDto, id: string) {
    const result = await this.userRepository.update(
      { id },
      {
        nome: updateUserDto.nome,
        email: updateUserDto.email,
        celular: updateUserDto.celular ? Number(updateUserDto.celular) : 0,
        telefone: updateUserDto.telefone ? Number(updateUserDto.telefone) : 0,
        role: updateUserDto.role,
      },
    );

    if (result.affected > 0) {
      const user = await this.findUserById(id);

      if (!values(updateUserDto.endereco).every(isEmpty)) {
        const endereco = await this.endereco(updateUserDto, user);
        user.endereco = endereco;
        await user.save();
      }

      return user;
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async deleteUser(userId: string) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }

    if (user.endereco) {
      await this.enderecoService.deleteEndereco(user.endereco.id);
    }

    return await this.userRepository.delete({ id: userId });
  }

  async findUsers(
    queryDto: FindUsuariosQueryDto,
    empresaId: string,
  ): Promise<{ users: Usuario[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto, empresaId);
    return users;
  }

  async endereco(createUserDto, user) {
    const enderecoId = user.endereco ? user.endereco.id : null;

    const endereco = await this.enderecoService.updateOrCreateEndereco(
      createUserDto.endereco,
      enderecoId,
    );

    return endereco;
  }
}
