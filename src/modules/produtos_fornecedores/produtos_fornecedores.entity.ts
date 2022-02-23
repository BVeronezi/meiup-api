import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Fornecedores } from '../fornecedores/fornecedores.entity';
import { Produtos } from '../produtos/produtos.entity';

@Entity()
export class ProdutosFornecedores extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Fornecedores, {
    eager: true,
  })
  @JoinColumn()
  fornecedor: Fornecedores;

  @ManyToOne(() => Produtos, {
    eager: true,
  })
  @JoinColumn()
  produto: Produtos;

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
