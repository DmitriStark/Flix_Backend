const movieRepository = require('../repositories/movieRepository');
const { validateMovieSearch } = require('../helpers/validationHelper');

class MovieController {
  async searchMovies(req, res) {
    try {
      const { error, value } = validateMovieSearch(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map(detail => detail.message)
        });
      }

      const searchResult = await movieRepository.searchMovies(value);
      
      if (!searchResult.success) {
        return res.status(404).json({
          success: false,
          message: searchResult.error
        });
      }

      res.json({
        success: true,
        message: 'Movies retrieved successfully',
        data: searchResult.data
      });

    } catch (error) {
      console.error('Movie search error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getMovieDetails(req, res) {
    try {
      const { imdbID } = req.params;
      
      if (!imdbID) {
        return res.status(400).json({
          success: false,
          message: 'IMDB ID is required'
        });
      }

      const movieResult = await movieRepository.getMovieById(imdbID);
      
      if (!movieResult.success) {
        return res.status(404).json({
          success: false,
          message: movieResult.error
        });
      }

      res.json({
        success: true,
        message: 'Movie details retrieved successfully',
        data: movieResult.data
      });

    } catch (error) {
      console.error('Movie details error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getDefaultMovies(req, res) {
    try {
      const moviesResult = await movieRepository.getDefaultMovies();
      
      if (!moviesResult.success) {
        return res.status(500).json({
          success: false,
          message: moviesResult.error
        });
      }

      res.json({
        success: true,
        message: 'Default movies retrieved successfully',
        data: moviesResult.data
      });

    } catch (error) {
      console.error('Default movies error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getRecommendedMovies(req, res) {
    try {
      const searchResult = await movieRepository.searchMovies({
        search: 'superhero',
        type: 'movie'
      });
      
      if (!searchResult.success) {
        return res.status(404).json({
          success: false,
          message: 'No recommended movies found'
        });
      }

      res.json({
        success: true,
        message: 'Recommended movies retrieved successfully',
        data: {
          movies: searchResult.data.movies
        }
      });

    } catch (error) {
      console.error('Recommended movies error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getNewMovies(req, res) {
    try {
      const searchResult = await movieRepository.searchMovies({
        search: 'action',
        type: 'movie'
      });
      
      if (!searchResult.success) {
        return res.status(404).json({
          success: false,
          message: 'No new movies found'
        });
      }

      res.json({
        success: true,
        message: 'New movies retrieved successfully',
        data: {
          movies: searchResult.data.movies
        }
      });

    } catch (error) {
      console.error('New movies error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new MovieController();