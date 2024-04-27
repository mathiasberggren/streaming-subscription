/* eslint-disable @typescript-eslint/unbound-method */
import { TestBed } from '@automock/jest'
import { createMock } from '@golevelup/ts-jest'
import { Request, Response } from 'express'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile()

    controller = unit
    authService = unitRef.get(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should set cookies on google login callback', async () => {
    const req = createMock<Request>({
      user: {
        email: 'test-email',
        name: 'test-name',
        picture: 'test-picture'
      }
    })

    const res = createMock<Response>()
    jest.spyOn(authService, 'signIn').mockResolvedValue('token')

    await controller.googleLoginCallback(req, res)

    expect(authService.signIn).toHaveBeenCalledWith({
      email: 'test-email',
      name: 'test-name',
      picture: 'test-picture'
    })

    expect(res.cookie).toHaveBeenCalledWith('access_token', 'token')
  })
})
