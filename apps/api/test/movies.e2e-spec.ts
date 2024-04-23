import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'

import { AppModule } from '../src/app/app.module'
import { movieFactory } from '../src/database/factories/movie'
import { movieTitleFactory } from '../src/database/factories/movieTitle'
import prisma from '../src/database/client'

import truncateTables from './helpers/truncate-db'

describe('MoviesController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('/movies (POST)', () => {
    describe('happy case', () => {
      const movie = movieFactory.build()
      const movieTitle = movieTitleFactory.build()

      it('should return 200', async () => {
        const response = await request(app.getHttpServer() as App)
          .post('/movies')
          .send({
            genre: movie.genre,
            director: movie.director,
            duration: movie.duration,
            subtitles: movie.subtitles,
            releaseDate: movie.releaseDate,
            movieTitles: [movieTitle]
          })

        expect(response.status).toBe(201)
        expect(response.body).toEqual({
          message: 'Movie created successfully'
        })
      })

      it('should store a movie in the database', async () => {
        await truncateTables()

        await request(app.getHttpServer() as App)
          .post('/movies')
          .send({
            genre: movie.genre,
            director: movie.director,
            duration: movie.duration,
            subtitles: movie.subtitles,
            releaseDate: movie.releaseDate,
            movieTitles: [movieTitle]
          })

        const movieInDatabase = await prisma.movie.findFirst({
          where: {
            director: movie.director,
            releaseDate: movie.releaseDate
          },
          include: {
            movieTitles: true
          }
        })

        const { id, ...movieWithoutId } = movie
        const { movieTitleId, movieId, ...movieTitleWithoutIds } = movieTitle
        expect(movieInDatabase).toMatchObject({
          ...movieWithoutId,
          movieTitles: [movieTitleWithoutIds]
        })
      })
    })
    it('should return 400 if the body is invalid', async () => {
      const response = await request(app.getHttpServer() as App)
        .post('/movies')
        .send({})

      expect(response.status).toBe(400)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
