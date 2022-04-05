import 'dotenv/config';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import {
  APP_INTERCEPTOR,
  // APP_FILTER
} from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
// import { HttpExceptionFilter } from './filters/http-exception.filter';

const host = process.env.DATABASE_HOST || 'localhost';
@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      debug: process.env.STAGE === 'DEV' ? true : false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // context: ({ req }) => ({ req }),
      // resolverValidationOptions: {
      //   requireResolversForResolveType: false,
      // },
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
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
