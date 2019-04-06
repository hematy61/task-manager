const mongoose = require('mongoose')
const { isEmail } = require('validator')



const User = mongoose.model('User',{
  name: {
    type: String,
    trim: true,
    required: [true, 'User Name required'],
  },
  email: {
    type: String,
    required: [true, 'User email required'],
    trim: true,
    lowercase: true,
    validate(value){
      if ( !isEmail(value) ) {
        throw new Error('Enter a valid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [7, 'Minimum 7 characters required'],
    trim: true,
    validate(value){
      if (value.toLowerCase().includes('password')) {
        throw new Error('password cannot contain the keyword "password"')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value){
      if ( value < 18 ) {
        throw new Error('You must be over 18 to use this service.')
      }
    }
  }
})

module.exports.User