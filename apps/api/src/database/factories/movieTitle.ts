import { MovieTitle, PrismaClient } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

import { supportedLanguageLocaleCodes, Language } from '../../constants'

import { generateMovieTitles } from './utils/generateMovieTitles'

class MovieTitleFactory extends Factory<MovieTitle> {

}

export const movieTitleFactory = MovieTitleFactory.define(({ sequence, onCreate, params }) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!params.movieId) {
    throw new Error('[movieTitleFactory] movieId must be provided')
  }
  onCreate(async (movieTitle) => {
    const prisma = new PrismaClient()

    return await prisma.movieTitle.create({
      data: movieTitle

    })
  })

  const language = (params?.language !== undefined && params.language in supportedLanguageLocaleCodes)
    ? params.language as Language
    : faker.helpers.arrayElement(supportedLanguageLocaleCodes)

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const title = params.title ?? generateMovieTitles([language])[language]

  return {
    movieTitleId: sequence,
    movieId: params.movieId,
    title,
    language
  }
})
