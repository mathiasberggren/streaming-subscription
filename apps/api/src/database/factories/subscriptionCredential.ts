import { Subscription, SubscriptionCredential } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

import prisma from '../client'

import { subscriptionFactory } from './subscription'

interface ISubscriptionCredentialFactory extends SubscriptionCredential {
  subscription?: Subscription
}
export const subscriptionCredentialFactory = Factory.define<ISubscriptionCredentialFactory>(({ sequence, onCreate }) => {
  onCreate(async (credential) => {
    const subscription = await subscriptionFactory.create(credential.subscription)

    return await prisma.subscriptionCredential.create({
      data: {
        username: credential.username,
        password: credential.password,
        subscription: {
          connect: {
            id: subscription.id
          }
        }
      },
      include: {
        subscription: true
      }
    })
  })

  return {
    id: sequence,
    subscriptionId: sequence,
    username: faker.internet.userName(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
