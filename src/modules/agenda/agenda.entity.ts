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
import { Usuario } from '../usuario/usuario.entity';

@Entity()
export class Agenda extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  titulo: string;

  @Column({ nullable: true, type: 'varchar' })
  descricao: string;

  @Column({ nullable: false })
  data: Date;

  @Column({ nullable: true })
  participantes: string;

  @Column({ nullable: true, type: 'boolean' })
  notificar: boolean;

  @Column({ nullable: true, type: 'boolean' })
  notificarParticipantes: boolean;

  @ManyToOne(() => Usuario, {
    cascade: false,
    eager: true,
  })
  @JoinColumn()
  usuario: Usuario;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAlteracao: Date;
}
