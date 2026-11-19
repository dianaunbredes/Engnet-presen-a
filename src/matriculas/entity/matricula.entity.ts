import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Turma } from '../../turmas/entity/turmas.entity';
import { Aluno } from '../../alunos/entity/alunos.entity';
@Entity('matriculas')
export class Matricula {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    turma_id: string;

    @Column('uuid')
    aluno_id: string;

    @Column('date')
    data_matricula: Date;

    @Column({
            type:'enum', 
            enum:['ativa','trancada','cancelada'], 
            enumName: 'status_matricula'})
    status: 'ativa' | 'trancada' | 'cancelada';

    @CreateDateColumn({ type: 'timestamp'})
    criado_em: Date;

    @ManyToOne(() => Turma, turma => turma.matriculas)
    @JoinColumn({ name: 'turma_id' })
    turma: Turma;
    
    @ManyToOne(() => Aluno, aluno => aluno.matriculas)
    @JoinColumn({ name: 'aluno_id' })
    aluno: Aluno;
}