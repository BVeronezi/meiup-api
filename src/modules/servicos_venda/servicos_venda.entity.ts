import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Servicos } from '../servicos/servicos.entity';
import { Vendas } from '../vendas/vendas.entity';

@Entity()
export class ServicosVenda extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Servicos, {
    eager: true,
  })
  @JoinColumn()
  servico: Servicos;

  @ManyToOne(() => Vendas, {
    eager: true,
  })
  @JoinColumn()
  venda: Vendas;

  @ManyToOne(() => Empresa, {
    eager: true,
  })
  @JoinColumn()
  empresa: Empresa;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
