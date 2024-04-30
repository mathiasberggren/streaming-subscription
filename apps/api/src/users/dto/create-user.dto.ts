import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url().optional()
})

export class CreateUserDto extends createZodDto(UserSchema) {}
