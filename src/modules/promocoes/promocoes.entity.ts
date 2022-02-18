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
import { Servicos } from '../servicos/servicos.entity';

@Entity()
export class Promocoes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  descricao: string;

  @ManyToMany(() => Produtos)
  @JoinTable({
    name: 'produtos_promocao',
  })
  produtos: Produtos;

  @ManyToMany(() => Servicos)
  @JoinTable({
    name: 'servicos_promocao',
  })
  servicos: Servicos;

  @Column({ nullable: false, type: 'date' })
  dataInicio: Date;

  @Column({ nullable: false, type: 'date' })
  dataFim: Date;

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
