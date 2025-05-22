const userRepository = require('../repositories/userRepository');
const { generateToken, verifyToken } = require('../helpers/jwtHelper');
const { validateRegistration, validateLogin } = require('../helpers/validationHelper');

class AuthController {
  async register(req, res) {
    try {
      const { error, value } = validateRegistration(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { username, password } = value;

      const existingUserResult = await userRepository.findUserByUsername(username);
      if (existingUserResult.success && existingUserResult.data) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists'
        });
      }

      const createUserResult = await userRepository.createUser({
        username,
        password,
        isRegistered: true
      });

      if (!createUserResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create user',
          error: createUserResult.error
        });
      }

      const token = generateToken({
        userId: createUserResult.data.id,
        username: createUserResult.data.username
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: createUserResult.data,
          token
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { error, value } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { username, password } = value;

      const userResult = await userRepository.findUserByUsername(username);
      if (!userResult.success || !userResult.data) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      const user = userResult.data;

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      await userRepository.updateLastLogin(user._id);

      const token = generateToken({
        userId: user._id,
        username: user.username
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            isRegistered: user.isRegistered
          },
          token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const userResult = await userRepository.findUserById(decoded.userId);
      if (!userResult.success || !userResult.data) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: userResult.data
        }
      });

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Token verification failed',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();