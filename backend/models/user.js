const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  local: {
    type: String,
    required: true,
    enum: ['Matriz', 'Filial 1', 'Filial 2', 'Filial 3']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 