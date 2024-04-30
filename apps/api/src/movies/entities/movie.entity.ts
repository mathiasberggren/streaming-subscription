import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const MovieSchema = z.object({
  id: z.number(),
  genre: z.string(),
  director: z.string(),
  subtitles: z.string().array().optional(),
  releaseDate: z.date(),
  movieTitles: z.array(z.object({
    id: z.number(),
    title: z.string(),
    language: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
  })),
  createdAt: z.date(),
  updatedAt: z.date()
})

export class Movie extends createZodDto(MovieSchema) {}
