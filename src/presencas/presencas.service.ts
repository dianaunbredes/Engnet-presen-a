import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Presenca} from './entity/presencas.entity';

@Injectable()
export class PresencasService {
    findAllpresencas() {
        return this.presencasRepository.find();
    }  
    findPresencaId(id: string) {
        return this.presencasRepository.findOneBy({ id });
    }
    createPresenca(presenca: Presenca) {
        const novaPresenca = this.presencasRepository.create(presenca);
        return this.presencasRepository.save(novaPresenca);
    }
    updatePresenca(id: string, presenca: Presenca) {
        return this.presencasRepository.update({ id }, presenca);
    }   
    deletePresenca(id: string) {
        return this.presencasRepository.delete({ id });
    }   
    constructor(
        @InjectRepository(Presenca)
        private presencasRepository: Repository<Presenca>,
    ) {}
}