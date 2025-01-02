const express = require('express');
const indexRouter = express.Router();
const Folder = require('../models/folders');
const File = require('../models/file');

const { isLoggedin } = require('../middlewares/auth');
const User = require('../models/user');

// indexRouter.post('/folder', async (req, res) => {
//   try {
//     const { folderName } = req.body;
//     if(!folderName) {
//       return res.status(400).json({ message: 'Please provide all required fields' });
//     }
//     const folder = await Folder.create({ folderName });
//     if(!folder){
//       return res.status(400).json({ message: 'Folder not created' });
//     } else {
//       return res.status(201).json({ message: 'Folder created successfully', folder });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error', error});
//   }
// })

indexRouter.get('/data/:id',isLoggedin, async (req, res) => {
  try {
    const data = await Folder.find({ userId: req.params.id }).populate('files');
    const fileWithoutFolder = await File.find({ userId: req.params.id, withoutFolder: true });
    if(!data){
      return res.status(400).json({ message: 'No data found' });
    } else {
      return res.status(200).json({ message: 'data found', data, fileWithoutFolder });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error});
  }
})

indexRouter.post('/shareduser', isLoggedin, async(req,res) => {
  const {email, permission} = req.body;

  if(!['view', 'edit'].includes(permission)){
    return res.status(400).json({ message: 'Invalid permission. Allowed values are "view" or "edit"' });
  }
  try {
    const targetedUser = await User.findOne({ email });

    if(!targetedUser){
      return res.status(400).json({ message: "No user related to email found" });
    }

    const sharedIndex = targetedUser.shared.findIndex(
      (entry) => entry.userId.toString() === req.user.id.toString()
    );

    if(sharedIndex !== -1){
      targetedUser.shared[sharedIndex].permission = permission
    } else {
      targetedUser.shared.push({ userId: req.user.id })
    }

    await targetedUser.save();
    return res.status(200).json({
      message: `Successfully shared with ${email} with ${permission} permission.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
})

indexRouter.get('/sharedusers', isLoggedin, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }


    const sharedUsers = await Promise.all(
      currentUser.shared.map(async ({ userId, permission }) => {
        const user = await User.findById(userId);
        if (!user) {
          console.log(`User not found for shared userId: ${userId}`);
          return null; 
        }
        return {
          name: user.name,
          email: user.email,
          userId: user._id,
          permission
        };
      })
    );

    const filteredSharedUsers = sharedUsers.filter(user => user !== null);

    res.status(200).json({
      message: 'Shared users retrieved successfully',
      sharedUsers: filteredSharedUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});





module.exports = indexRouter;