import { Injectable } from '@nestjs/common'

import { MoviesSearch } from '../interfaces/movies-search.interface'
import { Movie } from '../entities/movie.entity'

@Injectable()
export abstract class MoviesSearchService implements MoviesSearch {
  abstract findByTitle (title: string): Promise<Movie[]>
}
