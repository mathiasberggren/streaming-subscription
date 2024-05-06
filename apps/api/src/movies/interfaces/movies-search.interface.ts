import { Movie } from '../entities/movie.entity'

export interface MoviesSearch {
  findByTitle: (title: string) => Promise<Movie[]>
}
