/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  Logger, INestApplication,
  NestApplicationOptions
} from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule
} from 'nest-winston'
import * as winston from 'winston'
import { patchNestJsSwagger } from 'nestjs-zod'
import cookieParser from 'cookie-parser'

import { AppModule } from './app/app.module'

const API_PREFIX = 'api'
const OPENAPI_PREFIX = 'docs'

export let viteNodeApp: Promise<INestApplication>

function bootstrapOpenAPI (app: INestApplication) {
  patchNestJsSwagger()
  const config = new DocumentBuilder()
    .setTitle('Streaming Subscription API')
    .setDescription('The API for managing subscriptions from streaming services')
    .setVersion('0.2')
    .addTag('subscriptions', 'Operations related to streaming subscriptions')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(OPENAPI_PREFIX, app, document)
}

function bootstrapLogger () {
  const instance = WinstonModule.createLogger({
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
  }
  )

  return instance
}

export async function createApp (
  options?: NestApplicationOptions
): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: bootstrapLogger()
  })

  app.use(cookieParser())
  app.setGlobalPrefix(API_PREFIX)
  bootstrapOpenAPI(app)

  return app
}

async function main () {
  const port = process.env.PORT ?? 3000

  const app = await createApp()
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${API_PREFIX}`
  )
}

if (process.env.NODE_ENV === 'production') {
  void main()
} else {
  viteNodeApp = createApp()
}
