const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')


const app = express()

// supporting static files with Express
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app