import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../database/prisma.service'

import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'

@Injectable()
export class SubscriptionsService {
  constructor (private readonly db: PrismaService) {}
  async create (createSubscriptionDto: CreateSubscriptionDto) {
    const { userId, companyId, credentials } = createSubscriptionDto
    const subscription: Prisma.SubscriptionCreateInput = {
      user: {
        connect: {
          id: userId
        }
      },
      company: {
        connect: {
          id: companyId
        }
      }
    }

    if (credentials != null) {
      subscription.subscriptionCredential = {
        create: {
          ...credentials
        }
      }
    }

    try {
      await this.db.subscription.create({ data: subscription })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User or company not found')
        }
      }
      throw error
    }
  }

  async findAll () {
    return await this.db.subscription.findMany()
  }

  async findOne (id: number) {
    return await this.db.subscription.findUnique({
      where: {
        id
      }
    })
  }

  async update (id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const { companyId, userId, credentials } = updateSubscriptionDto
    const subscription: Prisma.SubscriptionUpdateInput = {}

    if (companyId != null) {
      subscription.company = {
        connect: {
          id: companyId
        }
      }
    }

    if (companyId != null) {
      subscription.user = {
        connect: {
          id: userId
        }
      }
    }

    if (credentials != null) {
      subscription.subscriptionCredential = {
        update: {
          ...credentials
        }
      }
    }

    try {
      return await this.db.subscription.update({
        where: {
          id
        },
        data: subscription
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User or company not found')
        }
      }
      throw error
    }
  }

  async remove (id: number) {
    return await this.db.subscription.delete({
      where: {
        id
      }
    })
  }
}
