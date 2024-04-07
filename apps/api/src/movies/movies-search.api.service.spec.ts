import { Test, TestingModule } from '@nestjs/testing'
import { MoviesSearchApiService } from './movies-search.api.service'

describe('MoviesSearchApiService', () => {
  let service: MoviesSearchApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesSearchApiService]
    }).compile()

    service = module.get<MoviesSearchApiService>(MoviesSearchApiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
