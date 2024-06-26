import { Company, Subscription, SubscriptionCredential, User } from '@prisma/client'
import { Factory } from 'fishery'

import prisma from '../client'

import { userFactory } from './user'
import { companyFactory } from './company'
import { subscriptionCredentialFactory } from './subscriptionCredential'

interface ISubscriptionFactory extends Subscription {
  user?: User
  company?: Company
  credentials?: SubscriptionCredential
}

class SubscriptionFactory extends Factory<ISubscriptionFactory> {
  withCredentials () {
    return this.associations({
      credentials: subscriptionCredentialFactory.build()
    })
  }
}

export const subscriptionFactory = SubscriptionFactory.define(({ sequence, onCreate }) => {
  onCreate(async (subscription) => {
    const user = await userFactory.create(subscription.user)
    const company = await companyFactory.create(subscription.company)

    return await prisma.subscription.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        company: {
          connect: {
            id: company.id
          }
        }
      }
    })
  })

  return {
    id: sequence,
    userId: sequence,
    companyId: sequence,
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
