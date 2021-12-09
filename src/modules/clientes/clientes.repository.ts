import { EntityRepository, Repository } from 'typeorm';
import { Clientes } from './clientes.entity';
import { CreateClienteDto } from './dto/create-cliente-dto';
import { FindClientesQueryDto } from './dto/find-clientes-query.dto';

@EntityRepository(Clientes)
export class ClientesRepository extends Repository<Clientes> {
  async findClientes(
    queryDto: FindClientesQueryDto,
    empresaId: string,
  ): Promise<{ clientes: Clientes[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { email, nome } = queryDto;
    const query = this.createQueryBuilder('clientes');

    query.andWhere('clientes.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (email) {
      query.andWhere('clientes.email ILIKE :email', { email: `%${email}%` });
    }

    if (nome) {
      query.andWhere('clientes.nome ILIKE :nome', { nome: `%${nome}%` });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['clientes.id', 'clientes.nome', 'clientes.email']);

    const [clientes, total] = await query.getManyAndCount();

    return { clientes, total };
  }

  async createCliente(createClienteDto: CreateClienteDto): Promise<Clientes> {
    const {
      nome,
      email,
      celular,
      telefone,
      dataNascimento,
      endereco,
      empresa,
    } = createClienteDto;

    const cliente = this.create();
    cliente.nome = nome;
    cliente.email = email;
    cliente.celular = celular;
    cliente.telefone = telefone;
    cliente.dataNascimento = dataNascimento;
    cliente.endereco = endereco;
    cliente.empresa = empresa;

    try {
      return await cliente.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
