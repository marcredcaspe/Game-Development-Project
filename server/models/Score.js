const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  timeInMinutes: { type: Number, required: true }, // Storing minutes as requested
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', ScoreSchema);