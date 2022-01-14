import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';

@Entity()
export class Fornecedores extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  nome: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  cpfCnpj: string;

  @Column({ nullable: true, type: 'varchar' })
  celular: string;

  @Column({ nullable: true, type: 'varchar' })
  telefone: string;

  @Column({ nullable: true, type: 'varchar' })
  situacaoCadastral: string;

  @OneToOne(() => Endereco, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  endereco: Endereco;

  @ManyToOne(() => Empresa, {
    eager: true,
  })
  @JoinColumn()
  empresa: Empresa;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
  fornecedor: Promise<Endereco>;
}
