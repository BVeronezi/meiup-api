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
import { Promocoes } from '../promocoes/promocoes.entity';
import { Servicos } from '../servicos/servicos.entity';

@Entity()
export class ServicosPromocao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Servicos, {
    eager: true,
  })
  @JoinColumn()
  servico: Servicos;

  @Column({ nullable: true, type: 'integer', default: 0 })
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
