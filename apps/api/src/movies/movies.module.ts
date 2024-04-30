import { Module } from '@nestjs/common'

import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { StreamingApiModule } from './clients/streaming-api.module'
// IMDB API Service
// import { MoviesSearchApiService } from './movies-search.api.service'
import { MoviesSearchService } from './movies-search/movies-search.service'
import { ImdbApiModule } from './clients/imdb-api.module'
import { MoviesSearchDbService } from './movies-search/movies-search.db.service'

@Module({
  imports: [StreamingApiModule, ImdbApiModule],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    {
      provide: MoviesSearchService,
      useClass: MoviesSearchDbService
    }
  ]
})
export class MoviesModule {}
