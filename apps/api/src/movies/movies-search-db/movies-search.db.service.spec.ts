import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'

import { movieFactory } from '../../database/factories/movie'
import { PrismaService } from '../../database/prisma.service'
import { movieTitleFactory } from '../../database/factories/movieTitle'

import { MoviesSearchDbService } from './movies-search-db.service'

describe('MoviesSearchDbService', () => {
  let service: MoviesSearchDbService

  let module: TestingModule
  let prismaService: PrismaService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [MoviesSearchDbService, PrismaService]
    })
      .useMocker(createMock)
      .compile()

    service = module.get<MoviesSearchDbService>(MoviesSearchDbService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it.only('should call the database with the search title', async () => {
    const queryRawSpy = jest.spyOn(prismaService, '$queryRaw').mockResolvedValueOnce([])

    const title = 'Any Title'
    await service.findByTitle(title)

    const queryRawCalls = queryRawSpy.mock.calls[0][0]

    const queryRawCallsString = (queryRawCalls as unknown as string[]).map(elem => elem.replace(/\s+/g, ' ')).join(' ')

    const expectedSqlQuery = ' SELECT m.*, t.* FROM "Movie" m ' +
      'JOIN "MovieTitle" t ON m.id = t."movieId" ' +
      'WHERE t.title %   ORDER BY similarity(t.title,  ) DESC LIMIT  ;'
    expect(queryRawSpy).toHaveBeenCalledWith(
      [expect.any(String), expect.any(String), expect.any(String), expect.any(String)],
      title, title, 10)

    expect(queryRawCallsString).toBe(expectedSqlQuery)
  })

  it('should handle empty results from the database', async () => {
    jest.spyOn(prismaService, '$queryRaw').mockResolvedValueOnce([])

    const results = await service.findByTitle('Nonexistent Movie')

    expect(results).toEqual([])
  })

  it('should handle database errors by throwing', async () => {
    jest.spyOn(prismaService, '$queryRaw').mockRejectedValueOnce(new Error('Database error'))

    await expect(service.findByTitle('The Matrix')).rejects.toThrow('Database error')
  })

  it('should post-process data correctly', async () => {
    const mockMovieData = movieFactory.build()
    const mockMovieTitleData = movieTitleFactory.build()

    jest.spyOn(prismaService, '$queryRaw').mockResolvedValueOnce([{ ...mockMovieData, ...mockMovieTitleData }])

    const result = await service.findByTitle('Mock Title')

    expect(result).toEqual([{ ...mockMovieData, movieTitles: [mockMovieTitleData] }])
  })
})
