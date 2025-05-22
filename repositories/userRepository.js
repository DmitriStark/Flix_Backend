const User = require('../models/User');

class UserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return {
        success: true,
        data: {
          id: savedUser._id,
          username: savedUser.username,
          isRegistered: savedUser.isRegistered,
          createdAt: savedUser.createdAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async findUserByUsername(username) {
    try {
      const user = await User.findOne({ username });
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async findUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateUserRegistrationStatus(userId, isRegistered = true) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isRegistered, lastLogin: new Date() },
        { new: true, select: '-password' }
      );
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateLastLogin(userId) {
    try {
      await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new UserRepository();