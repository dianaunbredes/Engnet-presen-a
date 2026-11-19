import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Usuario} from './entity/usuarios.entity';


@Injectable()
export class UsuariosService {
    getAllUsuarios() {
        return this.usuariosRepository.find({
            select: ['id', 'nome', 'email', 'perfil', 'ativo', 'criado_em', 'atualizado_em']
        });
    }
    getUsuarioById(id: string) {
        return this.usuariosRepository.findOne({
            where: { id },
            select: ['id', 'nome', 'email', 'perfil', 'ativo', 'criado_em', 'atualizado_em']
        });
    }
    async createUsuario(usuario: Usuario) {
    const novoUsuario = this.usuariosRepository.create(usuario);
    return this.usuariosRepository.save(novoUsuario);
   
    }
    updateUsuario(id: string, usuario: Usuario) {
        return this.usuariosRepository.update({ id }, usuario);
    }
    deleteUsuario(id: string) {
        return this.usuariosRepository.delete({ id });
    }
    getUsuarioByEmail(email: string) {
        return this.usuariosRepository.findOne({
            where: { email },
            select: ['id', 'senha_hash', 'nome', 'email', 'perfil', 'ativo', 'criado_em', 'atualizado_em']
        });
    }       
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
    ) {}

}