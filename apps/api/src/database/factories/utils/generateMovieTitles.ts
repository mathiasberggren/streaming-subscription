import { Language } from 'apps/api/src/constants'

type Words = 'adjectives' | 'nouns' | 'verbs'

// Enforce the wordlists to have the same keys as the supported locale codes
const wordLists: Record<Language, Record<Words, string[]>> = {
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

export function generateMovieTitles (languages?: Language[]): Record<Language, string> {
  const adjectiveIndex = Math.floor(Math.random() * wordLists.en.adjectives.length)
  const nounIndex = Math.floor(Math.random() * wordLists.en.nouns.length)
  const verbIndex = Math.floor(Math.random() * wordLists.en.verbs.length)

  if (languages === null || languages === undefined || languages.length === 0) {
    const keys = Object.keys(wordLists) as Array<keyof typeof wordLists>

    // Pick languages with a 50% chance that the title exists on that language
    languages = keys.filter(_ => Math.random() > 0.5)
  }

  const titles = languages.reduce((acc, language) => {
    const words = wordLists[language]
    const adjective = words.adjectives[adjectiveIndex]
    const noun = words.nouns[nounIndex]
    const verb = words.verbs[verbIndex]

    return { ...acc, [language]: `${adjective} ${noun} ${verb}` }
  // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
  }, {} as Record<Language, string>)

  return titles
}
