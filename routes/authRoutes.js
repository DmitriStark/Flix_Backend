const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyToken);
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      user: req.user
    }
  });
});

module.exports = router;