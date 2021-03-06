const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOne,
  userTwo,
  userOneId,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
test('Should get all tasks for user one', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const tasks = response.body

  // Assertion about the length of the task which must be 2
  expect(tasks.length).toEqual(2)
})

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
test('Should not let user two delete user one tasks', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  // Assertion about making sure that first task has been removed as a result of userTwo attempts
  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})