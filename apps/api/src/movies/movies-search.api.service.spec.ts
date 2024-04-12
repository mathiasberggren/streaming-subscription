import { Test, TestingModule } from '@nestjs/testing'
import { MoviesSearchApiService } from './movies-search.api.service'
import { ImdbApiHttpService } from './clients/imdb-api.service'
import { HttpService } from '@nestjs/axios'
import { createMock } from '@golevelup/ts-jest'
import { IMDBSearchResponse } from './interfaces/imdb-api.interface'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'

describe('MoviesSearchApiService', () => {
  let service: MoviesSearchApiService
  let httpService: ImdbApiHttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesSearchApiService,
        {
          provide: ImdbApiHttpService,
          useExisting: HttpService
        }
      ]
    }).useMocker(createMock).compile()

    service = module.get<MoviesSearchApiService>(MoviesSearchApiService)
    httpService = module.get<ImdbApiHttpService>(ImdbApiHttpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return all movies with given title', async () => {
    const data: IMDBSearchResponse = {
      status: true,
      message: 'Success',
      timestamp: 1689187551887,
      data: [
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
    }

    const response: AxiosResponse<IMDBSearchResponse> = {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' }
    }

    jest.spyOn(httpService, 'get').mockReturnValue(of(response))

    const movies = await service.findByTitle('Mission')
    expect(movies).toEqual(data.data)
  })
})
