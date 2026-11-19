import { Module } from '@nestjs/common';
import {AlunosController} from './alunos.controller';
import {AlunosService} from './alunos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './entity/alunos.entity';

@Module({
    controllers: [AlunosController],
    providers: [AlunosService],
    imports: [TypeOrmModule.forFeature([Aluno])],
})

export class AlunosModule {}