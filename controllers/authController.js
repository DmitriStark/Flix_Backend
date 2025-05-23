const userRepository = require("../repositories/userRepository");
const authHelper = require("../helpers/authHelper");
const responseHelper = require("../helpers/responseHelper");

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await userRepository.findByUsername(username);
      if (existingUser) {
        return responseHelper.badRequest(res, "User already exists");
      }

      const hashedPassword = await authHelper.hashPassword(password);

      const userData = {
        username,
        password: hashedPassword,
      };

      const user = await userRepository.createUser(userData);

      const token = authHelper.generateToken({
        id: user.id,
        username: user.username,
      });

      return responseHelper.created(
        res,
        {
          token,
          user: {
            id: user.id,
            username: user.username,
          },
        },
        "User registered successfully"
      );
    } catch (error) {
      console.error("Registration error:", error);
      return responseHelper.serverError(
        res,
        "Server error during registration"
      );
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      console.log("=== LOGIN DEBUG ===");
      console.log("Login attempt for username:", username);

      if (!username || !password) {
        return responseHelper.badRequest(
          res,
          "Username and password are required"
        );
      }

      const user = await userRepository.findByUsernameWithPassword(username);

      console.log(
        "Database query result:",
        user ? "User found" : "User not found"
      );

      if (!user) {
        return responseHelper.badRequest(res, "Invalid credentials");
      }

      const isMatch = await authHelper.comparePassword(password, user.password);
      console.log("Password match result:", isMatch);

      if (!isMatch) {
        if (!user.password) {
          console.log("ERROR: No password field in user document!");
        }
        return responseHelper.badRequest(res, "Invalid credentials");
      }

      const token = authHelper.generateToken({
        id: user.id,
        username: user.username,
      });

      return responseHelper.success(
        res,
        {
          token,
          user: {
            id: user.id,
            username: user.username,
          },
        },
        "Login successful"
      );
    } catch (error) {
      console.error("Login error:", error);
      return responseHelper.serverError(res, "Server error during login");
    }
  }

  async debugUser(req, res) {
    try {
      const user = await userRepository.findByUsername(req.params.username);

      return responseHelper.success(res, {
        found: !!user,
        user: user
          ? {
              id: user._id,
              username: user.username,
              hasPassword: !!user.password,
              passwordHash: user.password,
              createdAt: user.createdAt,
            }
          : null,
      });
    } catch (error) {
      return responseHelper.serverError(res, error.message);
    }
  }
}

module.exports = new AuthController();
