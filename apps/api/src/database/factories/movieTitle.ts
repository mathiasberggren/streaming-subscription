import { Movie, MovieTitle } from '@prisma/client'
import { Factory } from 'fishery'
import { allFakers, faker } from '@faker-js/faker'

import prisma from '../client'
import { supportedLanguages } from '../../constants'

import { movieFactory } from './movie'

interface IMovieTitleFactory extends MovieTitle {
  movie?: Movie
}
class MovieTitleFactory extends Factory<IMovieTitleFactory> {}

export const movieTitleFactory = MovieTitleFactory.define(({ sequence, onCreate, params }) => {
  onCreate(async (movieTitle) => {
    // Create a movie if not provided
    if (!movieTitle.movie) {
      movieTitle.movie = await movieFactory.create(movieTitle.movie)
    }

    return await prisma.movieTitle.create({
      data: {
        title: movieTitle.title,
        language: movieTitle.language,
        image: movieTitle.image,
        movie: {
          connect: {
            id: movieTitle.movie.id
          }
        }
      },
      include: {
        movie: true
      }
    })
  })

  const language = supportedLanguages.find(supportedLanguage => supportedLanguage === params.language) ?? 'en'
  // @ts-expect-error - TS doesn't know that allFakers[language] is a valid faker instance
  const title = params.title ?? allFakers[language].word.words({ count: { min: 3, max: 10 } })

  return {
    id: sequence,
    movieId: sequence,
    title,
    language,
    image: faker.image.urlLoremFlickr({ category: 'movie' }),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})
