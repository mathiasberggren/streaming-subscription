/* eslint-disable @typescript-eslint/unbound-method */
import { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import { Logger } from '@nestjs/common'
import { TestBed } from '@automock/jest'

import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let controller: AppController
  let logger: jest.Mocked<Logger>
  let appService: jest.Mocked<AppService>

  const request = createMock<Request>()

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AppController).compile()

    controller = unit
    appService = unitRef.get(AppService)
    logger = unitRef.get(Logger)
  })

  describe('getData', () => {
    it('should return "Hello API"', () => {
      appService.getData.mockReturnValue({ message: 'Hello API' })

      const response = controller.getData(request)
      expect(response).toEqual({ message: 'Hello API' })
    })

    it('should log the request context', () => {
      controller.getData(request)

      expect(logger.log).toHaveBeenCalledWith(request, 'AppController#getData')
    })
  })
})
