const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Andy',
  email: 'andytest@test.ca',
  password: 'TestCase1!!',
  age: 20,
  tokens: [{
    token: jwt.sign({
      _id: userOneId
    }, process.env.JWT_SECRET)
  }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Mike',
  email: 'Miketest@test.ca',
  password: 'TestCaseMike!!',
  age: 30,
  tokens: [{
    token: jwt.sign({
      _id: userTwoId
    }, process.env.JWT_SECRET)
  }]
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  title: 'First test Task',
  description: 'This is the first test task has been created.',
  completed: false,
  owner: userOne._id
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: 'Second test Task',
  description: 'This is the second test task has been created.',
  completed: false,
  owner: userOne._id
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  title: 'Three test Task',
  description: 'This is the three test task has been created.',
  completed: false,
  owner: userTwo._id
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  userOne,
  userOneId,
  setupDatabase
}