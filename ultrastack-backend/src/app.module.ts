import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './mongodb/mongodb.module';
import { PostgresdbModule } from './postgresdb/postgresdb.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    MongodbModule,
    PostgresdbModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}