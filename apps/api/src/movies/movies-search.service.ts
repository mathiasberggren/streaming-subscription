import { Injectable } from '@nestjs/common'
import { MoviesSearch } from './interfaces/movies-search.interface'

// Only used for NestJS to find the correct provider to inject into MoviesController

@Injectable()
export abstract class MoviesSearchService implements MoviesSearch {
  abstract findByTitle (title: string): Promise<any>
}
