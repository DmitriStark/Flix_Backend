const authHelper = require("../helpers/authHelper");
const userRepository = require("../repositories/userRepository");
const responseHelper = require("../helpers/responseHelper");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHelper.extractTokenFromHeader(authHeader);

    if (!token) {
      return responseHelper.unauthorized(res, "No token, authorization denied");
    }

    const decoded = authHelper.verifyToken(token);

    const user = await userRepository.findById(decoded.user.id);
    if (!user) {
      return responseHelper.unauthorized(res, "Token is no longer valid");
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return responseHelper.unauthorized(res, "Token is not valid");
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHelper.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = authHelper.verifyToken(token);
      req.user = decoded.user;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  auth,
  optionalAuth,
};
