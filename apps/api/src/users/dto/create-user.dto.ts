import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
})

export class CreateUserDto extends createZodDto(UserSchema) {}
