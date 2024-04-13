import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { DatabaseModule } from '../database/database.module'
import { MoviesModule } from '../movies/movies.module'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { validate } from './config/validate'
import { HttpExceptionFilter } from './http-exception.filter'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    DatabaseModule,
    MoviesModule,
    SubscriptionsModule
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
