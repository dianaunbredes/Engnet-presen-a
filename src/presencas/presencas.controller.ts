import {Controller,Post,Body,Request,UseGuards,Get,Put,Param} from '@nestjs/common';
import { PresencasService } from './presencas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { CriarPresencaDto } from './dto/criar-presencas.dto';

interface UsuarioAutenticado {
  id: string;
  email: string;
  perfil: string;
}

@Controller('presencas')
@UseGuards(JwtAuthGuard)
export class PresencasController {
    @Get()
    getAll() {
    return this.presencasService.getAllPresencas();
    }
  constructor(
    private readonly presencasService: PresencasService,
  ) {}

  @Post()
  create(
  @Body() dados: CriarPresencaDto,
  @Request() req: ExpressRequest,
    ) {
    const usuario = req.user as UsuarioAutenticado;

    if (!usuario) {
    throw new UnauthorizedException('Usuário não autenticado.');
    }

    return this.presencasService.createPresenca(
    dados,
    usuario.id,
    );
}
@Put(':id')
update(
  @Param('id') id: string,
  @Body() dados: CriarPresencaDto,
  @Request() req: ExpressRequest,
) {
  const usuario = req.user as UsuarioAutenticado;

  if (!usuario) {
    throw new UnauthorizedException('Usuário não autenticado.');
  }

  return this.presencasService.updatePresenca(
    id,
    dados,
    usuario.id,
  );
}
}