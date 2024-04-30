import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export class User extends createZodDto(UserSchema) {}
