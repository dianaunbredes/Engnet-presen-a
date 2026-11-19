import {Get, Param, Post, Put, Body, Delete, Controller} from '@nestjs/common';
import { MatriculasService } from './matricula.service';
import { Matricula } from './entity/matricula.entity';

@Controller('matriculas')
export class MatriculasController {
    constructor(private matriculasService: MatriculasService) {}

    @Get()
    getAllMatriculas() {
        return this.matriculasService.getAllMatriculas();
    }

    @Get(':id')
    getMatriculaById(@Param('id') id: string) {
        return this.matriculasService.getMatriculaById(id);
    }

    @Post()
    createMatricula(@Body() matricula: Matricula) {
        return this.matriculasService.createMatricula(matricula);
    }

    @Put(':id')
    updateMatricula(@Param('id') id: string, @Body() matricula: Matricula) {
        return this.matriculasService.updateMatricula(id, matricula);
    }

    @Delete(':id')
    deleteMatricula(@Param('id') id: string) {
        return this.matriculasService.deleteMatricula(id);
    }
}