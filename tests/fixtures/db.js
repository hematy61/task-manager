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

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
}

module.exports = {
  userOne,
  userOneId,
  setupDatabase
}