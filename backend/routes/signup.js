

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../database/User');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email,username, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
