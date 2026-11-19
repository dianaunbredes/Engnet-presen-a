import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from 'typeorm';
import { Turma } from '../../turmas/entity/turmas.entity';
import { Aluno } from '../../alunos/entity/alunos.entity';
import { Presenca } from '../../presencas/entity/presencas.entity';

@Entity('aulas')
export class Aula {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    turma_id: string;

    @Column('uuid')
    professor_id: string;

    @Column({type:'timestamptz'})
    data_hora_inicio: Date;

    @Column({type:'timestamptz'})
    data_hora_fim: Date;

    @Column('text')
    conteudo: string;

    @Column('text')
    observacoes: string;  

    @CreateDateColumn({type:'timestamptz'})
    criada_em: Date;

    @OneToMany(() => Presenca, presenca => presenca.aula)
    presencas: Presenca[];
}