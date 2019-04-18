const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  // if you add a property here make sure that you're going to update 'allowedTaskUpdates' array on
  // index.js file within 'UPDATE A TASK BY ID' route
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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }

}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
