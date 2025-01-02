const express = require('express');
const router = express.Router();
const FormResponse = require('../models/formResponse');
const File = require('../models/file');
const { isLoggedin } = require('../middlewares/auth');

router.post('/submit-form/:id', async (req, res) => {
  try {
    const { text, email, number, phone, rating, date } = req.body;
    const { id: fileId } = req.params;
    console.log(fileId);
    const file = await File.findById(fileId);
    if(!file){
      return res.json(400).json({ message: 'File Not Found' });
    }

    if (!text && !email && !number && !phone && !rating && !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one field must be provided.' 
      });
    }
      file.startCounter = (file.startCounter || 0) + 1;

    const newResponse = new FormResponse({
      ...(text && { text }),
      ...(email && { email }),
      ...(number && { number }),
      ...(phone && { phone }),
      ...(rating && { rating }),
      ...(date && { date }),
      fileId
    });

    await newResponse.save();

    const allResponses = await FormResponse.find({ fileId });
    const filledFields = {
      text: false,
      email: false,
      number: false,
      phone: false,
      rating: false,
      date: false,
    };

    allResponses.forEach((response) => {
      if (response.text) filledFields.text = true;
      if (response.email) filledFields.email = true;
      if (response.number) filledFields.number = true;
      if (response.phone) filledFields.phone = true;
      if (response.rating) filledFields.rating = true;
      if (response.date) filledFields.date = true;
    });

    if (Object.values(filledFields).every((field) => field)) {
      file.submittedResponses = (file.submittedResponses || 0) + 1;
    }

    await file.save();
    res.status(201).json({ success: true, message: 'Response saved successfully!' });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving response',
      error: error.message
    });
  }
});

router.get('/form-responses/:id', isLoggedin, async (req, res) => {
  try {
    const { id: fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const responses = await FormResponse.find({ fileId });

    if (responses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No responses found for this file',
      });
    }

    res.status(200).json({ success: true, message: 'files fetched succesfully', responses, views: file.views, submitted: file.submittedResponses, started: file.startCounter });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching responses',
      error: error.message,
    });
  }
});


module.exports = router;
