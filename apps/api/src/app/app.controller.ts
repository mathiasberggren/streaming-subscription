import { Controller, Get, type Logger, Req } from '@nestjs/common'
import { type Request } from 'express'
import { type AppService } from './app.service'

@Controller()
export class AppController {
  constructor (
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {}

  @Get()
  getData (@Req() request: Request) {
    console.log('this.logger', this.logger)
    this.logger.log(request, 'AppController#getData')

    return this.appService.getData()
  }
}
