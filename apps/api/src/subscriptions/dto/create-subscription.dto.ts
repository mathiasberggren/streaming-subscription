import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const SubscriptionSchema = z.object({
  userId: z.number(),
  companyId: z.number(),
  credentials: z.object({
    username: z.string(),
    password: z.password()
  }).optional()
})

export class CreateSubscriptionDto extends createZodDto(SubscriptionSchema) {}
