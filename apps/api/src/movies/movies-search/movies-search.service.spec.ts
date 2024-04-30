import { Test, TestingModule } from '@nestjs/testing'

import { MoviesSearchService } from './movies-search.service'

describe('MoviesSearchService', () => {
  let service: MoviesSearchService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesSearchService]
    }).compile()

    service = module.get<MoviesSearchService>(MoviesSearchService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
