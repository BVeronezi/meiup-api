import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateEmpresaDto } from './dto/create-empresa-dto';
import { Empresa } from './empresa.entity';

@EntityRepository(Empresa)
export class EmpresaRepository extends Repository<Empresa> {
  async createCompany(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const { cnpj, celular, telefone, email } = createEmpresaDto;

    const company = this.create();
    company.cnpj = cnpj;
    company.celular = celular;
    company.telefone = telefone;
    company.email = email;

    try {
      await company.save();
      return company;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o empresa no banco de dados',
      );
    }
  }
}
