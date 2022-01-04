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

  @Column({ nullable: true })
  precoUnitario: number;

  @Column({ nullable: true })
  outrasDespesas: number;

  @Column({ nullable: true })
  desconto: number;

  @Column({ nullable: true })
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
