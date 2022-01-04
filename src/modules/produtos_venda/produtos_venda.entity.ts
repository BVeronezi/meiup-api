import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Produtos } from '../produtos/produtos.entity';
import { Vendas } from '../vendas/vendas.entity';

@Entity()
export class ProdutosVenda extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Produtos, {
    eager: true,
  })
  @JoinColumn()
  produto: Produtos;

  @Column({ nullable: false, default: 0 })
  quantidade: number;

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
