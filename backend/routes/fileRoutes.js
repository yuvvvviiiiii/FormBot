const express = require('express');
const fileRouter = express.Router();
const File = require('../models/file');
const Folder = require('../models/folders');
const FileData = require('../models/fileData');
const { isLoggedin } = require('../middlewares/auth');

fileRouter.post('/file/:id', isLoggedin,  async (req, res) => {
  try {
    const { fileName } = req.body;
    const folder = await Folder.findById(req.params.id);

    if(!folder) {
      return res.status(400).json({ message: 'Folder not found' });
    }

    if(!fileName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const file = await File.create({ fileName });
    if(!file){
      return res.status(400).json({ message: 'File not created' });
    } else {
      folder.files.push(file);
      await folder.save();
      return res.status(201).json({ message: 'File created successfully', folder });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

fileRouter.post('/withoutFolder', isLoggedin, async (req, res) => {
  
  try {
    const { fileName } = req.body;

    // Validate fileName
    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    // Create the file
    const file = await File.create({
      fileName,
      userId: req.user.id,
      withoutFolder: true,
    });

    await file.save()

    if (!file) {
      return res.status(400).json({ message: 'File not created' });
    }

    return res.status(201).json({ message: 'File created successfully', file });
  } catch (error) {
    console.log('Error creating file:', error);
    return res.status(500).json({ message: 'Unable to create a file', error });
  }
});



fileRouter.get('/file', isLoggedin, async (req, res) => {
  try {
    const file = await File.find({ userId: req.user.id });
    if(!file){
      return res.status(400).json({ message: 'No file found' });
    } else {
      return res.status(200).json({ message: 'file found', file });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

fileRouter.get('/file/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById( id );
    if(!file){
      return res.status(400).json({ message: 'No file found' });
    } else {
      return res.status(200).json({ message: 'file found', file });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

fileRouter.delete('/file/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findByIdAndDelete(id);
    if(!file){
      return res.status(400).json({ message: 'file not found' });
    } else {
      return res.status(200).json({ message: 'file deleted successfully', file });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})


fileRouter.post('/filedata/:id', isLoggedin, async (req, res) => {
  try {
    const { data } = req.body;
    const { id } = req.params;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Invalid data format or empty array" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileDataIds = await Promise.all(data.map(async (dataItem) => {
      const fileData = { fileType: dataItem.fileType };
      if (dataItem.data) fileData.data = dataItem.data;
      if (dataItem.type) fileData.type = dataItem.type;

      const dataFile = await FileData.create(fileData);
      return dataFile._id;
    }));

    file.fileData = fileDataIds;
    await file.save();

    return res.status(200).json({ message: "fileData created", file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to create a file', error });
  }
});

fileRouter.get('/filedata/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id).populate('fileData');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    file.views = (file.views || 0) + 1;
    await file.save();

    return res.status(200).json({ message: 'File data retrieved successfully', file: file.fileData });
  } catch (error) {
    console.error('Error fetching file data:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});





module.exports = fileRouter;