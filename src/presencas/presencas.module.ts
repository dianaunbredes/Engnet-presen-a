  import {Module} from '@nestjs/common';
  import {PresencasController} from './presencas.controller';
  import {PresencasService} from './presencas.service';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { Presenca } from './entity/presencas.entity';
  import { Aula } from '../aulas/entity/aulas.entity';
  import { Aluno } from '../alunos/entity/alunos.entity';
  import { Matricula } from '../matriculas/entity/matricula.entity';

  @Module({
    controllers: [PresencasController],
    providers: [PresencasService],
    imports: [TypeOrmModule.forFeature([Presenca,Aula,Aluno,Matricula])],
  })
  export class PresencasModule {}