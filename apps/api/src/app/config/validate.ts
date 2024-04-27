import { z } from 'nestjs-zod/z'

export function validate (config: Record<string, unknown>) {
  const schema = z.object({
    DATABASE_URL: z.string().url(),
    STREAMING_AVAILABILITY_API_HOST: z.string().url().optional(),
    IMDB_API_HOST: z.string().url().optional(),
    RAPID_API_KEY: z.string().optional(),
    OAUTH_GOOGLE_CLIENT_ID: z.string().optional(),
    OAUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
    OAUTH_GOOGLE_REDIRECT_URI: z.string().optional(),
    JWT_SECRET: z.string()
  })

  schema.parse(config)

  return config
}
