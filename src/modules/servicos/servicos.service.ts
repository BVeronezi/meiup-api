import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async updateServico(updateServicoDto: UpdateServicosDto, id: string) {
    const result = await this.servicosRepository.update(
      { id },
      {
        nome: updateServicoDto.nome,
        custo: updateServicoDto.custo,
        valor: updateServicoDto.valor,
        margemLucro: updateServicoDto.margemLucro,
        // atualizar produto
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
