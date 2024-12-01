const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  category: { type: String },
  date: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { 
    type: String,
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);