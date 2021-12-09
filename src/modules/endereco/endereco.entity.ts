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
import { Clientes } from '../clientes/clientes.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity()
export class Endereco extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, type: 'varchar' })
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

  @OneToOne(() => Usuario, (usuario) => usuario.endereco, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  usuario: Usuario;

  @OneToOne(() => Clientes, (cliente) => cliente.endereco, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  cliente: Clientes;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
