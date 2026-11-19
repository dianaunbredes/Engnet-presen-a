import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import { Presenca } from '../../presencas/entity/presencas.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('character varying',{ length: 120 })
    nome: string;

    @Column('character varying',{ length: 160 })
    email: string

    @Column('text')
    senha_hash: string;

    @Column({
        type:'enum',  
        enum: ['admin', 'professor'] ,
        enumName: 'perfil_usuario',
    })
        perfil: 'admin' | 'professor'

    @Column('boolean')
    ativo: boolean;

    @CreateDateColumn({ type: 'timestamp'})
    criado_em: Date;

    @UpdateDateColumn({ type: 'timestamp'})
    atualizado_em: Date;

    @OneToMany(() => Presenca, presenca => presenca.usuario)
    presencas: Presenca[];
}