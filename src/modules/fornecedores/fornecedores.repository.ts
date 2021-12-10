import { EntityRepository, Repository } from 'typeorm';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { FindFornecedoresQueryDto } from './dto/find-fornecedores-query.dto';
import { Fornecedores } from './fornecedores.entity';

@EntityRepository(Fornecedores)
export class FornecedoresRepository extends Repository<Fornecedores> {
  async findFornecedores(
    queryDto: FindFornecedoresQueryDto,
    empresaId: string,
  ): Promise<{ fornecedores: Fornecedores[]; total: number }> {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page ?? 1;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit ?? 100;

    const { email, nome } = queryDto;
    const query = this.createQueryBuilder('fornecedores');

    query.andWhere('fornecedores.empresaId = :empresaId', {
      empresaId: Number(empresaId),
    });

    if (email) {
      query.andWhere('fornecedores.email ILIKE :email', {
        email: `%${email}%`,
      });
    }

    if (nome) {
      query.andWhere('fornecedores.nome ILIKE :nome', { nome: `%${nome}%` });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select([
      'fornecedores.id',
      'fornecedores.nome',
      'fornecedores.email',
    ]);

    const [fornecedores, total] = await query.getManyAndCount();

    return { fornecedores, total };
  }

  async createFornecedor(
    createFornecedorDto: CreateFornecedorDto,
  ): Promise<Fornecedores> {
    const {
      nome,
      email,
      cpfCnpj,
      situacaoCadastral,
      celular,
      telefone,
      endereco,
      empresa,
    } = createFornecedorDto;

    const fornecedor = this.create();
    fornecedor.nome = nome;
    fornecedor.email = email;
    fornecedor.celular = celular;
    fornecedor.telefone = telefone;
    fornecedor.cpfCnpj = cpfCnpj;
    fornecedor.situacaoCadastral = situacaoCadastral;
    fornecedor.endereco = endereco;
    fornecedor.empresa = empresa;

    try {
      return await fornecedor.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
