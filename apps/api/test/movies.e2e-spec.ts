import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'

import { AppModule } from '../src/app/app.module'
import { movieFactory } from '../src/database/factories/movie'
import { movieTitleFactory } from '../src/database/factories/movieTitle'

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
    it('should create a movie', async () => {
      const movie = movieFactory.build()
      const movieTitle = movieTitleFactory.build()

      return await request(app.getHttpServer() as App)
        .post('/movies')
        .send({
          genre: movie.genre,
          director: movie.director,
          duration: movie.duration,
          subtitles: movie.subtitles,
          releaseDate: movie.releaseDate,
          movieTitles: [movieTitle]
        })
        .expect(201)
        .expect({
          message: 'Movie created successfully'
        })
    })

    it('should return 400 if the body is not valid', async () => {
      return await request(app.getHttpServer() as App)
        .post('/movies')
        .send({})
        .expect(400)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
