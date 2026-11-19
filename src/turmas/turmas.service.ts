import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Turma} from './entity/turmas.entity';

@Injectable()
export class TurmasService {
    getAllTurmas() {
        return this.turmasRepository.find();
    }
    getTurmaById(id: string) {
        return this.turmasRepository.findOneBy({ id });
    }
    createTurma(turma: Turma) {
        const novaTurma = this.turmasRepository.create(turma);
        return this.turmasRepository.save(novaTurma);
    }
    updateTurma(id: string, turma: Turma) {
        return this.turmasRepository.update({ id }, turma);
    }
    deleteTurma(id: string) {
        return this.turmasRepository.delete({ id });
    }
    constructor(
    @InjectRepository(Turma)
    private turmasRepository: Repository<Turma>,
) {}
}
