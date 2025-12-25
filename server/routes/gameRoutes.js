const express = require('express');
const router = express.Router();
const { getModelConfig, getQuizzesByModelPart, submitProgress, saveGameProgress, getGameProgress } = require('../controllers/gameController');

router.get('/model/config', getModelConfig);
router.get('/quizzes/:modelPartId', getQuizzesByModelPart);
router.post('/progress/submit', submitProgress);
router.post('/game/save', saveGameProgress);
router.get('/game/progress', getGameProgress);

module.exports = router;
