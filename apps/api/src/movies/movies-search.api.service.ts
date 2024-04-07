import { Injectable } from '@nestjs/common'

import { firstValueFrom } from 'rxjs'
import { MoviesSearch } from './interfaces/movies-search.interface'
import { ImdbApiHttpService } from './clients/imdb-api.service'

@Injectable()
export class MoviesSearchApiService implements MoviesSearch {
  constructor (private readonly imdbClient: ImdbApiHttpService) {}

  async findByTitle (title: string) {
    const { data } = await firstValueFrom(this.imdbClient.get('/api/v1/searchIMDB', { params: { query: title } }))
    return data
  }
}
