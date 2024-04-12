import { z } from 'nestjs-zod/z'

export function validate (config: Record<string, unknown>) {
  const schema = z.object({
    DATABASE_URL: z.string().url(),
    STREAMING_AVAILABILITY_API_HOST: z.string().url().optional(),
    IMDB_API_HOST: z.string().url().optional(),
    RAPID_API_KEY: z.string().optional()

  })

  schema.parse(config)

  return config
}
