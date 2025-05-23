const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthHelper {
  async hashPassword(password) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const immediateTest = await bcrypt.compare(password, hashedPassword);
      console.log("Password hash test:", immediateTest);

      return hashedPassword;
    } catch (error) {
      console.error("Password hashing error:", error);
      throw error;
    }
  }

  async comparePassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error("Password comparison error:", error);
      throw error;
    }
  }

  generateToken(payload) {
    try {
      const secret =
        process.env.JWT_SECRET || "menora_flix_super_secure_secret_key_2024";
      const options = { expiresIn: "24h" };

      const token = jwt.sign({ user: payload }, secret, options);
      return token;
    } catch (error) {
      console.error("Token generation error:", error);
      throw error;
    }
  }

  verifyToken(token) {
    try {
      const secret =
        process.env.JWT_SECRET || "menora_flix_super_secure_secret_key_2024";
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  }

  generateRefreshToken(payload) {
    try {
      const secret =
        process.env.JWT_REFRESH_SECRET || "menora_flix_refresh_secret_key_2024";
      const options = { expiresIn: "7d" };

      const refreshToken = jwt.sign({ user: payload }, secret, options);
      return refreshToken;
    } catch (error) {
      console.error("Refresh token generation error:", error);
      throw error;
    }
  }

  verifyRefreshToken(refreshToken) {
    try {
      const secret =
        process.env.JWT_REFRESH_SECRET || "menora_flix_refresh_secret_key_2024";
      const decoded = jwt.verify(refreshToken, secret);
      return decoded;
    } catch (error) {
      console.error("Refresh token verification error:", error);
      throw error;
    }
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;

    if (authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    return authHeader;
  }
}

module.exports = new AuthHelper();
