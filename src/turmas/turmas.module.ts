import {Module} from '@nestjs/common';
import {TurmasController} from './turmas.controller';
import {TurmasService} from './turmas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turma } from './entity/turmas.entity';

@Module({
    controllers: [TurmasController],
    providers: [TurmasService],
    imports: [TypeOrmModule.forFeature([Turma])],
})

export class TurmasModule {}