const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';
const JWT_EXPIRE = '7d'; 

class JWTHelper {
  generateToken(payload) {
    try {
      return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRE,
        issuer: 'MenoraFlix'
      });
    } catch (error) {
      console.error('JWT generation error:', error);
      throw new Error('Failed to generate token');
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('JWT verification error:', error);
      return null;
    }
  }

  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }

  generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: '30d',
        issuer: 'MenoraFlix'
      });
    } catch (error) {
      console.error('Refresh token generation error:', error);
      throw new Error('Failed to generate refresh token');
    }
  }
}

module.exports = new JWTHelper();