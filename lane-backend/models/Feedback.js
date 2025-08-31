const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Bug', 'Feature', 'Improvement'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
