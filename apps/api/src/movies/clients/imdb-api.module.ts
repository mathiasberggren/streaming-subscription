import { HttpModule, HttpService } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ImdbApiBuilder, ImdbApiHttpService } from './imdb-api.service'

@Module({
  imports: [HttpModule.registerAsync({
    useClass: ImdbApiBuilder
  })],
  providers: [
    {
      provide: ImdbApiHttpService,
      useExisting: HttpService
    }
  ],
  exports: [ImdbApiHttpService]
})
export class ImdbApiModule {}
