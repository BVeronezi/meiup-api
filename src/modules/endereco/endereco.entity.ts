import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity()
export class Endereco extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, type: 'integer' })
  cep: string;

  @Column({ nullable: true, type: 'varchar' })
  endereco: string;

  @Column({ nullable: true, type: 'varchar' })
  numero: string;

  @Column({ nullable: true, type: 'varchar' })
  bairro: string;

  @Column({ nullable: true, type: 'varchar' })
  cidade: string;

  @Column({ nullable: true, type: 'varchar' })
  estado: string;

  @Column({ nullable: true, type: 'varchar' })
  complemento: string;

  @OneToOne(() => Empresa, (empresa) => empresa.endereco)
  @JoinColumn()
  empresa!: Empresa;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
