import { EntityRepository, Repository } from 'typeorm';
import { Clientes } from './clientes.entity';
import { CreateClienteDto } from './dto/create-cliente-dto';

@EntityRepository(Clientes)
export class ClientesRepository extends Repository<Clientes> {
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
