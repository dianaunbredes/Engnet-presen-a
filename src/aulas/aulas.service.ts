import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Aula} from './entity/aulas.entity';

@Injectable()
export class AulasService {
    findAllAulas() {
        return this.aulasRepository.find();
    }
    findOneAula(id: string) {
        return this.aulasRepository.findOneBy({ id });
    }
    createAula(aula: Aula) {
        const novaAula = this.aulasRepository.create(aula);
        return this.aulasRepository.save(novaAula);
    }
    updateAula(id: string, aula: Aula) {
        return this.aulasRepository.update({ id }, aula);
    }
    removeAula(id: string) {
        return this.aulasRepository.delete({ id });
    }


    constructor(
        @InjectRepository(Aula)
        private aulasRepository: Repository<Aula>
    ) {}
        
}