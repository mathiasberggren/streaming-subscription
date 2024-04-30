import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const SubscriptionSchema = z.object({
  id: z.number(),
  userId: z.number(),
  companyId: z.number(),
  credentials: z.object({
    id: z.number(),
    username: z.string()
    // Hides password in any response payload
  }).nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export class Subscription extends createZodDto(SubscriptionSchema) {}
