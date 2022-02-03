import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { EmpresaRepository } from './empresa.repository';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EnderecoService } from '../endereco/endereco.service';
import { isEmpty, values } from 'lodash';
import { CreateEmpresaDto } from './dto/create-empresa-dto';
@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
    private enderecoService: EnderecoService,
  ) {}

  async createCompany(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    return this.empresaRepository.createCompany(createEmpresaDto);
  }

  async updateCompany(updateCompanyDto: UpdateEmpresaDto, id: string) {
    const result = await this.empresaRepository.update(
      { id },
      {
        cnpj: updateCompanyDto.cnpj,
        razaoSocial: updateCompanyDto.razaoSocial,
        ie: updateCompanyDto.ie,
        telefone: updateCompanyDto.telefone,
        celular: updateCompanyDto.celular,
        email: updateCompanyDto.email,
      },
    );

    if (result.affected > 0) {
      const empresa = await this.findEmpresaById(id);

      const enderecoId = empresa.endereco ? empresa.endereco.id : null;

      if (!values(updateCompanyDto.endereco).every(isEmpty)) {
        const endereco = await this.enderecoService.updateOrCreateEndereco(
          updateCompanyDto.endereco,
          enderecoId,
        );

        empresa.endereco = endereco;

        await empresa.save();
      }

      return empresa;
    } else {
      throw new NotFoundException('Empresa não encontrada');
    }
  }

  async findEmpresaById(empresaId: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne(empresaId, {
      relations: ['endereco'],
    });

    if (!empresa) throw new NotFoundException('Empresa não encontrada');

    return empresa;
  }
}
