const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
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

  const task = await Task.findById(response.body[1]._id)

  // Assertion about task database that shouldn't be null after we create the test task
  expect(task).not.toBeNull()

  // Assertion about default task completed field that must be false when user is not providing a value
  expect(task.completed).toEqual(false)
})