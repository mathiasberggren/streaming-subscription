export interface IMDBSearchResponse {
  status: boolean
  message: string
  timestamp: number
  data: IMDBMovie[]
}

export interface IMDBMovie {
  id: string
  qid: string
  title: string
  year: number
  stars: string
  q: string
  image: string
}
