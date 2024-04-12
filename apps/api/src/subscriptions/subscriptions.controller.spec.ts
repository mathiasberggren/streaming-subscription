import { TestBed } from '@automock/jest'

import { SubscriptionsController } from './subscriptions.controller'
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

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController

  beforeEach(async () => {
    const { unit } = TestBed.create(SubscriptionsController)
      .mock(SubscriptionsService)
      .using({
        findAll: jest.fn().mockResolvedValue([mockSubscription, mockSubscriptionWithCredentials]),
        findOne: jest.fn().mockResolvedValue(mockSubscription),
        create: jest.fn().mockResolvedValue(mockSubscription),
        update: jest.fn().mockResolvedValue(mockSubscription),
        remove: jest.fn().mockResolvedValue(mockSubscription)
      })
      .compile()

    controller = unit
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return an array of subscriptions', async () => {
    const subscriptions = await controller.findAll()
    expect(subscriptions).toEqual([mockSubscription, mockSubscriptionWithCredentials])
  })

  it('should return a subscription by id', async () => {
    const subscription = await controller.findOne('1')
    expect(subscription).toEqual(mockSubscription)
  })

  it('should create a subscription', async () => {
    const subscription = await controller.create(mockSubscription)
    expect(subscription).toEqual(mockSubscription)
  })

  it('should update a subscription', async () => {
    const subscription = await controller.update('1', mockSubscription)
    expect(subscription).toEqual(mockSubscription)
  })

  it('should remove a subscription', async () => {
    const subscription = await controller.remove('1')
    expect(subscription).toEqual(mockSubscription)
  })
})
