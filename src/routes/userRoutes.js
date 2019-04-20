const express = require('express')
const multer = require('multer')
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
      // 307 guarantees that the method and the body will not be changed when the redirected request is made
      res.status(201).redirect(307, '/users/login')
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

// *************  LOG OUT One Device  ************************************************************
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

// *************  LOG OUT All Devices  ***********************************************************
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
      req.user.tokens = []
      await req.user.save()
      res.send('Logged out of all accounts has successfully done.')
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

// *************  UPDATE A LOGGED IN USER  ***********************************************************
// With this route we are using async await to asynchronously find one user by its id and update the 
// user's information. Uppercase "User" is the mongoose model for user authentication. 
router.patch('/users/me', auth, async (req, res) => {
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
      // as .findByIdAndUpdate is not gonna fire middleware, changed below line with existing forEach code
      // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      requestedUserUpdates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      res.send(['Modified user: ', req.user])
  } catch (error) {
      res.status(500).send(error)
  }
})

// *************  DELETE USER PROFILE  ***********************************************************
router.delete('/users/me', auth, async (req, res) => {
  try {
      await req.user.remove()
      res.send(req.user)
  } catch (error) {
      res.status(404).send(error)
  }
})

// *************  SAVE USER PROFILE AVATAR  ******************************************************
// setting up multer to save uploaded avatar images
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('file type must be .png or .jpg or jpeg'))
    }
    cb(null, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  // after multer validate the file, as we don't have " dist: " specified for multer, it passes the file
  // to the next function. we access to that through "req.file.buffer" and the we add and save it to user.avatar 
  // database
  req.user.avatar = req.file.buffer
  await req.user.save()
  res.send('file uploaded')
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})



module.exports = router