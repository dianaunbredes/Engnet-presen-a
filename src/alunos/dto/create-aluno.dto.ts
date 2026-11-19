import { IsString, IsNotEmpty, IsEmail, Max, MaxLength, } from 'class-validator';

export class CreateAlunoDto {
    @IsString({message: 'O nome deve ser uma string'})
    @IsNotEmpty({message: 'O nome não pode ser vazio'})
    @MaxLength(120,{message: 'O nome não pode ter mais de 120 caracteres'})
    nome: string;
    @IsEmail({}, {message: 'O email deve ser válido'})
    @IsNotEmpty({message: 'O email não pode ser vazio'})
    @MaxLength(160,{message: 'O email não pode ter mais de 160 caracteres'})
    email: string;
    @IsString({message: 'A matrícula deve ser uma string'})
    @IsNotEmpty({message: 'A matrícula não pode ser vazio'})
    @MaxLength(30,{message: 'A matrícula não pode ter mais de 30 caracteres'})
    matricula: string;
    @IsString({message: 'O telefone deve ser uma string'})
    @IsNotEmpty({message: 'O telefone não pode ser vazio'})
    @MaxLength(25,{message: 'O telefone não pode ter mais de 25 caracteres'})
    telefone: string;

}