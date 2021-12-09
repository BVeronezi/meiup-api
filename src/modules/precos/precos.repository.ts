import { EntityRepository, Repository } from 'typeorm';
import { CreatePrecosDto } from './dto/create-precos-dto';
import { Precos } from './precos.entity';

@EntityRepository(Precos)
export class PrecosRepository extends Repository<Precos> {
  async createPrecos(createPrecosDto: CreatePrecosDto): Promise<Precos> {
    const {
      precoVendaVarejo,
      precoVendaAtacado,
      precoCompra,
      margemLucro,
      produto,
    } = createPrecosDto;

    const precos = this.create();
    precos.precoVendaVarejo = precoVendaVarejo;
    precos.precoVendaAtacado = precoVendaAtacado ?? 0;
    precos.precoCompra = precoCompra ?? 0;
    precos.margemLucro = margemLucro ?? 0;
    precos.produto = produto;

    try {
      return await precos.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
