import { Entity,PrimaryGeneratedColumn,Column, CreateDateColumn, UpdateDateColumn,OneToMany} from 'typeorm';
import { Matricula } from '../../matriculas/entity/matricula.entity';
import { Presenca } from '../../presencas/entity/presencas.entity';
@Entity('alunos')
export class Aluno {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('character varying',{ length: 120 })
    nome: string;

    @Column('character varying',{ length: 160 })
    email: string;

    @Column('character varying',{ length: 30 })
    matricula: string;

    @Column('character varying',{ length: 25 })
    telefone: string;

    @Column('boolean')
    ativo: boolean;

    @CreateDateColumn({ type: 'timestamp'})
    criado_em: Date;

    @UpdateDateColumn({ type: 'timestamp'})
    atualizado_em: Date;

    @OneToMany(() => Matricula, matricula => matricula.aluno)
    matriculas: Matricula[];
    
    @OneToMany(() => Presenca, presenca => presenca.aluno)
    presencas: Presenca[];
}