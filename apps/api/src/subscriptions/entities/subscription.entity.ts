import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const SubscriptionResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  companyId: z.number(),
  credentials: z.object({
    id: z.number(),
    username: z.string()
    // Hides password in any response payload
  }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export class SubscriptionResponse extends createZodDto(SubscriptionResponseSchema) {}
