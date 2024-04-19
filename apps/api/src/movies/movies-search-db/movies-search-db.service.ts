import { Injectable } from '@nestjs/common'

import { MoviesSearch } from '../interfaces/movies-search.interface'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class MoviesSearchDbService implements MoviesSearch {
  constructor (private readonly db: PrismaService) {}

  async findByTitle (title: string) {
    return await this.db.movieTitle.findFirst({
      where: { title },
      include: { Movie: true }
    })
  }
}
