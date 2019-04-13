const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
  // if you add a property here make sure that you're going to update 'allowedUserUpdates' array on
  // index.js file within 'UPDATE A USER BY ID' route
  name: {
    type: String,
    trim: true,
    required: [true, 'User Name required'],
  },
  email: {
    type: String,
    required: [true, 'User email required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error('Enter a valid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [7, 'Minimum 7 characters required'],
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('password cannot contain the keyword "password"')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 18) {
        throw new Error('You must be over 18 to use this service.')
      }
    }
  }
})

// checking log in email and password received from /users/login path with the users database
userSchema.statics.findByCredentials = async (email, password) => {

  const user = await User.findOne({ email })  
  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// hash the password before saving to data
userSchema.pre('save', async function (next) {
  // In document middleware functions, "this" refers to the document.
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User