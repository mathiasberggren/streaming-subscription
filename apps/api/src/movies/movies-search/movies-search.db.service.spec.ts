import { TestBed } from '@automock/jest'

import { movieFactory } from '../../database/factories/movie'
import { PrismaService } from '../../database/prisma.service'

import { MoviesSearchDbService } from './movies-search.db.service'

describe('MoviesSearchDbService', () => {
  let service: MoviesSearchDbService

  const queryRawMock = jest.fn()
  const findManyMock = jest.fn()

  beforeAll(async () => {
    const { unit } = TestBed.create(MoviesSearchDbService)
      .mock(PrismaService)
      .using({
        $queryRaw: queryRawMock.mockResolvedValue([]),
        movie: {
          findMany: findManyMock.mockResolvedValue([])
        }
      })
      .compile()

    service = unit
  })

  describe('findSimilarity', () => {
    it('should run a raw query', async () => {
      const title = 'Any Title'
      await service.findSimilarity(title)

      expect(queryRawMock).toHaveBeenCalledWith([
        '\n      SELECT movie_id FROM "movie_titles" m\n      WHERE ',
        " % ANY(STRING_TO_ARRAY(m.title, ' '))\n" +
          '      ORDER BY similarity(t.title, ',
        ') DESC\n      LIMIT ',
        ';'
      ], title, title, 10)
    })
  })

  describe('findByTitle', () => {
    it('should handle empty results from the database', async () => {
      const results = await service.findByTitle('Nonexistent Movie')

      expect(results).toEqual([])
    })

    it('should handle database errors by throwing', async () => {
      findManyMock.mockRejectedValueOnce(new Error('Database error'))

      await expect(service.findByTitle('The Matrix')).rejects.toThrow('Database error')
    })

    it('should return a movie', async () => {
      const movie = movieFactory.build()

      findManyMock.mockResolvedValueOnce([movie])

      const result = await service.findByTitle('Mock Title')

      expect(result).toEqual([movie])
    })
  })
})
