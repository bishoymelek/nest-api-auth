import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

const host = process.env.DATABASE_HOST || 'localhost';
const isDev = process.env.STAGE?.toLowerCase() === 'dev';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: isDev,
      debug: isDev,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      // context: ({ req }) => ({ req }),
    }),
    MongooseModule.forRoot(`mongodb://${host}/nest-exam`),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
