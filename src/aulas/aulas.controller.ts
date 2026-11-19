import {Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { AulasService } from './aulas.service';
import { Aula } from './entity/aulas.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('aulas')
export class AulasController {
    @Get()
    findAll() {
        return this.aulasService.findAllAulas();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.aulasService.findOneAula(id);
    }

    @Post()
    create(@Body() aula: Aula) {
        return this.aulasService.createAula(aula);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() aula: Aula) {
        return this.aulasService.updateAula(id, aula);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.aulasService.removeAula(id);
    }

    constructor(private aulasService: AulasService) {}
}