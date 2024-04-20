import { MovieTitle, PrismaClient } from '@prisma/client'
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

class MovieTitleFactory extends Factory<MovieTitle> {

}

export const movieTitleFactory = MovieTitleFactory.define(({ sequence, onCreate, params }) => {
  if (params.movieId === undefined) {
    throw new Error('movieId must be provided')
  }

  onCreate(async (movieTitle) => {
    const prisma = new PrismaClient()

    return await prisma.movieTitle.create({
      data: movieTitle

    })
  })

  const language = (params?.language !== undefined && params.language in wordLists)
    ? params.language as keyof typeof wordLists
    : faker.helpers.arrayElement(Object.keys(wordLists)) as keyof typeof wordLists

  const words = wordLists[language]

  const adjective = faker.helpers.arrayElement(words.adjectives)
  const noun = faker.helpers.arrayElement(words.nouns)
  const verb = faker.helpers.arrayElement(words.verbs)
  const title = `${adjective} ${noun} ${verb}`

  return {
    movieTitleId: sequence,
    movieId: params.movieId,
    title,
    language
  }
})

const wordLists = {
  en: {
    adjectives: ['Quick', 'Bright', 'Dark'],
    nouns: ['Fox', 'Star', 'Shadow'],
    verbs: ['Jumps', 'Falls', 'Rises']
  },
  es: {
    adjectives: ['Rápido', 'Brillante', 'Oscuro'],
    nouns: ['Zorro', 'Estrella', 'Sombra'],
    verbs: ['Salta', 'Cae', 'Asciende']
  },
  pt: {
    adjectives: ['Rápido', 'Brilhante', 'Escuro'],
    nouns: ['Raposa', 'Estrela', 'Sombra'],
    verbs: ['Salta', 'Cai', 'Sobe']
  },
  se: {
    adjectives: ['Snabb', 'Ljus', 'Mörk'],
    nouns: ['Räv', 'Stjärna', 'Skugga'],
    verbs: ['Hoppa', 'Fall', 'Stiger']
  },
  fr: {
    adjectives: ['Rapide', 'Brillant', 'Obscur'],
    nouns: ['Renard', 'Étoile', 'Ombre'],
    verbs: ['Saute', 'Tombe', 'Monte']
  },
  de: {
    adjectives: ['Schnell', 'Hell', 'Dunkel'],
    nouns: ['Fuchs', 'Stern', 'Schatten'],
    verbs: ['Springt', 'Fällt', 'Steigt']
  },
  it: {
    adjectives: ['Veloce', 'Luminoso', 'Oscuro'],
    nouns: ['Volpe', 'Stella', 'Ombra'],
    verbs: ['Salta', 'Cade', 'Sale']
  }
} as const
