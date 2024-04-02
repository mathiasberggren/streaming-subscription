/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing'
import { type Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import { Logger } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let app: TestingModule
  let appController: AppController
  let logger: Logger

  const request = createMock<Request>()

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, Logger]
    })
      .useMocker(createMock)
      .compile()

    appController = app.get<AppController>(AppController)
    logger = app.get<Logger>(Logger)
  })

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(appController.getData(request)).toEqual({ message: 'Hello API' })
    })

    it('should log the request context', () => {
      jest.spyOn(logger, 'log')

      appController.getData(request)

      expect(logger.log).toHaveBeenCalledWith(request, 'AppController#getData')
    })
  })
})
