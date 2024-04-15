import truncateDb from './truncate-db'

beforeEach(async () => {
  await truncateDb()
})
