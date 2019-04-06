const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})


app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})