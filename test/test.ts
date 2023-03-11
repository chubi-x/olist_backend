import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import app from '../app'
import { MongoClient, Db } from 'mongodb'
let mongo: MongoMemoryServer
let db: Db
let client: MongoClient
// create a new in-memory database
beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  client = await MongoClient.connect(mongoUri, {})
  db = client.db('techkraft')
})
afterAll(async () => {
  if (mongo !== null) {
    await mongo.stop()
  }
  await client.close()
})

describe('GET /order_items', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/order_items').auth('d2e753bb80b7d4faa77483ed00edc8ca', '45810', { type: 'basic' })
    expect(res.status).toBe(200)
  })
})

describe('DELETE /order_items/:id', () => {
  it('should return 204 No Content', async () => {
    const res = await request(app).delete('/order_items/1').auth('d2e753bb80b7d4faa77483ed00edc8ca', '45810', { type: 'basic' })
    expect(res.status).toBe(204)
  })
})
describe('PUT /account', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).put('/account').send({ state: 'SP', city: 'mogi guacu' })
      .auth('d2e753bb80b7d4faa77483ed00edc8ca', '45810', { type: 'basic' })

    expect(res.status).toBe(200)
  })
})
