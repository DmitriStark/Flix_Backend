const movieRepository = require("../repositories/movieRepository");
const responseHelper = require("../helpers/responseHelper");

class MovieController {
  async searchMovies(req, res) {
    try {
      const { search, type, year } = req.query;

      const result = await movieRepository.searchMovies({ search, type, year });

      if (result.success) {
        return responseHelper.success(res, {
          movies: result.movies,
          message: `Found ${result.movies.length} movies`,
        });
      } else {
        return responseHelper.notFound(res, result.message, { movies: [] });
      }
    } catch (error) {
      console.error("Movie search error:", error);
      return responseHelper.serverError(res, "Failed to search movies");
    }
  }

  async getPopularMovies(req, res) {
    try {
      const result = await movieRepository.getPopularMovies();

      if (result.success) {
        return responseHelper.success(res, {
          movies: result.movies,
          category: "Popular Movies",
        });
      } else {
        return responseHelper.notFound(res, result.message, { movies: [] });
      }
    } catch (error) {
      console.error("Popular movies error:", error);
      return responseHelper.serverError(res, "Failed to fetch popular movies");
    }
  }

  async getNewMovies(req, res) {
    try {
      const result = await movieRepository.getNewMovies();

      if (result.success) {
        return responseHelper.success(res, {
          movies: result.movies,
          category: "New Movies",
        });
      } else {
        return responseHelper.notFound(res, result.message, { movies: [] });
      }
    } catch (error) {
      console.error("New movies error:", error);
      return responseHelper.serverError(res, "Failed to fetch new movies");
    }
  }

  async getMovieDetails(req, res) {
    try {
      const { imdbID } = req.params;

      const result = await movieRepository.getMovieDetails(imdbID);

      if (result.success) {
        return responseHelper.success(res, {
          movie: result.movie,
        });
      } else {
        return responseHelper.notFound(res, result.message);
      }
    } catch (error) {
      console.error("Movie details error:", error);
      return responseHelper.serverError(res, "Failed to fetch movie details");
    }
  }
}

module.exports = new MovieController();
