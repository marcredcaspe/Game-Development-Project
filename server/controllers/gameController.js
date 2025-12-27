const Score = require('../models/Score');
const User = require('../models/user'); // Ensure filename matches exactly (user.js or User.js)
const jwt = require('jsonwebtoken');

exports.saveScore = async (req, res) => {
  const token = req.header('x-auth-token');
  const { timeInMinutes } = req.body;

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const newScore = new Score({
      username: user.username,
      timeInMinutes: timeInMinutes
    });

    await newScore.save();
    res.json({ msg: 'Score saved!', score: newScore });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};