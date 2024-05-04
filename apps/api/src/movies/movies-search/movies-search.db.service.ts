import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

import { MoviesSearchService } from './movies-search.service'

interface MovieId {
  movie_id: number
}

const SIMILARITY_THRESHOLD = 0.2

@Injectable()
export class MoviesSearchDbService extends MoviesSearchService {
  constructor (
    private readonly db: PrismaService
  ) {
    super()
  }

  async findSimilarity (searchTitle: string, queryLimit: number = 10) {
    return await this.db.$queryRaw<MovieId[]>`
      SELECT movie_id FROM "movie_titles" mt
      WHERE similarity(mt.title, ${searchTitle}) > ${SIMILARITY_THRESHOLD}
      ORDER BY similarity(mt.title, ${searchTitle}) DESC
      LIMIT 10;
    `
  }

  async findByTitle (searchTitle: string, queryLimit: number = 10) {
    const decodedSearchTitle = decodeURIComponent(searchTitle)
    const movieIds = await this.findSimilarity(decodedSearchTitle, queryLimit)

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
