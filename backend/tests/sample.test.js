const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('testing at GET /', () => {
  test('the appropiate message is a json', async () => {
    await api.get('/').expect(200).expect('content-type', /application\/json/)
  })

  test('the message is correct', async () => {
    const response = await api.get('/')
    expect(response.body.status).toContain("OK")
    expect(response.body.response).toContain("Welcome to exam cohort app!")
  })
})