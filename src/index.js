const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const userRouter = require('./routes/userRoutes')


const app = express()
const port = process.env.PORT || 3000

// supporting static files with Express
app.use(express.json())
app.use(userRouter)


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

// *************  DELETE A TASK BY ID  ***********************************************************
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    return !deletedTask ? res.status(404).send('Invalid User!') : res.send(deletedTask)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})