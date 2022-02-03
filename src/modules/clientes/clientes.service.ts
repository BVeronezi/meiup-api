import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { Clientes } from './clientes.entity';
import { ClientesRepository } from './clientes.repository';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { FindClientesQueryDto } from './dto/find-clientes-query.dto';
import { UpdateClienteDto } from './dto/update-cliente-dto';
import { isEmpty, values } from 'lodash';
@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClientesRepository)
    private clientesRepository: ClientesRepository,
    private enderecoService: EnderecoService,
  ) {}

  async createCliente(createClienteDto: CreateClienteDto): Promise<Clientes> {
    return await this.clientesRepository.createCliente(createClienteDto);
  }

  async findClienteById(clienteId: string): Promise<Clientes> {
    const cliente = await this.clientesRepository.findOne(clienteId, {
      relations: ['endereco'],
    });

    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    return cliente;
  }

  async findClientes(
    queryDto: FindClientesQueryDto,
    empresaId: string,
  ): Promise<{ clientes: Clientes[]; total: number }> {
    const clientes = await this.clientesRepository.findClientes(
      queryDto,
      empresaId,
    );
    return clientes;
  }

  async updateCliente(updateClienteDto: UpdateClienteDto, id: string, usuario) {
    const result = await this.clientesRepository.update(
      { id },
      {
        nome: updateClienteDto.nome,
        email: updateClienteDto.email,
        celular: updateClienteDto.celular,
        telefone: updateClienteDto.telefone,
        dataNascimento: updateClienteDto.dataNascimento,
      },
    );

    if (result.affected > 0) {
      const cliente = await this.findClienteById(id);

      if (!values(updateClienteDto.endereco).every(isEmpty)) {
        const endereco = await this.endereco(
          updateClienteDto,
          usuario,
          cliente,
        );
        cliente.endereco = endereco;
        await cliente.save();
      }

      return cliente;
    } else {
      throw new NotFoundException('Cliente não encontrado');
    }
  }

  async deleteCliente(clienteId: string) {
    const cliente = await this.findClienteById(clienteId);

    if (cliente?.endereco) {
      await this.enderecoService.deleteEndereco(cliente.endereco.id);
    }

    const result = await this.clientesRepository.delete({
      id: String(clienteId),
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }
  }

  async endereco(createClienteDto, usuario, cliente) {
    const enderecoId = cliente.endereco ? cliente.endereco.id : null;

    const endereco = await this.enderecoService.updateOrCreateEndereco(
      createClienteDto.endereco,
      enderecoId,
    );

    return endereco;
  }
}
