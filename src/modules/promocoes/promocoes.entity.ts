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
export class Promocoes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  descricao: string;

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
