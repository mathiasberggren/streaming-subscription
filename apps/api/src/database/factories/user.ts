import { PrismaClient, Subscription, User } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

interface IUserFactory extends User {
  subscription?: Subscription[]
}
export const userFactory = Factory.define<IUserFactory>(({ sequence, onCreate }) => {
  onCreate(async (user) => {
    // TODO: provide singleton instance of PrismaClient
    const prisma = new PrismaClient()

    return await prisma.user.create({
      data: {
        // ID is auto-generated
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  })
  return {
    id: sequence,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
