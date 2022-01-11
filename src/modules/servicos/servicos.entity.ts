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

@Entity()
export class Servicos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  nome: string;

  @Column({ nullable: true, type: 'decimal' })
  custo: number;

  @Column({ nullable: true, type: 'decimal' })
  valor: number;

  @Column({ nullable: true, type: 'decimal' })
  margemLucro: number;

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
