import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() dados: { email: string; senha: string }) {
        return this.authService.login(dados.email, dados.senha);
    }
}

