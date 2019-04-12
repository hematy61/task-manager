const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')


const app = express()
const port = process.env.PORT || 3000

// supporting static files with Express
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})