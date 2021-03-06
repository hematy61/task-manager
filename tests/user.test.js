const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
  userOne,
  userOneId,
  setupDatabase
} = require('./fixtures/db')


beforeEach(setupDatabase)

test('should sign up a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Mo',
      email: 'moTest1@test.com',
      password: 'SomePass12!!',
      age: 19
    })
    .expect(307)
})

test('Should login user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
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
  await request(app)
    .post('/users/login')
    .send({
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

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Gary',
      email: 'garytest@test.ca',
      password: 'TestCase2!!',
      age: 40
    })
    .expect(200)
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      value: 20
    })
    .expect(400)
})