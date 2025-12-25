const mongoose = require('mongoose');

const GameProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  position: {
    x: Number,
    y: Number,
    z: Number,
  },
  stamina: {
    type: Number,
    default: 100,
  },
  flashlightOn: {
    type: Boolean,
    default: false,
  },
  wolfDistance: {
    type: Number,
    default: 50,
  },
  reachedCamp: {
    type: Boolean,
    default: false,
  },
  ending: {
    type: String,
    enum: ['safe', 'caught', 'lost'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('GameProgress', GameProgressSchema);