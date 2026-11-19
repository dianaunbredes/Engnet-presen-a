import {Entity,PrimaryGeneratedColumn,Column, CreateDateColumn, ManyToOne,OneToMany, JoinColumn} from 'typeorm';
import {Aluno} from '../../alunos/entity/alunos.entity';
import {Aula} from '../../aulas/entity/aulas.entity';
import {Usuario} from '../../usuarios/entity/usuarios.entity';
import { Unique } from 'typeorm';

@Unique(['aula_id', 'aluno_id'])
@Entity('presencas')
export class Presenca {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('uuid')
    aula_id: string;

    @Column('uuid')
    aluno_id: string;

    @Column({
        type:'enum', 
        enum:['presente','falta','justificada'], 
        enumName: 'status_presenca'})
    status: 'presente' | 'falta' | 'justificada'

    @Column('uuid')
    registrado_por: string;
    
    @CreateDateColumn({ type: 'timestamp'})
    registrado_em: Date;

    @Column('text', { nullable: true })
    observacao: string | null;

    @ManyToOne(() => Aluno, aluno => aluno.presencas)
    @JoinColumn({ name: 'aluno_id' })
    aluno: Aluno;

    @ManyToOne(() => Aula, aula => aula.presencas)
    @JoinColumn({ name: 'aula_id' })
    aula: Aula;

    @ManyToOne(() => Usuario, usuario => usuario.presencas)
    @JoinColumn({ name: 'registrado_por' })
    usuario: Usuario;    
}   
