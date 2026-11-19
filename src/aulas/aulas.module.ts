import {Module} from '@nestjs/common';
import {AulasController} from './aulas.controller';
import {AulasService} from './aulas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from './entity/aulas.entity';

@Module({
    controllers: [AulasController],
    providers: [AulasService],
    imports: [TypeOrmModule.forFeature([Aula])],
}) 

export class AulasModule {}