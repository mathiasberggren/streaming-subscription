import { HttpModule, HttpService } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { StreamingApiBuilder, StreamingApiHttpService } from './streaming-api.service'

@Module({
  imports: [HttpModule.registerAsync({
    useClass: StreamingApiBuilder
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
