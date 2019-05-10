const request = require('supertest')
const app = require('../src/app')
const {
  userOne,
  userOneId,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a new task', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: 'Receiving a new test Task title'
    })
    .expect(201)
})