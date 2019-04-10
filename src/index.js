const express = require('express')
const { ObjectID } = require('mongodb')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
      await user.save()
      res.status(201).send(user)
  } catch (error) {
      res.status(400).send(error)
  }
})

app.get('/users', async (req, res) => {
  try {
      const users = await User.find({})
      res.send(users)
  } catch (error) {
      res.status(500).send(error)
  }
})

app.get('/users/:id', (req,res) => {
  const _id = req.params.id
  User.findById(_id)
  .then( user => !user ? res.status(404).send() : res.send(user) )
  .catch( error => res.status(500).send() )
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)
  task.save()
  .then( result => res.status(201).send(result) )
  .catch( error => res.status(400).send(error) )
})

app.get('/tasks', (req, res) => {
  Task.find({})
  .then( (tasks) => res.send(tasks))
  .catch( (error) => res.status(400).send(error) )
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  Task.findById(_id)
  .then( (task) => !task ? res.status(404).send() : res.send(task) )
  .catch( error => res.status(500).send() )
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})