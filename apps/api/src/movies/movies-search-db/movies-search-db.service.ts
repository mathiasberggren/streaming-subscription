import { Injectable } from '@nestjs/common'
import { Movie } from '@prisma/client'

import { MoviesSearch } from '../interfaces/movies-search.interface'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class MoviesSearchDbService implements MoviesSearch {
  constructor (
    private readonly db: PrismaService
  ) {}

  async findByTitle (searchTitle: string, queryLimit: number = 10) {
    const result = await this.db.$queryRaw<Movie[]>`
      SELECT m.* FROM "Movie" m
        JOIN "MovieTitle" mt ON m.id = mt."movieId"
          WHERE mt.title % ${searchTitle} 
          ORDER BY similarity(mt.title, ${searchTitle}) DESC
        LIMIT ${queryLimit};`

    return result
  }
}
