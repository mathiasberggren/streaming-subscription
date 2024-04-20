import { Injectable } from '@nestjs/common'
import { Movie, MovieTitle } from '@prisma/client'

import { MoviesSearch } from '../interfaces/movies-search.interface'
import { PrismaService } from '../../database/prisma.service'

interface MovieWithMovieTitleRow {
  id: number
  genre: string
  director: string
  duration: number
  subtitles: string[]
  releaseDate: Date

  movieTitleId: number
  title: string
  movieId: number
  language: string
}

// TODO: Should be possible to derive from Prisma
type MovieWithTitle = Movie & { movieTitles: MovieTitle[] }

@Injectable()
export class MoviesSearchDbService implements MoviesSearch {
  constructor (
    private readonly db: PrismaService
  ) {}

  async findByTitle (searchTitle: string, queryLimit: number = 10): Promise<MovieWithTitle[]> {
    const queryResult = await this.db.$queryRaw<MovieWithMovieTitleRow[]>`
      SELECT m.*, t.* FROM "Movie" m
        JOIN "MovieTitle" t ON m.id = t."movieId"
          WHERE t.title % ${searchTitle} 
          ORDER BY similarity(t.title, ${searchTitle}) DESC
        LIMIT ${queryLimit};`

    const processedResult = queryResult.reduce<MovieWithTitle[]>((acc, row) => {
      // Look for if we already processed the movie
      const movie = acc.find(elem => elem.id === row.id)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!movie) {
        const { id, genre, director, duration, subtitles, releaseDate, ...movieTitle } = row

        acc.push({
          id,
          genre,
          director,
          duration,
          subtitles,
          releaseDate,
          movieTitles: [movieTitle]
        })
        // if we already processed the movie, this is the same entry but with another title
      } else {
        const { id, genre, director, duration, subtitles, releaseDate, ...movieTitle } = row

        movie.movieTitles.push(movieTitle)
      }
      return acc
    }, [])

    return processedResult
  }
}
