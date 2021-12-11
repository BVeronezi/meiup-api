import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Clientes } from '../clientes/clientes.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Produtos } from '../produtos/produtos.entity';
import { Servicos } from '../servicos/servicos.entity';
import { Usuario } from '../usuario/usuario.entity';
import { StatusVenda } from './enum/venda-status-enum';

@Entity()
export class Vendas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'decimal' })
  pagamento: number;

  @ManyToOne(() => Clientes, {
    eager: true,
  })
  @JoinColumn()
  cliente: Clientes;

  @ManyToMany(() => Servicos)
  @JoinTable({
    name: 'servicos_venda',
  })
  servicos: Servicos[];

  @Column({ nullable: false, type: 'date' })
  dataVenda: Date;

  @Column({ nullable: false, type: 'integer', default: 0 })
  status: StatusVenda;

  @ManyToOne(() => Empresa, {
    eager: true,
  })
  @JoinColumn()
  empresa: Empresa;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;

  @ManyToOne(() => Usuario, {
    eager: true,
  })
  @JoinColumn()
  usuario: Usuario;
}
