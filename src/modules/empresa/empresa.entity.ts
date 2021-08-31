import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Endereco } from '../endereco/endereco.entity';

@Entity()
@Unique(['cnpj'])
export class Empresa extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  razaoSocial: string;

  @Column({ nullable: true, type: 'varchar' })
  cnpj: string;

  @Column({ nullable: true, type: 'integer' })
  ie: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: true, type: 'integer' })
  celular: number;

  @Column({ nullable: true, type: 'integer' })
  telefone: number;

  // @OneToOne(() => Endereco, {
  //   eager: true,
  //   cascade: true,
  //   persistence: true,
  // })
  // @JoinColumn()
  // endereco: Endereco;

  @OneToOne(() => Endereco, (endereco) => endereco.empresa)
  @JoinColumn()
  endereco!: Endereco;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
