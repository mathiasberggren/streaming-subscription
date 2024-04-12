import { PrismaClient, Subscription, SubscriptionCredential } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

import { subscriptionFactory } from './subscription'

interface ISubscriptionCredentialFactory extends SubscriptionCredential {
  subscription: Subscription
}
export const subscriptionCredentialFactory = Factory.define<ISubscriptionCredentialFactory>(({ sequence, onCreate }) => {
  onCreate(async (credential) => {
    const prisma = new PrismaClient()

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

  const subscription = subscriptionFactory.build()

  return {
    id: sequence,
    subscriptionId: subscription.id,
    subscription,
    username: faker.internet.userName(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})