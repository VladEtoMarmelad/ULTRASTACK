import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './modules/mongodb/mongodb.module';
import { PostgresdbModule } from './modules/postgresdb/postgresdb.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphqlService } from './modules/graphql/graphql.service';
import { GraphqlResolver } from './modules/graphql/graphql.resolver';
import { AuthModule } from './modules/authTech/auth/auth.module';
import { UsersModule } from './modules/authTech/users/users.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    MongodbModule,
    PostgresdbModule,
    WebsocketModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      /**
       * autoSchemaFile: true means the schema will be generated in memory.
       * Providing a path generates a physical file.
       */
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Enables GraphQL Playground at http://localhost:3030/graphql
    }),
    StorageModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [GraphqlService, GraphqlResolver],
})
export class AppModule {}