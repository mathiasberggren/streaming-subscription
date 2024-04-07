import { Injectable } from '@nestjs/common'

import { firstValueFrom } from 'rxjs'
import { StreamingApiHttpService } from './clients/streaming-api.service'
import { MoviesSearch } from './interfaces/movies-search.interface'

@Injectable()
export class MoviesSearchApiService implements MoviesSearch {
  constructor (private readonly streamingClient: StreamingApiHttpService) {}

  async findByTitle (title: string) {
    const { data } = await firstValueFrom(this.streamingClient.get('/search/title', { params: { title, country: 'se' } }))
    return data
  }
}
