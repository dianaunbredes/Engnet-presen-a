import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from './entity/alunos.entity';


@Injectable()
export class AlunosService {
    getAllAlunos() {
        return this.alunosRepository.find();
    }
    getAlunoById(id: string) {
        return this.alunosRepository.findOneBy({ id });
    }
    createAluno(aluno: Aluno) {
        const novoAluno = this.alunosRepository.create(aluno);
        return this.alunosRepository.save(novoAluno);
    }
    updateAluno(id: string, aluno: Aluno) {
        return this.alunosRepository.update({ id }, aluno);
    }
    deleteAluno(id: string) {
        return this.alunosRepository.delete({ id });
    }
    constructor(
        @InjectRepository(Aluno)
        private alunosRepository: Repository<Aluno>,
    ) {}
}