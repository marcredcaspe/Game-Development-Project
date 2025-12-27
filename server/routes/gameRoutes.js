const express = require('express');
const router = express.Router();
const { saveScore } = require('../controllers/gameController');

router.post('/score', saveScore);

module.exports = router;