const request = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Andy',
  email: 'andytest@test.ca',
  password: 'TestCase1!!',
  age: 20,
  tokens: [{
    token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
  }]
}

beforeAll( async () => {
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
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  })
  .expect(200)
  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Andy',
      email: 'andytest@test.ca',
      age: 20
    },
    token: user.tokens[0].token
  })

  // Assertion about user password not being stored as a plain text
  expect(user.password).not.toBe('SomePass12!!')

  // Assertion about user token being saved to database
  expect(user.token).toBe(userOne.token)
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

test('Should delete user account', async () => {
  const response = await request(app)
          .delete('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)

  // Assertion about validating user successfully was removed
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete user for unauthenticated user', async () => {
  await request(app)
          .delete('/users/me')
          .send()
          .expect(401)
})