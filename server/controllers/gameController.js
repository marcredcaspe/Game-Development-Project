const ModelPart = require('../models/modelPart');
const Quiz = require('../models/quiz');
const Progress = require('../models/progress');
const GameProgress = require('../models/gameProgress');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getModelConfig = async (req, res) => {
  try {
    const modelParts = await ModelPart.find();
    res.json(modelParts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuizzesByModelPart = async (req, res) => {
  const { modelPartId } = req.params;

  try {
    const quizzes = await Quiz.find({ modelPartId });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.submitProgress = async (req, res) => {
  const token = req.header('x-auth-token');
  const { quizId, answers } = req.body;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.correctAnswer) {
        score += 1;
      }
    });

    const progress = new Progress({
      userId,
      quizId,
      score,
    });

    await progress.save();

    // Update user's progress
    await User.findByIdAndUpdate(userId, { progress: progress._id });

    res.json({ score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.saveGameProgress = async (req, res) => {
  const token = req.header('x-auth-token');
  const { position, stamina, flashlightOn, wolfDistance, reachedCamp, ending } = req.body;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    let gameProgress = await GameProgress.findOne({ userId });

    if (gameProgress) {
      gameProgress.position = position;
      gameProgress.stamina = stamina;
      gameProgress.flashlightOn = flashlightOn;
      gameProgress.wolfDistance = wolfDistance;
      gameProgress.reachedCamp = reachedCamp;
      gameProgress.ending = ending;
    } else {
      gameProgress = new GameProgress({
        userId,
        position,
        stamina,
        flashlightOn,
        wolfDistance,
        reachedCamp,
        ending,
      });
    }

    await gameProgress.save();
    res.json({ msg: 'Game progress saved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getGameProgress = async (req, res) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const gameProgress = await GameProgress.findOne({ userId });
    if (!gameProgress) {
      return res.status(404).json({ msg: 'No game progress found' });
    }

    res.json(gameProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
