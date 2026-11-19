import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { Body } from '@nestjs/common';
import { Aluno } from './entity/alunos.entity';

@Controller('alunos')
export class AlunosController {
     constructor(private alunosService: AlunosService) {}
     
    @Get()
    getAllAlunos() {
    return this.alunosService.getAllAlunos();
  }
    @Post()
    createAluno(@Body() aluno: Aluno) {
        return this.alunosService.createAluno(aluno);
  }
    @Get(':id')
    getAlunoById(@Param('id') id: string) {
        return this.alunosService.getAlunoById(id);
  }
    @Put(':id')
    updateAluno(@Param('id') id: string, @Body() aluno: Aluno) {
        return this.alunosService.updateAluno(id, aluno);
  }
    @Delete(':id')
    deleteAluno(@Param('id') id: string) {
        return this.alunosService.deleteAluno(id);
  }
}
