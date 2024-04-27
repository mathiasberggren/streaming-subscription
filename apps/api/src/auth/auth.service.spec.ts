import { TestBed } from '@automock/jest'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from '../users/users.service'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const { unit } = TestBed.create(AuthService)
      .mock(UsersService)
      .using({
        findOrCreate: jest.fn().mockResolvedValue({ id: 1, email: 'test@email.com' })
      })
      .mock(JwtService)
      .using({
        sign: jest.fn().mockReturnValue('jwt')
      })
      .compile()

    service = unit
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return a user and token', async () => {
    const user = await service.signIn({
      email: 'test',
      name: 'test',
      picture: 'test'
    })
    expect(user).toEqual('jwt')
  })

  it('should throw an error if no profile is provided', async () => {
    try {
      // @ts-expect-error: Testing OAuth provider does not return profile
      await service.signIn(null)
    } catch (e) {
      expect(e.message).toEqual('Unauthenticated')
    }
  })

  it('should throw an error if no email is provided', async () => {
    try {
      await service.signIn({
        // @ts-expect-error: Testing when OAuth provider does not return email
        email: null,
        name: 'test',
        picture: 'test'
      })
    } catch (e) {
      expect(e.message).toEqual('Email not found')
    }
  })
})
