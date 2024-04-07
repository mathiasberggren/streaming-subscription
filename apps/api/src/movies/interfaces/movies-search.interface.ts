export interface MoviesSearch {
  findByTitle: (title: string) => Promise<any>
}
