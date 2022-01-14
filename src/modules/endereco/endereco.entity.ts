import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
