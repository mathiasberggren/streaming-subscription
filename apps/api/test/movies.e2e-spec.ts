import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { ConfigModule } from '@nestjs/config'

import { MoviesModule } from '../src/movies/movies.module'

describe('MoviesController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, MoviesModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/api/movies (POST)', () => {
    return request(app.getHttpServer() as App)
      .post('/api/movies')
      .send({
        genre: 'Action',
        director: 'John Doe',
        duration: 120,
        subtitles: ['English', 'Spanish'],
        releaseDate: '2023-04-01T00:00:00.000Z',
        movieTitles: [
          {
            language: 'English',
            title: 'Example Title'
          }
        ]
      })
      .expect(201)
      .expect({
        message: 'Movie created successfully'
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
