import { execSync } from 'child_process'

import dockerCompose from 'docker-compose'

export default async () => {
  console.time('⏱️ Global setup time')
  try {
    console.info('\n🟡 - Starting Docker containers...')
    await dockerCompose.upMany(['test_database'])
    console.info('🟢 - Containers are ready!')

    console.info('🟡 - Waiting for database to be ready...')
    await dockerCompose.exec(
      'test_database',
      ['sh', '-c', 'until pg_isready ; do sleep 1; done']
    )
    console.info('🟢 - Database is ready!')

    execSync('dotenv -e .env.test -- yarn db:deploy', { stdio: 'inherit' })
  } catch (e) {
    console.dir(e)
    throw e
  }
  console.timeEnd('⏱️ Global setup time')
}
