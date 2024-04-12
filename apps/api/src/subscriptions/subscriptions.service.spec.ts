import { TestBed } from '@automock/jest'

import { PrismaService } from '../database/prisma.service'

import { SubscriptionsService } from './subscriptions.service'

// TODO: Replace with model factories
const mockSubscription = {
  id: 1,
  userId: 1,
  companyId: 1
}
const mockSubscriptionWithCredentials = {
  id: 1,
  userId: 1,
  companyId: 1,
  credentials: {
    username: 'test',
    password: 'test'
  }
}

describe('SubscriptionsService', () => {
  let service: SubscriptionsService

  beforeEach(async () => {
    const { unit } = TestBed.create(SubscriptionsService)
      .mock(PrismaService)
      .using({
        subscription: {
          create: jest.fn().mockResolvedValue(mockSubscription),
          findMany: jest.fn().mockResolvedValue([mockSubscription, mockSubscriptionWithCredentials]),
          findUnique: jest.fn().mockResolvedValue(mockSubscription),
          update: jest.fn().mockResolvedValue(mockSubscription),
          delete: jest.fn().mockResolvedValue(mockSubscription)
        }
      })
      .compile()

    service = unit
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return an array of subscriptions', async () => {
    const subscriptions = await service.findAll()
    expect(subscriptions).toBeInstanceOf(Array)
  })

  it('should return a subscription by id', async () => {
    const subscription = await service.findOne(1)
    expect(subscription).toHaveProperty('id')
  })

  it('should return a subscription by user id', async () => {
    const subscription = await service.findByUserId(1)
    expect(subscription).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userId: 1 })
      ])
    )
  })

  it('should return a subscription by company id', async () => {
    const subscription = await service.findByCompanyId(1)
    expect(subscription).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userId: 1 })
      ])
    )
  })

  it('should create a subscription', async () => {
    const subscription = await service.create({
      userId: 1,
      companyId: 1
    })
    expect(subscription).toHaveProperty('id')
  })

  it('should update a subscription', async () => {
    const subscription = await service.update(1, {
      userId: 1,
      companyId: 1
    })
    expect(subscription).toHaveProperty('id')
  })

  it('should delete a subscription', async () => {
    const subscription = await service.remove(1)
    expect(subscription).toHaveProperty('id')
  })
})
