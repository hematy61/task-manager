const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach( async () => {
  await User.deleteMany()
})

test('should sign up a new user', async () => {
  await request(app).post('/users').send({
    name: 'Mo',
    email: 'moTest1@test.com',
    password: 'SomePass12!!',
    age: 34
  }).expect(307)
})