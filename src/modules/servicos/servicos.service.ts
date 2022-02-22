import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { FindProdutosServicoQueryDto } from '../produtos_servico/dto/find-produtos-servico-dto';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { CreateServicosDto } from './dto/create-servicos-dto';
import { FindServicosQueryDto } from './dto/find-servicos-query-dto';
import { UpdateServicosDto } from './dto/update-servicos-dto';
import { Servicos } from './servicos.entity';
import { ServicosRepository } from './servicos.repository';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(ServicosRepository)
    private servicosRepository: ServicosRepository,
    private produtosServicoService: ProdutosServicoService,
    private produtosService: ProdutosService,
  ) {}

  async createServico(
    createServicosDto: CreateServicosDto,
    empresa: Empresa,
  ): Promise<Servicos> {
    return await this.servicosRepository.createServico(
      createServicosDto,
      empresa,
    );
  }

  async findServicoById(servicoId: string): Promise<Servicos> {
    const servico = await this.servicosRepository.findOne(servicoId);

    if (!servico) throw new NotFoundException('Serviço não encontrado');

    return servico;
  }

  async findServicos(
    queryDto: FindServicosQueryDto,
    empresaId: string,
  ): Promise<{ servicos: Servicos[]; total: number }> {
    const servicos = await this.servicosRepository.findServicos(
      queryDto,
      empresaId,
    );
    return servicos;
  }

  async adicionaProdutoServico(item: any, servico: Servicos, empresa: Empresa) {
    const produtosServico =
      await this.produtosServicoService.findProdutosServicoById(
        String(servico.id),
        String(item.produto),
      );

    if (!produtosServico) {
      const produto = await this.produtosService.findProdutoById(
        String(item.produto),
      );
      const params = {
        id: null,
        produto: produto,
        quantidade: item.quantidade,
        servico: servico,
        empresa: empresa,
      };
      return await this.produtosServicoService.createProdutoServico(params);
    } else {
      const produto = await this.produtosService.findProdutoById(
        String(item.produto),
      );

      const params = {
        id: String(produtosServico.id),
        produto,
        quantidade: item.quantidade,
        servico: servico,
        empresa: empresa,
      };

      try {
        return await this.produtosServicoService.updateProdutoServico(params);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  async updateServico(updateServicoDto: UpdateServicosDto, id: string) {
    const result = await this.servicosRepository.update(
      { id },
      {
        nome: updateServicoDto.nome,
        custo: updateServicoDto.custo,
        valor: updateServicoDto.valor,
        margemLucro: updateServicoDto.margemLucro,
      },
    );

    if (result.affected > 0) {
      return await this.findServicoById(id);
    } else {
      throw new NotFoundException('Serviço não encontrado');
    }
  }

  async deleteServico(servicoId: string, empresaId: number) {
    const params: FindProdutosServicoQueryDto = {
      servicoId: servicoId,
      sort: undefined,
    };

    const response = await this.produtosServicoService.findProdutosServico(
      params,
      String(empresaId),
    );

    if (response.produtosServico.length > 0) {
      for (const key of response.produtosServico) {
        const item = {
          id: key.id,
          produto: key.produto.id,
        };
        await this.produtosServicoService.deleteProdutoServico(
          item,
          String(servicoId),
          String(empresaId),
        );
      }
    }

    const result = await this.servicosRepository.delete({
      id: String(servicoId),
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado serviço com o ID informado',
      );
    }
  }
}
