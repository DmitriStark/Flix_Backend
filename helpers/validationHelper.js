class ValidationHelper {
  static validateSearchParams({ search, type, year }) {
    const errors = [];

    if (!search || search.trim().length === 0) {
      errors.push("Search query is required");
    }

    if (search && search.length < 2) {
      errors.push("Search query must be at least 2 characters long");
    }

    if (type && !["movie", "series", "episode"].includes(type)) {
      errors.push("Type must be one of: movie, series, episode");
    }

    if (
      year &&
      (isNaN(year) || year < 1900 || year > new Date().getFullYear())
    ) {
      errors.push("Year must be a valid year between 1900 and current year");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateImdbId(imdbID) {
    const imdbPattern = /^tt\d{7,8}$/;
    return {
      isValid: imdbPattern.test(imdbID),
      errors: imdbPattern.test(imdbID) ? [] : ["Invalid IMDB ID format"],
    };
  }

  static validateRegistrationData({ username, email, password }) {
    const errors = [];

    if (!username || username.trim().length === 0) {
      errors.push("Username is required");
    } else if (username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    } else if (username.length > 20) {
      errors.push("Username must be less than 20 characters");
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores"
      );
    }

    if (!email || email.trim().length === 0) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please provide a valid email address");
    }

    if (!password) {
      errors.push("Password is required");
    } else if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    } else if (password.length > 128) {
      errors.push("Password must be less than 128 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateLoginData({ username, password }) {
    const errors = [];

    if (!username || username.trim().length === 0) {
      errors.push("Username or email is required");
    }

    if (!password || password.trim().length === 0) {
      errors.push("Password is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  }

  static validatePaginationParams({ page, limit }) {
    const errors = [];
    const cleanPage = parseInt(page) || 1;
    const cleanLimit = parseInt(limit) || 10;

    if (cleanPage < 1) {
      errors.push("Page must be greater than 0");
    }

    if (cleanLimit < 1 || cleanLimit > 100) {
      errors.push("Limit must be between 1 and 100");
    }

    return {
      isValid: errors.length === 0,
      errors,
      page: cleanPage,
      limit: cleanLimit,
    };
  }
}

module.exports = ValidationHelper;
