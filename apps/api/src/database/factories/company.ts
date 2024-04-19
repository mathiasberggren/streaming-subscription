import { Company } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

import prisma from '../client'

export const companyFactory = Factory.define<Company>(({ sequence, onCreate }) => {
  onCreate(async (company) => {
    return await prisma.company.create({
      data: {
        // ID is auto-generated
        name: company.name,
        image: company.image,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    })
  })

  return {
    id: sequence,
    name: faker.person.fullName(),
    image: faker.image.urlLoremFlickr({ category: 'business' }),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
