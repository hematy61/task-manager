const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()


// *************  SIGN UP: CREATE A NEW USER  ****************************************************
// With this route we are using async await to asynchronously create new users and save them in
// users database. Uppercase "User" is the mongoose model for user authentication. 
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (error) {
      res.status(400).send(error)
  }
})

// *************  LOG IN   ***********************************************************************
router.post('/users/login', async (req, res) => {
  
  try {
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()
      res.send({ user, token })
  } catch (error) {
      res.status(400).send()
  }
})

// *************  LOG OUT   **********************************************************************
router.post('/users/logout', auth, async (req, res) => {
try {
    req.user.tokens = req.user.tokens.filter( token => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
} catch (error) {
    res.status(500).send(error)
}
})

// *************  FIND Auth Logged In User Profile  **********************************************
// With this route we are using async await to asynchronously retrieve all users and send them back
// to front end. Uppercase "User" is the mongoose model for user authentication. 
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// *************  FIND A USER BY ID  *************************************************************
// With this route we are using async await to asynchronously find one user by its id and send it 
// back to front end. Uppercase "User" is the mongoose model for user authentication. 
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
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
      // as .findByIdAndUpdate is not gonna middleware, changed below line with existing code
      // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      const user = await User.findById(req.params.id)
      requestedUserUpdates.forEach((update) => user[update] = req.body[update])
      await user.save()
      // if findById doesn't find any record then is gonna return false. With this ternary 
      // operator we can check user variable and if it returns false then turn it to true by ! operator
      // and sent the error to client
      return !user ? res.status(400).send() : res.send(['Modified user: ', user])
  } catch (error) {
      res.status(500).send(error)
  }
})

// *************  DELETE A  USER  *****************************************************************
router.delete('/users/:id', async (req, res) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id)
      return !deletedUser ? res.status(404).send('Invalid User!') : res.send(deletedUser)
  } catch (error) {
      res.status(404).send(error)
  }
})


module.exports = router