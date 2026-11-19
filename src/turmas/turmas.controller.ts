import {Controller, Get, Param, Post, Put, Body, Delete, UseGuards} from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { Turma } from './entity/turmas.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('turmas')
export class TurmasController {
    constructor(private turmasService: TurmasService) {}

    @Get()
    getAllTurmas() {
        return this.turmasService.getAllTurmas();
    }

    @Get(':id')
    getTurmaById(@Param('id') id: string) {
        return this.turmasService.getTurmaById(id);
    }

    @Post()
    createTurma(@Body() turma: Turma) {
        return this.turmasService.createTurma(turma);
    }

    @Put(':id')
    updateTurma(@Param('id') id: string, @Body() turma: Turma) {
        return this.turmasService.updateTurma(id, turma);
    }

    @Delete(':id')
    deleteTurma(@Param('id') id: string) {
        return this.turmasService.deleteTurma(id);
    }
}