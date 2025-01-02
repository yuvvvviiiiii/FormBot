const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
  text: { type: String, default: null },
  email: { type: String, default: null },
  number: { type: Number, default: null },
  phone: { type: String, default: null },
  rating: { type: Number, default: null },
  date: { type: String, default: null },
  fileId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'File',
  },
}, { timestamps: true });

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

module.exports = FormResponse;