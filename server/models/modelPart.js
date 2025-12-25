const mongoose = require('mongoose');

const ModelPartSchema = new mongoose.Schema({
  partId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  annotations: [{
    type: String,
  }],
  position: {
    x: Number,
    y: Number,
    z: Number,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ModelPart', ModelPartSchema);