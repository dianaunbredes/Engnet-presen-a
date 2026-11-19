import {Entity,PrimaryGeneratedColumn,Column, CreateDateColumn, UpdateDateColumn,OneToMany} from 'typeorm';
import { Matricula } from '../../matriculas/entity/matricula.entity';
@Entity('turmas')
export class Turma {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('character varying',{ length: 120 })
    nome: string;

    @Column('character varying',{ length: 30 })
    codigo: string;

    @Column('text')
    descricao: string;

    @Column('uuid')
    professor_id: string;

    @Column('time without time zone')
    horario_inicio: string;

    @Column('time without time zone')
    horario_fim: string;

    @Column('character varying',{ length: 20 })
    dias_semana: string[];

    @Column('numeric',{ precision: 7, scale: 2 })
    carga_horaria: number;

    @Column('smallint')
    semestre: number;

    @Column('smallint')
    ano: number;

    @Column('boolean')
    ativa: boolean;

    @CreateDateColumn({ type: 'timestamp'})
    criado_em: Date;

    @UpdateDateColumn({ type: 'timestamp'}) 
    atualizado_em: Date;
    
    @OneToMany(() => Matricula, matricula => matricula.turma)
    matriculas: Matricula[];
}