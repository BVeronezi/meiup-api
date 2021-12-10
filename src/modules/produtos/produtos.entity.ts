import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Categorias } from '../categorias/categorias.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Fornecedores } from '../fornecedores/fornecedores.entity';
import { Precos } from '../precos/precos.entity';
@Entity()
export class Produtos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  descricao: string;

  @Column({ nullable: true, type: 'integer' })
  tipoItem: number;

  @Column({ nullable: true, type: 'varchar' })
  unidade: string;

  @ManyToOne(() => Categorias, {
    cascade: false,
    eager: true,
  })
  @JoinColumn()
  categoria: Categorias;

  @Column({ nullable: true, type: 'decimal' })
  estoque: number;

  @Column({ nullable: true, type: 'decimal' })
  estoqueMaximo: number;

  @Column({ nullable: true, type: 'decimal' })
  estoqueMinimo: number;

  @OneToOne(() => Precos, (precos) => precos.produto, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  precos: Precos;

  // @ManyToMany(() => Fornecedores)
  // @JoinTable()
  // fornecedores: Fornecedores;

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
