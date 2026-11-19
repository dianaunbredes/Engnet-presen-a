import {Module} from '@nestjs/common';
import {MatriculasController} from './matricula.controller';
import {MatriculasService} from './matricula.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entity/matricula.entity';

@Module({
    controllers: [MatriculasController],
    providers: [MatriculasService],
    imports: [TypeOrmModule.forFeature([Matricula])],
})

export class MatriculasModule {}