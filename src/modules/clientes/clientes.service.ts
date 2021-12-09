import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { Clientes } from './clientes.entity';
import { ClientesRepository } from './clientes.repository';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { FindClientesQueryDto } from './dto/find-clientes-query.dto';
import { UpdateClienteDto } from './dto/update-cliente-dto';

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

  async findClienteById(clienteId: number): Promise<Clientes> {
    const cliente = await this.clientesRepository.findOne(clienteId);

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

  async updateCliente(updateClienteDto: UpdateClienteDto, id: string) {
    const result = await this.clientesRepository.update(
      { id },
      {
        nome: updateClienteDto.nome,
        email: updateClienteDto.email,
        celular: updateClienteDto.celular
          ? Number(updateClienteDto.celular)
          : 0,
        telefone: updateClienteDto.telefone
          ? Number(updateClienteDto.telefone)
          : 0,
        dataNascimento: updateClienteDto.dataNascimento,
      },
    );

    if (result.affected > 0) {
      const cliente = await this.findClienteById(Number(id));

      if (updateClienteDto.endereco) {
        this.endereco(updateClienteDto, cliente);
      }

      return cliente;
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async deleteCliente(clienteId: number) {
    const result = await this.clientesRepository.delete({
      id: String(clienteId),
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado cliente com o ID informado',
      );
    }
  }

  async endereco(createClienteDto, cliente) {
    const enderecoId = cliente.endereco ? cliente.endereco.id : null;

    const endereco = await this.enderecoService.updateOrCreateEndereco(
      createClienteDto.endereco,
      enderecoId,
      cliente.id,
    );

    return endereco;
  }
}
