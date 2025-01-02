const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true,
    unique: true,
  },
  shared: [
    {
      userId: {type: mongoose.Schema.Types.ObjectId,
      ref: 'User'},
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view'
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);