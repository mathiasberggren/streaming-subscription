import { HttpModule, HttpService } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ImdbApiHttpService } from './imdb-api.service'

@Module({
  imports: [HttpModule.registerAsync({
    useFactory: async (config: ConfigService) => ({
      baseURL: config.get('IMDB_API_HOST'),
      headers: {
        'X-RapidAPI-Key': config.get('RAPID_API_KEY')
      }
    }),
    inject: [ConfigService]
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
