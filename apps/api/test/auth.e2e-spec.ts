import { Server } from 'net'

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import nock from 'nock'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '../src/app/app.module'

describe('AuthController (e2e)', () => {
  let app: INestApplication<Server>

  // Mock Google OAuth API
  nock('https://www.googleapis.com')
    .post('/oauth2/v4/token')
    .reply(200, {
      access_token: 'your_access_token' // Access token for API access
    })

  nock('https://www.googleapis.com')
    .get('/oauth2/v3/userinfo')
    .query({ access_token: 'your_access_token' })
    .reply(200, {
      sub: '1234567890',
      name: 'John Doe',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'image-url',
      email: 'john.doe@example.com'
    })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/auth/google (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/auth/google')

    expect(response.status).toBe(302)
    expect(response.headers.location).toContain('accounts.google.com')
  })

  it('/auth/google/callback (GET)', async () => {
    const jwt = app.get(JwtService)

    const response = await request(app.getHttpServer()).get('/auth/google/callback?code=your_code')
    const cookies = response.headers['set-cookie'] as unknown as string[]

    // Parse access token from cookie
    const tokenCookie = cookies.find(cookie => cookie.startsWith('access_token='))
    const accessToken = tokenCookie?.split(';')[0].split('=')[1]

    if (!accessToken) {
      throw new Error('Access token not found')
    }

    expect(jwt.decode(accessToken).email).toBe('john.doe@example.com')
  })
})
