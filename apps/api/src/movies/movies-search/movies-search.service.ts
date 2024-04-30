import { Injectable } from '@nestjs/common'
import { Movie } from '@prisma/client'

import { MoviesSearch } from '../interfaces/movies-search.interface'

// Only used for NestJS to find the correct provider to inject into MoviesController

@Injectable()
export abstract class MoviesSearchService implements MoviesSearch {
  // TODO: Implement Movie response interface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract findByTitle (title: string): Promise<Movie[]>
}
