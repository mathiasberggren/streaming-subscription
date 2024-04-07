import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { StreamingApiModule } from './clients/streaming-api.module'
import { MoviesSearchApiService } from './movies-search.api.service'
import { MoviesSearchService } from './movies-search.service'

@Module({
  imports: [StreamingApiModule],
  controllers: [MoviesController],
  providers: [
    MoviesService,

    // TODO: switch to MoviesSearchDbService as soon as the scraper is implemented
    {
      provide: MoviesSearchService,
      useClass: MoviesSearchApiService
    }
  ]
})
export class MoviesModule {}
