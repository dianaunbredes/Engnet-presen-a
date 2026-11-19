import {Controller, Get, Post, Body, Param, Delete, Put, Query, UnauthorizedException} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entity/usuarios.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Post()
    create(@Body() createUsuarioDto: Usuario) {
        return this.usuariosService.createUsuario(createUsuarioDto);
    }

    @Get()
    findAll() {
        return this.usuariosService.getAllUsuarios();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuariosService.getUsuarioById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUsuarioDto: Usuario) {
        return this.usuariosService.updateUsuario(id, updateUsuarioDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuariosService.deleteUsuario(id);
    }
}