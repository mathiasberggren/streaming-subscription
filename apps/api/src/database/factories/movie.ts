import { Movie, MovieTitle, PrismaClient } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

import { supportedLanguageLocaleCodes } from '../../constants'

import { movieTitleFactory } from './movieTitle'
import { generateMovieTitles } from './utils/generateMovieTitles'

interface IMovieFactory extends Movie {
  movieTitles?: MovieTitle[]
}

class MovieFactory extends Factory<IMovieFactory> {}

export const movieFactory = MovieFactory.define(({ sequence, onCreate, params }) => {
  onCreate(async (movie) => {
    const prisma = new PrismaClient()

    const createdMovie = await prisma.movie.create({
      data: {
        id: movie.id,
        director: movie.director,
        genre: movie.genre,
        duration: movie.duration,
        subtitles: movie.subtitles,
        releaseDate: movie.releaseDate
      }
    })

    // I know this looks horrible, but thinking this is okay since it's just a factory.
    const movieTitles = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      params.movieTitles
        ? params.movieTitles.map(async movieTitle => await movieTitleFactory.create(movieTitle))
        : Object.entries(generateMovieTitles()).map(async ([language, title]) => {
          const movieTitleParams = {
            movieId: movie.id,
            language,
            title
          }

          return await movieTitleFactory.create(movieTitleParams)
        })
    )

    return {
      ...createdMovie,
      movieTitles
    }
  })

  return {
    id: sequence,
    genre: faker.music.genre(),
    director: faker.person.fullName(),
    duration: faker.number.int({ min: 60, max: 240 }),
    subtitles: faker.helpers.arrayElements(supportedLanguageLocaleCodes, faker.number.int({ min: 0, max: 4 })),
    releaseDate: faker.date.between({ from: '1980-01-01', to: '2024-01-01' })
  }
})
