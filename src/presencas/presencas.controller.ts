import {Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { PresencasService } from './presencas.service';

@Controller('presencas')
export class PresencasController {
  constructor(private readonly presencasService: PresencasService) {}

    @Get()
        findAllpresencas() {
            return this.presencasService.findAllpresencas();
        }
    @Get(':id')
        findPresencaId(@Param('id') id: string) {
            return this.presencasService.findPresencaId(id);
        }
    @Post()
        createPresenca(@Body() presenca: any) {
            return this.presencasService.createPresenca(presenca);
        }
    @Put(':id')
        updatePresenca(@Param('id') id: string, @Body() presenca: any) {
            return this.presencasService.updatePresenca(id, presenca);
        }
    @Delete(':id')
        removePresenca(@Param('id') id: string) {
            return this.presencasService.deletePresenca(id);
        }
}