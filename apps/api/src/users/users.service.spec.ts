import { TestBed } from '@automock/jest'

import { userFactory } from '../database/factories/user'
import { PrismaService } from '../database/prisma.service'

import { UsersService } from './users.service'

const mockUser = userFactory.build({
  email: 'test-email',
  name: 'test-name',
  picture: 'test-picture'
})

describe('UsersService', () => {
  let service: UsersService
  const prisma = {
    user: {
      create: jest.fn().mockResolvedValue(mockUser),
      upsert: jest.fn().mockResolvedValue(mockUser),
      findMany: jest.fn().mockResolvedValue([mockUser]),
      findUnique: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      delete: jest.fn().mockResolvedValue(mockUser)
    }
  }

  beforeEach(async () => {
    const { unit } = TestBed.create(UsersService)
      .mock(PrismaService)
      .using(prisma)
      .compile()

    service = unit
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a user', async () => {
    const user = await service.create({
      email: 'test-email',
      name: 'test-name',
      picture: 'test-picture'
    })

    expect(user).toMatchObject({ id: 1, email: 'test-email', name: 'test-name', picture: 'test-picture' })
  })

  it('should find or create a user', async () => {
    const user = await service.findOrCreate({
      email: 'test-email',
      name: 'test-name',
      picture: 'test-picture'
    })

    expect(user).toEqual(mockUser)
  })

  it('should return an array of users', async () => {
    const users = await service.findAll()

    expect(users).toEqual([mockUser])
  })

  it('should return a user by id', async () => {
    const user = await service.findOne(1)

    expect(user).toEqual(mockUser)
  })

  it('should update a user', async () => {
    const user = await service.update(1, {
      email: 'test-email',
      name: 'test-name',
      picture: 'test-picture'
    })

    expect(user).toEqual(mockUser)
  })

  it('should remove a user', async () => {
    prisma.user.delete.mockResolvedValueOnce(mockUser)
    const user = await service.remove(1)

    expect(user).toEqual(mockUser)
  })

  describe('when user does not exist', () => {
    const error = new Error('Prisma error')
    Object.assign(error, { code: 'P2025' })

    it('should throw an error', async () => {
      prisma.user.delete.mockRejectedValueOnce(error)
      await expect(service.remove(2)).rejects.toThrow('User not found')
    })
  })
})
