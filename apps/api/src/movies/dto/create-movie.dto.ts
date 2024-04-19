import { z } from 'nestjs-zod/z'
import { createZodDto } from 'nestjs-zod'

const createMovieTitleSchema = z.object({
  language: z.string(),
  title: z.string()
})

const CreateMovieSchema = z.object({
  genre: z.string(),
  director: z.string(),
  duration: z.number().int(),
  subtitles: z.string().array().optional().default([]),
  releaseDate: z.date(),
  movieTitles: z.array(createMovieTitleSchema).nonempty()
})

export class CreateMovieDto extends createZodDto(CreateMovieSchema) {}
