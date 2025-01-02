const mongoosee = require('mongoose');
const fileDataSchema = new mongoosee.Schema({
  fileType: {
    type: String,
    enum: ['bubbles','inputs']
  },
  data: {
    type: String,
  },
  type: {
    type: String,
    enum: ['text', 'number', 'phone', 'email','image', 'date', 'rating', 'buttons']
  }
});

module.exports = mongoosee.model('FileData', fileDataSchema);