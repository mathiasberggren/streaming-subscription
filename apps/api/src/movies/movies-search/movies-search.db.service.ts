import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

import { MoviesSearchService } from './movies-search.service'

interface MovieId {
  movie_id: number
}

@Injectable()
export class MoviesSearchDbService extends MoviesSearchService {
  constructor (
    private readonly db: PrismaService
  ) {
    super()
  }

  private async findSimilarity (searchTitle: string, queryLimit: number = 10) {
    return await this.db.$queryRaw<MovieId[]>`
      SELECT movie_id FROM "movie_titles" m
         WHERE ${searchTitle} % ANY(STRING_TO_ARRAY(m.title, ' '))
         ORDER BY similarity(t.title, ${searchTitle}) DESC
       LIMIT ${queryLimit};`
  }

  async findByTitle (searchTitle: string, queryLimit: number = 10) {
    const decodedSearchTitle = decodeURIComponent(searchTitle)
    const movieIds = await this.findSimilarity(decodedSearchTitle, queryLimit)

    // Performs a second db query which is less performant but more type-safe
    const movies = await this.db.movie.findMany({
      where: {
        id: {
          in: movieIds.map(row => row.movie_id)
        }
      },
      include: {
        movieTitles: true
      }
    })

    return movies
  }
}
