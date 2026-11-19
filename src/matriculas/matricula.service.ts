import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Matricula} from './entity/matricula.entity';

@Injectable()
export class MatriculasService {
    getAllMatriculas() {
        return this.matriculasRepository.find({
            relations: ['turma', 'aluno']
        });
    }

    getMatriculaById(id: string) {
        return this.matriculasRepository.findOne(
        {
         where: { id } ,
         relations: ['turma', 'aluno']});
    }

    createMatricula(matricula: Matricula) {
        return this.matriculasRepository.save(matricula);
    }

    updateMatricula(id: string, matricula: Matricula) {
        return this.matriculasRepository.update(id, matricula);
    }

    deleteMatricula(id: string) {
        return this.matriculasRepository.delete(id);
    }
    constructor(
        @InjectRepository(Matricula)
        private matriculasRepository: Repository<Matricula>,
        ) {}
    }
