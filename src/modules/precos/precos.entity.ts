import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Precos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'decimal' })
  precoVendaVarejo: number;

  @Column({ nullable: true, type: 'decimal' })
  precoVendaAtacado: number;

  @Column({ nullable: true, type: 'decimal' })
  precoCompra: number;

  @Column({ nullable: true, type: 'decimal' })
  margemLucro: number;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
