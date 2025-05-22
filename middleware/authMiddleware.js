const { verifyToken } = require('../helpers/jwtHelper');
const userRepository = require('../repositories/userRepository');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }

    const userResult = await userRepository.findUserById(decoded.userId);
    if (!userResult.success || !userResult.data) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    req.user = userResult.data;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.',
      error: error.message
    });
  }
};

module.exports = authMiddleware;