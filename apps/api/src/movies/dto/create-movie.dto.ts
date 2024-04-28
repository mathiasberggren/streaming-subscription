/* eslint-disable @typescript-eslint/no-extraneous-class */
export class CreateMovieDto {
  genre: string
  director: string
  duration: number
  subtitles: string[]
  releaseDate: Date
  movieTitles: CreateMovieTitleDto[]
}

export class CreateMovieTitleDto {
  language: string
  title: string
}
