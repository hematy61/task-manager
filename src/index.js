const express = require('express')
const { ObjectID } = require('mongodb')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

// supporting static files with Express
app.use(express.json())

// *************  CREATE A NEW USER  *************************************************************
// With this route we are using async await to asynchronously create new users and save them in
// users database. Uppercase "User" is the mongoose model for user authentication. 
app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
      await user.save()
      res.status(201).send(user)
  } catch (error) {
      res.status(400).send(error)
  }
})

// *************  FIND ALL USERS  ****************************************************************
// With this route we are using async await to asynchronously retrieve all users and send them back
// to front end. Uppercase "User" is the mongoose model for user authentication. 
app.get('/users', async (req, res) => {
  try {
      const users = await User.find({})
      res.send(users)
  } catch (error) {
      res.status(500).send(error)
  }
})

// *************  FIND A USER BY ID  *************************************************************
// With this route we are using async await to asynchronously find one user by its id and send it 
// back to front end. Uppercase "User" is the mongoose model for user authentication. 
app.get('/users/:id', async (req,res) => {
  try {      
      const user = await User.findById(req.params.id)
      return !user ? res.status(404).send(`The id: ${req.params.id} was not found.`) : res.send(user)
  } catch (error) {
      res.status(500).send(error)
  }
})

// *************  CREATE A NEW TASK  *************************************************************
// With this route we are using async await to asynchronously create a new task and save it to 
// database. Uppercase "Task" is the mongoose model for user authentication.
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
      await task.save()
      res.status(201).send(['saved to data base', task])
  } catch (error) {
      res.status(400).send(error)
  }
})

// *************  FIND ALL TASKS  ****************************************************************
// With this route we are using async await to asynchronously retrieve all existing tasks and send
// them to front end. Uppercase "Task" is the mongoose model for user authentication.
app.get('/tasks', async (req, res) => {
  try {
      const tasks = await Task.find({})
      res.send(tasks)
  } catch (error) {
      res.status(400).send(error)
  }
})

// *************  FIND A TASK BY ID  *************************************************************
// With this route we are using async await to asynchronously find a task by its id and send it 
// back to front end. Uppercase "Task" is the mongoose model for user authentication.
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
      const foundedTask = await Task.findById(_id)
      return !foundedTask ? res.status(404).send(`the ${_id} was not found.`) : res.send(foundedTask)
  } catch (error) {
      res.status(500).send()
  }
})



app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})