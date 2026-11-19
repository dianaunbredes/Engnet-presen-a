import {Module} from '@nestjs/common';
import {PresencasController} from './presencas.controller';
import {PresencasService} from './presencas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presenca } from './entity/presencas.entity';

@Module({
  controllers: [PresencasController],
  providers: [PresencasService],
  imports: [TypeOrmModule.forFeature([Presenca])],
})
export class PresencasModule {}