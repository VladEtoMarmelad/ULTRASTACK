import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './mongodb/mongodb.module';
import { PostgresdbModule } from './postgresdb/postgresdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    MongodbModule,
    PostgresdbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}