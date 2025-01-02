const express = require('express');
const folderRouter = express.Router();
const Folder = require('../models/folders');
const { isLoggedin } = require('../middlewares/auth');

folderRouter.post('/folder', isLoggedin, async (req, res) => {
  try {
    const { folderName } = req.body;
    if(!folderName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const folder = await Folder.create({ folderName, userId: req.user.id });
    if(!folder){
      return res.status(400).json({ message: 'Folder not created' });
    } else {
      return res.status(201).json({ message: 'Folder created successfully', folder });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

folderRouter.get('/folder', isLoggedin, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id });
    if(!folders){
      return res.status(400).json({ message: 'No folders found' });
    } else {
      return res.status(200).json({ message: 'Folders found', folders });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

folderRouter.delete('/folder/:id',isLoggedin, async (req, res) => {
  try {
    const folder = await Folder.findOne({userId: req.user.id, _id: req.params.id });
    if(!folder){
      return res.status(400).json({ message: 'Folder not found' });
    } else {
      await Folder.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Folder deleted successfully', folder });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

module.exports = folderRouter;