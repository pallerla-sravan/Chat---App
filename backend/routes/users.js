const express = require('express');
const router = express.Router();
const User = require('../database/User'); // Adjust the path if necessary

router.get('/', async (req, res) => {
    try {
      const users = await User.find({}, 'username');
      res.status(200).json({users});
    } catch (err) {
      console.error('Error fetching users:', err);  // Add this line for error logging
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });
  

module.exports = router;
