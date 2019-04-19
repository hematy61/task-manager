const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

// *************  CREATE A NEW TASK  *************************************************************
// With this route we are using async await to asynchronously create a new task and save it to 
// database. Uppercase "Task" is the mongoose model for user authentication.
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
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
router.get('/tasks', auth, async (req, res) => {
  console.log(req.query.completed);
  
  
  try {
      const tasks = await Task.find({owner: req.user._id})
      .then(tasks => {
        if (req.query.completed) {
          return tasks.filter( task => task.completed.toString() === req.query.completed )
        }
        return tasks
      })
      return res.send(tasks)
  } catch (error) {
      res.status(500).send(error)
  }
})

// *************  FIND A TASK BY ID  *************************************************************
// With this route we are using async await to asynchronously find a task by its id and send it 
// back to front end. Uppercase "Task" is the mongoose model for user authentication.
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
      // query over Tasks and find the task by its id if its owner is the right owner. 
      const foundedTask = await Task.findOne({ _id, owner: req.user._id })
      return !foundedTask ? res.status(404).send(`the ${_id} was not found.`) : res.send(foundedTask)
  } catch (error) {
      res.status(500).send()
  }
})

// *************  UPDATE A TASK BY ID  ***********************************************************
// description is the same as UPDATE A USER BY ID
router.patch('/tasks/:id',auth,  async (req, res) => {
  const requestedTaskUpdate = Object.keys(req.body)
  const allowedTaskUpdates = ['title', 'description', 'completed']
  const isValidUpdateOperation = requestedTaskUpdate.every(task => allowedTaskUpdates.includes(task))

  if (!isValidUpdateOperation) {
    return res.status(400).send('Invalid update request')
  }

  try {
      // change the below line of code as findByIdAndUpdate is not fire middleware
      // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      // const task = await Task.findById(req.params.id)
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
      if (!task) {
        return res.status(400).send()
      }
      requestedTaskUpdate.forEach(update => task[update] = req.body[update])
      await task.save()
      res.send(task)
  } catch (error) {
      res.status(500).send(error)
  }

})

// *************  DELETE A TASK BY ID  ***********************************************************
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
      const deletedTask = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
      return !deletedTask ? res.status(404).send('Invalid User!') : res.send(deletedTask)
  } catch (error) {
      res.status(500).send(error)
  }
})


module.exports = router