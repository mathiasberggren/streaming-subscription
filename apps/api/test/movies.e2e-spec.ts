import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { faker } from '@faker-js/faker'

import { AppModule } from '../src/app/app.module'
import { movieFactory } from '../src/database/factories/movie'
import prisma from '../src/database/client'

import truncateDb from './helpers/truncate-db'

describe('MoviesController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await truncateDb()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/movies (POST)', () => {
    describe('happy case', () => {
      const movie = movieFactory.build()
      const movieTitle = movie.movieTitles[0]

      it('should return 201', async () => {
        const response = await request(app.getHttpServer() as App)
          .post('/movies')
          .send({
            genre: movie.genre,
            director: movie.director,
            duration: movie.duration,
            subtitles: movie.subtitles,
            releaseDate: movie.releaseDate,
            movieTitles: movie.movieTitles
          })

        expect(response.status).toBe(201)
      })

      it('should store a movie in the database', async () => {
        await request(app.getHttpServer() as App)
          .post('/movies')
          .send({
            genre: movie.genre,
            director: movie.director,
            duration: movie.duration,
            subtitles: movie.subtitles,
            releaseDate: movie.releaseDate,
            movieTitles: movie.movieTitles
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

        expect(movieInDatabase).toEqual(expect.objectContaining({
          genre: movie.genre,
          director: movie.director,
          duration: movie.duration,
          subtitles: movie.subtitles,
          releaseDate: movie.releaseDate
        }))

        expect(movieInDatabase?.movieTitles).toEqual(expect.arrayContaining([
          expect.objectContaining({
            title: movieTitle.title,
            language: movieTitle.language,
            image: movieTitle.image
          })
        ]))
      })
    })

    it('should return 400 if the body is invalid', async () => {
      const response = await request(app.getHttpServer() as App)
        .post('/movies')
        .send({})

      expect(response.status).toBe(400)
    })
  })

  describe('/movies/search (GET)', () => {
    beforeEach(async () => {
      await movieFactory.createList(10)
    })

    it('should return the exact match', async () => {
      const movie = await movieFactory.create()
      const movieTitle = faker.helpers.arrayElement(movie.movieTitles)
      const uriTitle = encodeURIComponent(movieTitle.title)

      const response = await request(app.getHttpServer() as App).get(`/movies/search?title=${uriTitle}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          movieTitles: expect.arrayContaining([
            expect.objectContaining({
              title: movieTitle.title,
              language: movieTitle.language,
              image: movieTitle.image
            })
          ])
        })
      ]))
    })

    it('should fuzzy match the movie title and only return the related ones', async () => {
      await movieFactory.withTitle('The Matrix').create()

      const response = await request(app.getHttpServer() as App).get('/movies/search?title=matris')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          movieTitles: expect.arrayContaining([
            expect.objectContaining({
              title: 'The Matrix'
            })
          ])
        })
      ]))
    })

    it('should fuzzy match better', async () => {
      await movieFactory.withTitle('The Matrix').create()
      await movieFactory.withTitle('The Matrix Reloaded').create()

      const response = await request(app.getHttpServer() as App).get('/movies/search?title=matris')

      const [theMatrix, theMatrixReloaded] = response.body

      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(2)

      expect(theMatrix).toEqual(expect.objectContaining({
        movieTitles: expect.arrayContaining([
          expect.objectContaining({
            title: 'The Matrix'
          })
        ])
      }))

      expect(theMatrixReloaded).toEqual(expect.objectContaining({
        movieTitles: expect.arrayContaining([
          expect.objectContaining({
            title: 'The Matrix Reloaded'
          })
        ])
      }))
    })

    it('should return 200 and an empty parameter list if the movie is not found', async () => {
      const response = await request(app.getHttpServer() as App).get('/movies/search?title=not-a-movie')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })
})
