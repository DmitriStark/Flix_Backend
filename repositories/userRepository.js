const User = require("../models/User");

class UserRepository {
  async findByUsernameWithPassword(username) {
    try {
      const user = await User.findOne({ username }).select("+password");
      return user;
    } catch (error) {
      console.error("Repository - Find user with password error:", error);
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      console.error("Repository - Find user by username error:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      console.error("Repository - Find user by ID error:", error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      console.log("User object before save:", {
        username: userData.username,
        password: userData.password,
      });

      const user = new User(userData);
      await user.save();

      console.log("User saved. Retrieving from database...");

      const savedUser = await User.findOne({ username: userData.username });
      console.log("Retrieved user from database:", {
        username: savedUser.username,
        password: savedUser.password,
      });

      return savedUser;
    } catch (error) {
      console.error("Repository - Create user error:", error);
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      return user;
    } catch (error) {
      console.error("Repository - Update user error:", error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (error) {
      console.error("Repository - Delete user error:", error);
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find()
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Repository - Get all users error:", error);
      throw error;
    }
  }
}

module.exports = new UserRepository();