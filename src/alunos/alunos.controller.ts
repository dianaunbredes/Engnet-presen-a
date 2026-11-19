import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlunosService } from './alunos.service';
import { Body } from '@nestjs/common';
import { Aluno } from './entity/alunos.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@UseGuards(JwtAuthGuard)
@Controller('alunos')
export class AlunosController {
     constructor(private alunosService: AlunosService) {}
     
    @Get()
    getAllAlunos() {
    return this.alunosService.getAllAlunos();
  }
    @Post()
    createAluno(@Body() aluno: CreateAlunoDto) {
        return this.alunosService.createAluno(aluno);
  }
    @Get(':id')
    getAlunoById(@Param('id') id: string) {
        return this.alunosService.getAlunoById(id);
  }
    @Put(':id')
    updateAluno(@Param('id') id: string, @Body() aluno: UpdateAlunoDto) {
        return this.alunosService.updateAluno(id, aluno);
  }
    @Delete(':id')
    deleteAluno(@Param('id') id: string) {
        return this.alunosService.deleteAluno(id);
  }
}
