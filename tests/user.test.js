const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
  name: 'Andy',
  email: 'andyTest@test.ca',
  password: 'TestCase1!!',
  age: 20
}

beforeEach( async () => {
  await User.deleteMany()
  await new User(userOne).save()
})

test('should sign up a new user', async () => {
  await request(app).post('/users').send({
    name: 'Mo',
    email: 'moTest1@test.com',
    password: 'SomePass12!!',
    age: 19
  }).expect(307)
})

test('Should login user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  })
  .expect(200)
})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: "notExist@email.ca",
    password: 'notExist'
  })
  .expect(400)
})