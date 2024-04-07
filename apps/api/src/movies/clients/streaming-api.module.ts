import { HttpModule, HttpService } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StreamingApiHttpService } from './streaming-api.service'

@Module({
  imports: [HttpModule.registerAsync({
    useFactory: async (config: ConfigService) => ({
      baseURL: config.get('STREAMING_AVAILABILITY_API_HOST'),
      headers: {
        'X-RapidAPI-Key': config.get('RAPID_API_KEY')
      }
    }),
    inject: [ConfigService]
  })],
  providers: [
    {
      provide: StreamingApiHttpService,
      useExisting: HttpService
    }
  ],
  exports: [StreamingApiHttpService]
})
export class StreamingApiModule {}
