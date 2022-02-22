import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { FindProdutosPromocaoQueryDto } from '../produtos_promocao/dto/find-produtos-promocao-dto';
import { ProdutosPromocaoService } from '../produtos_promocao/produtos_promocao.service';
import { ServicosService } from '../servicos/servicos.service';
import { FindServicosPromocaoQueryDto } from '../servicos_promocao/dto/find-servicos_promocao-dto';
import { ServicosPromocaoService } from '../servicos_promocao/servicos_promocao.service';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { FindPromocoesQueryDto } from './dto/find-promocoes-query-dto';
import { UpdatePromocaoDto } from './dto/update-promocao-dto';
import { Promocoes } from './promocoes.entity';
import { PromocoesRepository } from './promocoes.repository';

@Injectable()
export class PromocoesService {
  constructor(
    @InjectRepository(PromocoesRepository)
    private promocoesRepository: PromocoesRepository,
    private produtoPromocaoService: ProdutosPromocaoService,
    private servicoPromocaoService: ServicosPromocaoService,
    private servicosService: ServicosService,
    private produtosService: ProdutosService,
  ) {}

  async createPromocao(
    createPromocaoDto: CreatePromocaoDto,
    empresa: Empresa,
  ): Promise<Promocoes> {
    return await this.promocoesRepository.createPromocao(
      createPromocaoDto,
      empresa,
    );
  }

  async findPromocaoById(promocaoId: string): Promise<Promocoes> {
    const promocao = await this.promocoesRepository.findOne(promocaoId);

    if (!promocao) throw new NotFoundException('Promoção não encontrado');

    return promocao;
  }

  async findPromocoes(
    queryDto: FindPromocoesQueryDto,
    empresaId: string,
  ): Promise<{ promocoes: Promocoes[]; total: number }> {
    const promocoes = await this.promocoesRepository.findPromocoes(
      queryDto,
      empresaId,
    );
    return promocoes;
  }

  async updatePromocao(updatePromocaoDto: UpdatePromocaoDto, id: string) {
    const result = await this.promocoesRepository.update(
      { id },
      {
        descricao: updatePromocaoDto.descricao,
        dataInicio: updatePromocaoDto.dataInicio,
        dataFim: updatePromocaoDto.dataFim,
      },
    );

    if (result.affected > 0) {
      return await this.findPromocaoById(id);
    } else {
      throw new NotFoundException('Promoção não encontrado');
    }
  }

  async deletePromocao(promocaoId: string, empresaId: string) {
    const paramsProdutoPromocao: FindProdutosPromocaoQueryDto = {
      promocaoId: promocaoId,
    };

    const responseProdutoPromocao =
      await this.produtoPromocaoService.findProdutosPromocao(
        paramsProdutoPromocao,
        String(empresaId),
      );

    if (responseProdutoPromocao.produtosPromocao.length > 0) {
      for (const key of responseProdutoPromocao.produtosPromocao) {
        const item = {
          produtoPromocao: key.id,
          produto: key.produto.id,
        };
        await this.produtoPromocaoService.deleteProdutoPromocao(
          item,
          String(promocaoId),
          String(empresaId),
        );
      }
    }

    const paramsServicoPromocao: FindServicosPromocaoQueryDto = {
      promocaoId: promocaoId,
    };

    const responseServicoPromocao =
      await this.servicoPromocaoService.findServicosPromocao(
        paramsServicoPromocao,
        String(empresaId),
      );

    if (responseServicoPromocao.servicosPromocao.length > 0) {
      for (const key of responseServicoPromocao.servicosPromocao) {
        const item = {
          servicoPromocao: key.id,
          servico: key.servico.id,
        };
        await this.servicoPromocaoService.deleteServicoPromocao(
          item,
          String(promocaoId),
          String(empresaId),
        );
      }
    }

    const result = await this.promocoesRepository.delete({
      id: promocaoId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado promoção com o ID informado',
      );
    }
  }

  async adicionaProdutoPromocao(
    item: any,
    promocao: Promocoes,
    empresa: Empresa,
  ) {
    const produtosPromocao =
      await this.produtoPromocaoService.findProdutosPromocaoById(
        String(promocao.id),
        String(item.produto),
      );

    if (!produtosPromocao) {
      const produto = await this.produtosService.findProdutoById(
        String(item.produto),
      );
      const params = {
        id: null,
        produto: produto,
        precoPromocional: item.precoPromocional,
        promocao: promocao,
        empresa: empresa,
      };
      return await this.produtoPromocaoService.createProdutoPromocao(params);
    } else {
      const produto = await this.produtosService.findProdutoById(
        String(item.produto),
      );

      const params = {
        id: String(produtosPromocao.id),
        produto,
        precoPromocional: item.precoPromocional,
        promocao: promocao,
        empresa: empresa,
      };

      try {
        return await this.produtoPromocaoService.updateProdutoPromocao(params);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  async adicionaServicoPromocao(
    item: any,
    promocao: Promocoes,
    empresa: Empresa,
  ) {
    const servicosPromocao =
      await this.servicoPromocaoService.findServicosPromocaoById(
        String(promocao.id),
        String(item.servico),
      );

    if (!servicosPromocao) {
      const servico = await this.servicosService.findServicoById(
        String(item.servico),
      );
      const params = {
        id: null,
        servico: servico,
        precoPromocional: item.precoPromocional,
        promocao: promocao,
        empresa: empresa,
      };
      return await this.servicoPromocaoService.createServicoPromocao(params);
    } else {
      const servico = await this.servicosService.findServicoById(
        String(item.servico),
      );

      const params = {
        id: String(servicosPromocao.id),
        servico,
        precoPromocional: item.precoPromocional,
        promocao: promocao,
        empresa: empresa,
      };

      try {
        return await this.servicoPromocaoService.updateServicoPromocao(params);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
}
