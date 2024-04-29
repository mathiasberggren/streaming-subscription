import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'

import { AppModule } from '../src/app/app.module'
import { IMovieFactory, movieFactory } from '../src/database/factories/movie'
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

  describe('/movies/search (GET)', () => {
    const movies: IMovieFactory[] = []

    // For some reason if I use this beforeAll, the movies are not
    // inserted into the DB during the test even though I verified in logs
    // that they do get inserted... Any idea why?
    // beforeAll(async () => {
    //   movies.push(...await movieFactory.createList(10))
    // })

    afterEach(async () => {
      await truncateTables()
    })

    it('should return the movie searched as the top selection', async () => {
      movies.push(...await movieFactory.createList(10))

      const title = 'The ultimate movie to search for'
      const movie = await movieFactory.create({ movieTitles: [movieTitleFactory.build({ title, language: 'en' })] })
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const movieTitle = movie.movieTitles![0]
      const uriTitle = encodeURIComponent(movieTitle.title)

      const response = await request(app.getHttpServer() as App).get(`/movies/search?title=${uriTitle}`)

      expect(response.status).toBe(200)
      expect(response.body[0]).toEqual({
        ...movie,
        movieTitles: [movieTitle],
        releaseDate: movie.releaseDate.toISOString()
      })
    })

    it('should fuzzy match the movie title and only return the related ones', async () => {
      const theMatrixMovie = await movieFactory.create({ movieTitles: [movieTitleFactory.build({ title: 'The Matrix', language: 'en' })] })
      await movieFactory.create({ movieTitles: [movieTitleFactory.build({ title: 'Not at all related', language: 'en' })] })

      const response = await request(app.getHttpServer() as App).get('/movies/search?title=matris')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        {
          ...theMatrixMovie,
          releaseDate: theMatrixMovie.releaseDate.toISOString()
        }
      ])
    })

    it.todo('should fuzzy match better'
    // , async () => {
      // const theMatrixMovie = await movieFactory.create({ movieTitles: [movieTitleFactory.build({ title: 'The Matrix', language: 'en' })] })
      // const theMatrixReloadedMovie = await movieFactory.create({ movieTitles: [movieTitleFactory.build({ title: 'The Matrix Reloaded', language: 'en' })] })
      // await movieFactory.create({ movieTitles: [movieTitleFactory.build({ title: 'Not at all related', language: 'en' })] })

      // const response = await request(app.getHttpServer()).get('/movies/search?title=matris')

      // expect(response.status).toBe(200)
      // expect(response.body).toEqual([
      //   theMatrixMovie,
      //   theMatrixReloadedMovie
      // ])}
    )

    it('should return 200 and an empty parameter list if the movie is not found', async () => {
      const response = await request(app.getHttpServer() as App).get('/movies/search?title=not-a-movie')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
