import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindUsuariosQueryDto } from './dto/find-usuarios-query.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UserRole } from './enum/user-roles.enum';
import { Usuario } from './usuario.entity';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepository)
    private userRepository: UsuarioRepository,
  ) {}

  async createAdminUser(createUserDto: CreateUsuarioDto): Promise<Usuario> {
    return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
  }

  async findUserById(userId: string): Promise<Usuario> {
    const user = await this.userRepository.findOne(userId, {
      select: ['email', 'nome', 'role', 'id'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async updateUser(updateUserDto: UpdateUsuarioDto, id: string) {
    const result = await this.userRepository.update({ id }, updateUserDto);
    if (result.affected > 0) {
      const user = await this.findUserById(id);
      return user;
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }
  }

  async findUsers(
    queryDto: FindUsuariosQueryDto,
  ): Promise<{ users: Usuario[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto);
    return users;
  }
}
