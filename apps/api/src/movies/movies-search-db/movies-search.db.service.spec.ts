import { Test, TestingModule } from '@nestjs/testing'

import { PrismaService } from '../../database/prisma.service'

import { MoviesSearchDbService } from './movies-search-db.service'

describe('MoviesSearchDbService', () => {
  let service: MoviesSearchDbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesSearchDbService, PrismaService]
    }).compile()

    service = module.get<MoviesSearchDbService>(MoviesSearchDbService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
