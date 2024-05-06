import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'

import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'
import { MoviesSearchService } from './movies-search/movies-search.service'
import { MoviesSearchApiService } from './movies-search/movies-search.api.service'

const movies = [
  {
    id: 'tt9603212',
    qid: 'movie',
    title: 'Mission: Impossible - Dead Reckoning Part One',
    year: 2023,
    stars: 'Tom Cruise, Hayley Atwell',
    q: 'feature',
    image: 'https://m.media-amazon.com/images/M/MV5BY2VmZDhhNjgtNDcxYi00M2I3LThlMTQtMWRiNWI2Y2I4ZjRmXkEyXkFqcGdeQXVyMTMxMTIwMTE0._V1_.jpg'
  },
  {
    id: 'tt0117060',
    qid: 'movie',
    title: 'Mission: Impossible',
    year: 1996,
    stars: 'Tom Cruise, Jon Voight',
    q: 'feature',
    image: 'https://m.media-amazon.com/images/M/MV5BMTc3NjI2MjU0Nl5BMl5BanBnXkFtZTgwNDk3ODYxMTE@._V1_.jpg'
  }
]

describe('MoviesController', () => {
  let controller: MoviesController
  let movieSearchService: MoviesSearchService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: MoviesSearchService,
          useClass: MoviesSearchApiService
        }
      ]
    }).useMocker(createMock).compile()

    controller = module.get<MoviesController>(MoviesController)
    movieSearchService = module.get<MoviesSearchService>(MoviesSearchService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should find a movie by title', async () => {
    movieSearchService.findByTitle = jest.fn().mockResolvedValueOnce(movies)

    const response = await controller.findByTitle('Mission: Impossible')

    expect(response).toEqual(movies)
  })
})
