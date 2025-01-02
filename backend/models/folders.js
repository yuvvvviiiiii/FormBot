const mongoose = require('mongoose');
const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
});

module.exports = mongoose.model('Folder', folderSchema);
