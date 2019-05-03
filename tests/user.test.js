const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Andy',
  email: 'andyTest@test.ca',
  password: 'TestCase1!!',
  age: 20,
  tokens: [{
    token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
  }]
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

test('Should get user profile', async () => {
  await request(app)
          .get('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
          .get('/users/me')
          .send()
          .expect(401)
})