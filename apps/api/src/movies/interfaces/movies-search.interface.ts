export interface MoviesSearch {
  // TODO: Implement Movie response interface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByTitle: (title: string) => Promise<any>
}
