import { Movie, MovieTitle } from '@prisma/client'
import { Factory } from 'fishery'
import { faker, allLocales } from '@faker-js/faker'

import prisma from '../client'

import { movieTitleFactory } from './movieTitle'

export interface IMovieFactory extends Movie {
  movieTitles: MovieTitle[]
}

class MovieFactory extends Factory<IMovieFactory> {
  withLanguages (languages: string[]) {
    return this.associations({
      movieTitles: languages.map(language => movieTitleFactory.build({ language }))
    })
  }

  withTitle (title: string) {
    return this.associations({
      movieTitles: [movieTitleFactory.build({ title })]
    })
  }
}

export const movieFactory = MovieFactory.define(({ sequence, onCreate, afterCreate }) => {
  onCreate(async (movie) => {
    // Ensure at least 1 MovieTitle is always created
    const movieTitles = !movie.movieTitles ? [] : movie.movieTitles.map(({ id, movieId, ...movieTitle }) => movieTitle)
    if (movieTitles.length === 0) {
      const { id, movieId, ...movieTitle } = movieTitleFactory.build()
      movieTitles.push(movieTitle)
    }

    return await prisma.movie.create({
      data: {
        director: movie.director,
        genre: movie.genre,
        duration: movie.duration,
        subtitles: movie.subtitles,
        releaseDate: movie.releaseDate,

        movieTitles: {
          createMany: {
            data: movieTitles
          }
        }
      },
      include: {
        movieTitles: true
      }
    })
  })

  return {
    id: sequence,
    genre: faker.music.genre(),
    director: faker.person.fullName(),
    duration: faker.number.int({ min: 60, max: 240 }),
    movieTitles: [movieTitleFactory.build()],
    subtitles: [faker.helpers.objectKey(allLocales)],
    releaseDate: faker.date.between({ from: '1980-01-01', to: '2024-01-01' }),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
