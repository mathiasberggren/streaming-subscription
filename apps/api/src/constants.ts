// TODO: Update with real supported languages instead of this list
// TODO: Derive these from the supported languages
export const supportedLanguageLocaleCodes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'se'] as const
export type Language = typeof supportedLanguageLocaleCodes[number]
