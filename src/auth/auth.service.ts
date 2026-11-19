import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usuariosService: UsuariosService,
    ) {}
    async login(email: string, senha: string) {
        // Busca o usuário pelo email
        const usuario = await this.usuariosService.getUsuarioByEmail(email);

        // Verifica se existe e está ativo
        if (!usuario || !usuario.ativo) {
            throw new UnauthorizedException('Email ou senha incorretos');
        }
        console.log('Senha recebida:', senha);
        console.log('Senha do banco:', usuario.senha_hash);
        // Compara a senha
        if (senha !== usuario.senha_hash) {
            throw new UnauthorizedException('Email ou senha incorretos');
        }

        // Dados que serão colocados dentro do token
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            perfil: usuario.perfil,
        };

        // Gera o token
        const token = await this.jwtService.signAsync(payload);

        // Retorna o token e os dados do usuário
        return {
            access_token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
            },
        };
    }
}



