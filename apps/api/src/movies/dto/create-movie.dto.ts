import { z } from 'nestjs-zod/z'
import { createZodDto } from 'nestjs-zod'

const createMovieTitleSchema = z.object({
  language: z.string(),
  title: z.string()
})

const CreateMovieSchema = z.object({
  genre: z.string(),
  director: z.string(),
  duration: z.number(),
  subtitles: z.array(z.string()),
  releaseDate: z.date(),
  movieTitles: z.array(createMovieTitleSchema)
})

export class CreateMovieDto extends createZodDto(CreateMovieSchema) {}
