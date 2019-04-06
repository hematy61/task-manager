const express = require('express')
require('./db/mongoose')
const User = require('./models/users')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/', (req, res) => {
  const user = new User(req.body)

  user.save()
  .then( user => res.send(user) )
  .catch( error => console.log(error) )
})


app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})