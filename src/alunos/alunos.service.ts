import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from './entity/alunos.entity';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AlunosService {
    getAllAlunos() {
        return this.alunosRepository.find();
    }
    async getAlunoById(id: string) {
        const aluno = await this.alunosRepository.findOneBy({ id });
        if (!aluno) {
            throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
        }
        return aluno;
    }
    createAluno(aluno: CreateAlunoDto) {
        const novoAluno = this.alunosRepository.create(aluno);
        return this.alunosRepository.save(novoAluno);
    }
    async updateAluno(id: string, aluno: UpdateAlunoDto) {
    const alunoExistente = await this.alunosRepository.findOneBy({ id });
    if (!alunoExistente) {
        throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }
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