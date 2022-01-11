import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
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

  @Column({ nullable: true, type: 'decimal' })
  valorServico: number;

  @Column({ nullable: true, type: 'decimal' })
  outrasDespesas: number;

  @Column({ nullable: true, type: 'decimal' })
  desconto: number;

  @Column({ nullable: true, type: 'decimal' })
  valorTotal: number;

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
