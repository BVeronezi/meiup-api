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

  async createServico(createServicosDto: CreateServicosDto): Promise<Servicos> {
    return await this.servicosRepository.createServico(createServicosDto);
  }

  async findServicoById(servicoId: number): Promise<Servicos> {
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

  async adicionaProdutoServico(
    arrProdutos: [{ id: number; quantidade: number }],
    servico: Servicos,
    empresa: Empresa,
  ) {
    const params: FindProdutosServicoQueryDto = {
      servicoId: Number(servico.id),
    };

    const produtosServico =
      await this.produtosServicoService.findProdutosServico(
        params,
        String(empresa.id),
      );

    const arrNovosProdutos = arrProdutos
      .map((e) => e.id)
      .filter((p) => !produtosServico.map((p) => p.produtoId).includes(p));

    for (const item of arrProdutos) {
      if (arrNovosProdutos.includes(item.id)) {
        const produto = await this.produtosService.findProdutoById(
          Number(item.id),
        );

        const params = {
          produto: produto,
          quantidade: item.quantidade,
          servico: servico,
          empresa: empresa,
        };

        await this.produtosServicoService.createProdutoServico(params);
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
      const servico = await this.findServicoById(Number(id));

      return {
        servico,
        message: 'Serviço atualizado com sucesso',
      };
    } else {
      throw new NotFoundException('Serviço não encontrado');
    }
  }

  async deleteServico(servicoId: number) {
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
