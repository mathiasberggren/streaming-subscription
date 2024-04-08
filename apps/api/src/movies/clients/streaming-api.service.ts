import { HttpModuleOptions, HttpModuleOptionsFactory, HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StreamingApiBuilder implements HttpModuleOptionsFactory {
  constructor (private readonly config: ConfigService) {
  }

  createHttpOptions (): HttpModuleOptions {
    return {
      baseURL: this.config.get('STREAMING_AVAILABILITY_API_HOST'),
      headers: {
        'X-RapidAPI-Key': this.config.get('RAPID_API_KEY')
      }
    }
  }
}

export abstract class StreamingApiHttpService extends HttpService {}
