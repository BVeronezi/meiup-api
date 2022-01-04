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

  @Column({ nullable: false, default: 0, type: 'decimal' })
  quantidade: number;

  @Column({ nullable: true, type: 'decimal' })
  precoUnitario: number;

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
