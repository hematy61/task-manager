const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
  const user = new User(req.body)
  user.save()
  .then( user => res.send(user) )
  .catch( error => res.status(400).send(error) )
})


app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save()
  .then( result => res.send(result) )
  .catch( error => res.send(error) )
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})