export interface MovieSearch {
  byTitle: (title: string) => Promise<any>
}
