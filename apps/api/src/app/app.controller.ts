import { Controller, Get, Logger, Req } from '@nestjs/common'
import { Request } from 'express'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor (
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {}

  @Get()
  getData (@Req() request: Request) {
    this.logger.log(request, 'AppController#getData')

    return this.appService.getData()
  }
}
