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
import { Produtos } from '../produtos/produtos.entity';

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

  @OneToOne(() => Produtos, (produto) => produto.precos, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  produto: Produtos;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
