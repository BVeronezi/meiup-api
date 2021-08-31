import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { Endereco } from './endereco.entity';

@EntityRepository(Endereco)
export class EnderecoRepository extends Repository<Endereco> {
  async createEndereco(
    createEnderecoDto: CreateEnderecoDto,
  ): Promise<Endereco> {
    const {
      cep,
      endereco,
      estado,
      numero,
      bairro,
      cidade,
      complemento,
      empresa,
    } = createEnderecoDto;

    const enderecoInstance = this.create();
    enderecoInstance.cep = cep;
    enderecoInstance.endereco = endereco;
    enderecoInstance.estado = estado;
    enderecoInstance.numero = numero;
    enderecoInstance.bairro = bairro;
    enderecoInstance.cidade = cidade;
    enderecoInstance.complemento = complemento;
    enderecoInstance.empresa = empresa;

    try {
      await enderecoInstance.save();
      return enderecoInstance;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o endereco no banco de dados',
      );
    }
  }
}
