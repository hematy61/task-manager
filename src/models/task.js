const mongoose = require('mongoose')


const Task = mongoose.model('Task', {
  title: {
    type: String,
    required: [true, 'Title required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }

})

module.exports = Task
