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
import { Servicos } from '../servicos/servicos.entity';

@Entity()
export class ProdutosServico extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Produtos, {
    eager: true,
  })
  @JoinColumn()
  produto: Produtos;

  @Column({ nullable: true, type: 'integer', default: 0 })
  quantidade: number;

  @ManyToOne(() => Servicos, {
    eager: true,
  })
  @JoinColumn()
  servico: Servicos;

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
