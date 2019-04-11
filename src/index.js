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

// *************  UPDATE A USER BY ID  ***********************************************************
// With this route we are using async await to asynchronously find one user by its id and update the 
// user's information. Uppercase "User" is the mongoose model for user authentication. 
app.patch('/users/:id', async (req, res) => {
  // Here, we want to check the requested update. If it's an invalid request like updating a key that 
  // is not exist in user keys then we want to stop the request and send an "invalid update" message to
  // client. 'requestedUserUpdates are the keys of the object that has received from client to update user'
  const requestedUserUpdates = Object.keys(req.body);
  // 'allowedUserUpdates' are the keys that we would like client to be able to update, otherwise stop it.
  const allowedUserUpdates = ['name', 'age', 'email', 'password']
  // With 'isValidUpdateOperation, we want to see 'requestedUserUpdates' keys are valid within the 
  // 'allowedUserUpdates' and if there is then it can be updated. otherwise reject the update.
  const isValidUpdateOperation = requestedUserUpdates.every(update => allowedUserUpdates.includes(update))
  if (!isValidUpdateOperation) {
    return res.status(400).send('Invalid update!')
  }

  try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      })
      // if findByIdAndUpdate doesn't find any record then is gonna return false. With this ternary 
      // operator we can check user variable and if it returns false then turn it to true by ! operator
      // and sent the error to client
      return !user ? res.status(400).send() : res.send(['Modified user: ',user]) 
  } catch (error) {
      res.status(500).send(error)
  }
})

// *************  DELETE A  USER  *****************************************************************
app.delete('/users/:id', async (req, res) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id)
      return !deletedUser ? res.status(404).send('Invalid User!') : res.send(deletedUser)
  } catch (error) {
      res.status(404).send(error)
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
      res.status(500).send(error)
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

// *************  UPDATE A TASK BY ID  ***********************************************************
// description is the same as UPDATE A USER BY ID
app.patch('/tasks/:id', async (req, res) => {
  const requestedTaskUpdate = Object.keys(req.body)
  const allowedTaskUpdates = ['title', 'description', 'completed']
  const isValidUpdateOperation = requestedTaskUpdate.every(task => allowedTaskUpdates.includes(task))

  if (!isValidUpdateOperation) {
    return res.status(400).send('Invalid update request')
  }

  try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      })
      return !task ? res.status(400).send() : res.send(task)
  } catch (error) {
      res.status(500).send(error)
  }

})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})