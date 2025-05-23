const omdbService = require("../services/omdbService");

class MovieRepository {
  async searchMovies(searchParams) {
    try {
      const result = await omdbService.searchMovies(searchParams);
      return result;
    } catch (error) {
      console.error("Repository - Movie search error:", error);
      throw error;
    }
  }

  async getPopularMovies() {
    try {
      const result = await omdbService.getPopularMovies();
      return result;
    } catch (error) {
      console.error("Repository - Popular movies error:", error);
      throw error;
    }
  }

  async getNewMovies() {
    try {
      const result = await omdbService.getNewMovies();
      return result;
    } catch (error) {
      console.error("Repository - New movies error:", error);
      throw error;
    }
  }

  async getMovieDetails(imdbID) {
    try {
      if (!imdbID) {
        return {
          success: false,
          message: "IMDB ID is required",
        };
      }

      const result = await omdbService.getMovieDetails(imdbID);
      return result;
    } catch (error) {
      console.error("Repository - Movie details error:", error);
      throw error;
    }
  }

  // Additional repository methods can be added here
  // For example: caching, data transformation, etc.

  async getMoviesByGenre(genre) {
    try {
      // This could be implemented if omdbService supports it
      // or if you want to filter existing search results
      const result = await omdbService.searchMovies({
        search: genre,
        type: "movie",
      });
      return result;
    } catch (error) {
      console.error("Repository - Movies by genre error:", error);
      throw error;
    }
  }
}

module.exports = new MovieRepository();
