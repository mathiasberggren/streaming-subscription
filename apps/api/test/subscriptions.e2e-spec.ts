import { Server } from 'net'

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'

import { AppModule } from '../src/app/app.module'
import { userFactory } from '../src/database/factories/user'
import { companyFactory } from '../src/database/factories/company'
import { subscriptionFactory } from '../src/database/factories/subscription'

import truncateDb from './helpers/truncate-db'

describe('SubscriptionsController (e2e)', () => {
  let app: INestApplication<Server>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await truncateDb()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/subscriptions (POST)', async () => {
    const user = await userFactory.create()
    const company = await companyFactory.create()

    const response = await request(app.getHttpServer())
      .post('/subscriptions')
      .send({
        userId: user.id,
        companyId: company.id,
        credentials: {
          username: 'test',
          password: 'test'
        }
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: user.id,
      companyId: company.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })

  it('/subscriptions (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/subscriptions')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('/subscriptions (GET) with data', async () => {
    await subscriptionFactory.create()
    await subscriptionFactory.create()

    const response = await request(app.getHttpServer()).get('/subscriptions')

    expect(response.status).toBe(200)
    expect(response.body.length).toEqual(2)
  })

  it('/subscriptions/:id (GET)', async () => {
    const subscription = await subscriptionFactory.create()

    const response = await request(app.getHttpServer())
      .get(`/subscriptions/${subscription.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: subscription.id,
      userId: subscription.userId,
      companyId: subscription.companyId,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString()
    })
  })

  it('/subscriptions/:id (DELETE)', async () => {
    const subscription = await subscriptionFactory.create()

    const response = await request(app.getHttpServer())
      .delete(`/subscriptions/${subscription.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: subscription.id,
      userId: subscription.userId,
      companyId: subscription.companyId,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString()
    })
  })
})
