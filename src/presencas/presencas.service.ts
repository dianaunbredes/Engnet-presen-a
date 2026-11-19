import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presenca } from './entity/presencas.entity'; 
import { Aula } from '../aulas/entity/aulas.entity';
import { Aluno } from '../alunos/entity/alunos.entity';
import { CriarPresencaDto } from './dto/criar-presencas.dto';
import { Matricula } from '../matriculas/entity/matricula.entity';

@Injectable()
export class PresencasService {
  constructor(
    @InjectRepository(Matricula)
    private readonly matriculasRepository: Repository<Matricula>,
    @InjectRepository(Aluno)
    private readonly alunosRepository: Repository<Aluno>,
    @InjectRepository(Presenca)
    private readonly presencasRepository: Repository<Presenca>,

    @InjectRepository(Aula)
    private readonly aulasRepository: Repository<Aula>,
    ) {}
    async getAllPresencas() {
    return this.presencasRepository.find({
        relations: ['aluno', 'aula'],
  } );
    }
  async createPresenca(dados: any, professorId: string) {
    // 1. Busca a aula informada
    const aula = await this.aulasRepository.findOne({
      where: { id: dados.aula_id },
    });

        if (!aula) {
        throw new NotFoundException('Aula não encontrada.');
       }
         const aluno = await this.alunosRepository.findOne({
         where: { id: dados.aluno_id },
        });

        if (!aluno) {
            throw new NotFoundException('Aluno não encontrado.');
        }
        const matricula = await this.matriculasRepository.findOne({
        where: {
        aluno_id: dados.aluno_id,
        turma_id: aula.turma_id,
        status: 'ativa',
    },
    });

    if (!matricula) {
    throw new ForbiddenException(
    'Este aluno não possui matrícula ativa nesta turma.',
    );
    }

    // 2. Verifica se a aula pertence ao professor autenticado
    if (aula.professor_id !== professorId) {
        console.log('Verificação de professor:', {
    professorIdRecebido: professorId,
    professorIdDaAula: aula.professor_id,
    aulaId: aula.id,
    });
      throw new ForbiddenException(
        'Você não tem permissão para registrar frequência nesta aula.',
      );
    }

    // 3. Procura uma frequência existente para o aluno nesta aula
    let presenca = await this.presencasRepository.findOne({
      where: {
        aula_id: dados.aula_id,
        aluno_id: dados.aluno_id,
      },
    });

    // 4. Atualiza ou cria o registro
    if (presenca) {
      presenca.status = dados.status;
      presenca.observacao = dados.observacao;
      presenca.registrado_por = professorId;
    } else {
      presenca = this.presencasRepository.create({
        ...dados,
        registrado_por: professorId,
      } as Partial<Presenca>);
    }

    // 5. Salva no banco
    return this.presencasRepository.save(presenca);
  }
  async updatePresenca(
  id: string,
  dados: CriarPresencaDto,
  professorId: string,
) {
  const presenca = await this.presencasRepository.findOne({
    where: { id },
    relations: ['aula'],
  });

  if (!presenca) {
    throw new NotFoundException('Frequência não encontrada.');
  }

  if (presenca.aula.professor_id !== professorId) {
    throw new ForbiddenException(
      'Você não tem permissão para alterar esta frequência.',
    );
  }

  presenca.status = dados.status;
  presenca.observacao = dados.observacao ?? null;

  return this.presencasRepository.save(presenca);
}
}