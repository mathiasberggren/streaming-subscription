import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

import { ImdbApiHttpService } from '../clients/imdb-api.service'
import { IMDBMovie } from '../interfaces/imdb-api.interface'
import { Movie } from '../entities/movie.entity'

import { MoviesSearchService } from './movies-search.service'

@Injectable()
export class MoviesSearchApiService extends MoviesSearchService {
  constructor (private readonly imdbClient: ImdbApiHttpService) {
    super()
  }

  async findByTitle (title: string): Promise<Movie[]> {
    const { data: response } = await firstValueFrom(this.imdbClient.get('/api/v1/searchIMDB', { params: { query: title } }))
    const movies: IMDBMovie[] = response.data

    /**
     * TODO: refactor IMDB API to return the rest of the data
     * - genre
     * - director
     * - imdbId
     */
    return movies.map(movie => ({
      // Hash string into a number
      id: movie.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
      releaseDate: new Date(`${movie.year}-01-01`),
      movieTitles: [
        {
          id: movie.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
          title: movie.title,
          image: movie.image,
          language: 'en',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      genre: 'TBD',
      director: 'TBD',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }
}
