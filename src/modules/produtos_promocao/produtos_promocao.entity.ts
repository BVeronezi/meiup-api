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
import { Promocoes } from '../promocoes/promocoes.entity';

@Entity()
export class ProdutosPromocao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Produtos, {
    eager: true,
  })
  @JoinColumn()
  produto: Produtos;

  @Column({ nullable: true, type: 'decimal', default: 0 })
  precoPromocional: number;

  @ManyToOne(() => Promocoes, {
    eager: true,
  })
  @JoinColumn()
  promocao: Promocoes;

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
