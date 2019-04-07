const mongoose = require('mongoose')


const Tasks = mongoose.model('Tasks', {
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }

})

module.exports = Tasks
