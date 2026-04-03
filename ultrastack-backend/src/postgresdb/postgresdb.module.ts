import { Module } from '@nestjs/common';
import { PostgresdbService } from './postgresdb.service';
import { PostgresdbController } from './postgresdb.controller';

@Module({
  controllers: [PostgresdbController],
  providers: [PostgresdbService],
})
export class PostgresdbModule {}
