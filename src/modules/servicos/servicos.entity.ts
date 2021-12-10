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
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Produtos } from '../produtos/produtos.entity';

@Entity()
export class Servicos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  nome: string;

  @Column({ nullable: false, type: 'decimal' })
  custo: number;

  @Column({ nullable: false, type: 'decimal' })
  valor: number;

  @Column({ nullable: false, type: 'decimal' })
  margemLucro: number;

  @ManyToOne(() => Empresa, {
    eager: true,
  })
  @JoinColumn()
  empresa: Empresa;

  @ManyToMany(() => Produtos)
  @JoinTable({
    name: 'produtos_servicos',
  })
  produtosUtilizados: Produtos;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
