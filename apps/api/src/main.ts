/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule
} from 'nest-winston'
import * as winston from 'winston'
import { AppModule } from './app/app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Streaming Subs', {
              colors: true,
              prettyPrint: true
            })
          )
        })
        // other transports...
      ]
    })
  })

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
