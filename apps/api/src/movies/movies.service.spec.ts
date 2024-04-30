import { Test, TestingModule } from '@nestjs/testing'

import { PrismaService } from '../database/prisma.service'

import { MoviesService } from './movies.service'
import { CreateMovieDto } from './dto/create-movie.dto'

describe('MoviesService', () => {
  let service: MoviesService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              create: jest.fn().mockResolvedValue({})
            }
          }
        }
      ]
    }).compile()

    service = module.get<MoviesService>(MoviesService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a movie', async () => {
    const createMovieDto: CreateMovieDto = {
      genre: 'Action',
      director: 'John Doe',
      duration: 120,
      subtitles: ['English', 'Spanish'],
      releaseDate: new Date(),
      movieTitles: [{ language: 'English', title: 'Example Title' }]
    }

    const expectedResult = {
      ...createMovieDto,
      id: 1
    }

    jest.spyOn(prismaService.movie, 'create').mockResolvedValue(expectedResult)

    await expect(service.create(createMovieDto)).resolves.toEqual(expectedResult)
  })
})
