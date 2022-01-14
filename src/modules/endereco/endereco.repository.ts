import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Clientes } from '../clientes/clientes.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Fornecedores } from '../fornecedores/fornecedores.entity';
import { Usuario } from '../usuario/usuario.entity';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { Endereco } from './endereco.entity';

@EntityRepository(Endereco)
export class EnderecoRepository extends Repository<Endereco> {
  async createEndereco(
    createEnderecoDto: CreateEnderecoDto,
  ): Promise<Endereco> {
    const { cep, endereco, estado, numero, bairro, cidade, complemento } =
      createEnderecoDto;

    const enderecoInstance = this.create();
    enderecoInstance.cep = cep;
    enderecoInstance.endereco = endereco;
    enderecoInstance.estado = estado;
    enderecoInstance.numero = numero;
    enderecoInstance.bairro = bairro;
    enderecoInstance.cidade = cidade;
    enderecoInstance.complemento = complemento;

    try {
      return await enderecoInstance.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o endereco no banco de dados',
      );
    }
  }
}
