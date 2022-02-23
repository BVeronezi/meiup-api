import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { FindFornecedoresQueryDto } from './dto/find-fornecedores-query.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor-dto';
import { FornecedoresRepository } from './fornecedores.repository';
import { Fornecedores } from './fornecedores.entity';
import { isEmpty, values } from 'lodash';
import { Usuario } from '../usuario/usuario.entity';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosFornecedoresService } from '../produtos_fornecedores/produtos_fornecedores.service';
@Injectable()
export class FornecedoresService {
  constructor(
    @InjectRepository(FornecedoresRepository)
    private fornecedoresRepository: FornecedoresRepository,
    private produtosFornecedoresService: ProdutosFornecedoresService,
    private enderecoService: EnderecoService,
  ) {}

  async createFornecedor(
    createFornecedorDto: CreateFornecedorDto,
    empresa: Empresa,
  ): Promise<Fornecedores> {
    return await this.fornecedoresRepository.createFornecedor(
      createFornecedorDto,
      empresa,
    );
  }

  async findFornecedorById(fornecedorId: string): Promise<Fornecedores> {
    const fornecedor = await this.fornecedoresRepository.findOne(fornecedorId, {
      relations: ['endereco'],
    });

    if (!fornecedor) throw new NotFoundException('Fornecedor não encontrado');

    return fornecedor;
  }

  async findFornecedores(
    queryDto: FindFornecedoresQueryDto,
    empresaId: string,
  ): Promise<{ fornecedores: Fornecedores[]; total: number }> {
    const fornecedores = await this.fornecedoresRepository.findFornecedores(
      queryDto,
      empresaId,
    );
    return fornecedores;
  }

  async updateFornecedor(
    updateFornecedorDto: UpdateFornecedorDto,
    id: string,
    usuario: Usuario,
  ) {
    const result = await this.fornecedoresRepository.update(
      { id },
      {
        nome: updateFornecedorDto.nome,
        email: updateFornecedorDto.email,
        cpfCnpj: updateFornecedorDto.cpfCnpj,
        situacaoCadastral: updateFornecedorDto.situacaoCadastral,
        celular: updateFornecedorDto.celular,
        telefone: updateFornecedorDto.telefone,
      },
    );

    if (result.affected > 0) {
      const fornecedor = await this.findFornecedorById(id);

      if (!values(updateFornecedorDto.endereco).every(isEmpty)) {
        const endereco = await this.endereco(updateFornecedorDto, usuario);

        fornecedor.endereco = endereco;
        await fornecedor.save();
      }

      return fornecedor;
    } else {
      throw new NotFoundException('Fornecedor não encontrado');
    }
  }

  async deleteFornecedor(fornecedorId: string, empresaId: string) {
    const fornecedor = await this.findFornecedorById(fornecedorId);

    if (!fornecedor) {
      throw new NotFoundException(
        'Não foi encontrado fornecedor com o ID informado',
      );
    }

    const resultProdutosFornecedores =
      await this.produtosFornecedoresService.findProdutosFornecedor(
        {
          fornecedorId,
        },
        empresaId,
      );

    if (resultProdutosFornecedores?.produtosFornecedores.length > 0) {
      throw new ConflictException(
        'Há produto(s) vinculado(s) a este fornecedor',
      );
    }

    if (!values(fornecedor.endereco).every(isEmpty)) {
      await this.enderecoService.deleteEndereco(fornecedor.endereco.id);
    }

    return await this.fornecedoresRepository.delete({
      id: String(fornecedorId),
    });
  }

  async endereco(createFornecedorDto, fornecedor) {
    const enderecoId = fornecedor.endereco ? fornecedor.endereco.id : null;

    const endereco = await this.enderecoService.updateOrCreateEndereco(
      createFornecedorDto.endereco,
      enderecoId,
    );

    return endereco;
  }
}
