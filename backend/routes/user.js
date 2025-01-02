const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const env = require('dotenv').config();
const router = express.Router();
const { isLoggedin  } = require('../middlewares/auth')

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if(!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const isUserExist = await User.findOne({ email });

    if(isUserExist) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await new User({
        name,
        email,
        password: hashedPassword
      }).save();
      const token = jwt.sign({ email, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

      return res.status(201).json({message: 'User created successfully', token, id: newUser._id, username: newUser.name });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async(req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: 'Email Invalid' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch) {
      return res.status(400).json({ message: 'Password Invalid' });
    }

    const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    return res.status(200).json({ message: 'Login successful', token, id: user._id, username: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update', isLoggedin, async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password if both oldPassword and newPassword are provided
    if (oldPassword && newPassword) {
      // Ensure the old password matches the stored password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect old password' });
      } 

      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password in the database
      user.password = hashedPassword;
    }

    if(!oldPassword || !newPassword){
      return res.status(400).json({ message: "Both the Password fields are required"})
    }

    // Update other details (name, email) if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;