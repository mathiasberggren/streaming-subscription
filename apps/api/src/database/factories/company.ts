import { PrismaClient, Company } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

export const companyFactory = Factory.define<Company>(({ sequence, onCreate }) => {
  onCreate(async (company) => {
    const prisma = new PrismaClient()
    return await prisma.company.create({ data: company })
  })

  return {
    id: sequence,
    name: faker.person.fullName(),
    image: faker.image.urlLoremFlickr({ category: 'business' }),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
