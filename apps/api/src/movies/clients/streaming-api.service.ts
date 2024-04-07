import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class StreamingApiHttpService extends HttpService {}
