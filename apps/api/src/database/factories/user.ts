import { PrismaClient, User } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

export const userFactory = Factory.define<User>(({ sequence, onCreate }) => {
  onCreate(async (user) => {
    const prisma = new PrismaClient()
    return await prisma.user.create({ data: user })
  })
  return {
    id: sequence,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
