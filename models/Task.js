// models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['not completed', 'completed'], default: 'not completed' }, // Добавлено поле статуса
  dueDate: { type: Date },
});

module.exports = mongoose.model('Task', taskSchema);
