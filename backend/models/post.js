const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  title: String,
  content: String,
  creator: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  collection: 'posts',
  minimize: false,
  versionKey: false
})

module.exports = Schema
