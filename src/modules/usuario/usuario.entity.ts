import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';

@Entity()
@Unique(['email'])
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  nome: string;

  @Column({ nullable: true, type: 'integer' })
  celular: number;

  @Column({ nullable: true, type: 'integer' })
  telefone: number;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recuperarToken: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmationToken: string;

  @ManyToOne(() => Empresa, { eager: true })
  @JoinColumn()
  empresa: Empresa;

  @OneToOne(() => Endereco, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  endereco: Endereco;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;

  async checkPassword(senha: string): Promise<boolean> {
    const hash = await bcrypt.hash(senha, this.salt);
    return hash === this.senha;
  }
}
