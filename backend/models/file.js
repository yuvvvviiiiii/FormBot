const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FileData'
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  withoutFolder: {
    type : Boolean,
    default: false,
  }, 
  views: {
    type: Number,
    default: 0
  },
  submittedResponses: { type: Number, default: 0 },
  startCounter: { type: Number, default: 0 },
});

module.exports = mongoose.model('File', fileSchema);