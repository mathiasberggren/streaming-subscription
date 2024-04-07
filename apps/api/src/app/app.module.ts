import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from '../database/database.module'
import { MoviesModule } from '../movies/movies.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, MoviesModule],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    }
  ]
})
export class AppModule {}
