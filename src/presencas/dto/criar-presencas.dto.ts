import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CriarPresencaDto {
  @IsUUID()
  aula_id: string;

  @IsUUID()
  aluno_id: string;

  @IsEnum(['presente', 'falta', 'justificada'])
  status: 'presente' | 'falta' | 'justificada';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacao?: string | null;
}