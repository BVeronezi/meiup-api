import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clientes } from './clientes.entity';
import { ClientesRepository } from './clientes.repository';
import { CreateClienteDto } from './dto/create-cliente-dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClientesRepository)
    private clientesRepository: ClientesRepository,
  ) {}

  async createCliente(createClienteDto: CreateClienteDto): Promise<Clientes> {
    return await this.clientesRepository.createCliente(createClienteDto);
  }

  async findClienteById(clienteId: number): Promise<Clientes> {
    const cliente = await this.clientesRepository.findOne(clienteId);

    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    return cliente;
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
}
