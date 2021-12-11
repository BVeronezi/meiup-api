import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateFornecedorDto } from './dto/create-fornecedor-dto';
import { FindFornecedoresQueryDto } from './dto/find-fornecedores-query.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor-dto';
import { FornecedoresRepository } from './fornecedores.repository';
import { Fornecedores } from './fornecedores.entity';

@Injectable()
export class FornecedoresService {
  constructor(
    @InjectRepository(FornecedoresRepository)
    private fornecedoresRepository: FornecedoresRepository,
    private enderecoService: EnderecoService,
  ) {}

  async createFornecedor(
    createFornecedorDto: CreateFornecedorDto,
  ): Promise<Fornecedores> {
    return await this.fornecedoresRepository.createFornecedor(
      createFornecedorDto,
    );
  }

  async findFornecedorById(fornecedorId: number): Promise<Fornecedores> {
    const fornecedor = await this.fornecedoresRepository.findOne(fornecedorId);

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

  async updateFornecedor(updateFornecedorDto: UpdateFornecedorDto, id: string) {
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
      const fornecedor = await this.findFornecedorById(Number(id));

      if (updateFornecedorDto.endereco) {
        this.endereco(updateFornecedorDto, fornecedor);
      }

      return fornecedor;
    } else {
      throw new NotFoundException('Fornecedor não encontrado');
    }
  }

  async deleteFornecedor(fornecedorId: number) {
    const result = await this.fornecedoresRepository.delete({
      id: String(fornecedorId),
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado fornecedor com o ID informado',
      );
    }
  }

  async endereco(createFornecedorDto, fornecedor) {
    const enderecoId = fornecedor.endereco ? fornecedor.endereco.id : null;

    const endereco = await this.enderecoService.updateOrCreateEndereco(
      createFornecedorDto.endereco,
      enderecoId,
      fornecedor.id,
    );

    return endereco;
  }
}
