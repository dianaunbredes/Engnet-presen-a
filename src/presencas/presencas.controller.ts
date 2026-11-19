import {Controller, Get, Post, Body, Param, Delete, Put, UseGuards} from '@nestjs/common';
import { PresencasService } from './presencas.service';
import { JwtAuthGuard } from '../auth/jwt=auth.guard';


@UseGuards(JwtAuthGuard)
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