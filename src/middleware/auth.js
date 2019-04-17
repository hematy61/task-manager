const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
      // getting the token received part of the "header" 's "Authorization"
      // value and then take the 'Bearer ' out of it's value
      const token = req.header('Authorization').replace('Bearer ', '')
      // verifying the token with our secret key that we used once we have 
      // created the token part of the "generateAuthToken" instance method
      // under the /models/user.js
      const decoded = jwt.verify(token, 'theSecretOfSecrets')
      // searching for a user by its id after the token is verified and its 
      // token as we are going to delete the token after user logged out and 
      // we don't want them to log in with expired token.
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

      if (!user) {
        throw new Error()
      }

      // as we have queried over the user data, that's better to send the
      // user to route handler and avoid another data query.
      // to do so, we define another variable for 'req' and assign the user 
      // to that like so:
      req.user = user
      next()
  } catch (error) {
      res.status(401).send('Error: User Not Authenticated')
  }
}

module.exports = auth