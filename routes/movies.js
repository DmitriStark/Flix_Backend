const express = require('express');
const router = express.Router();
const omdbService = require('../services/omdbService');
const { validateMovieSearch } = require('../middleware/validation');
const auth = require('../middleware/auth');

router.get('/search', auth, validateMovieSearch, async (req, res) => {
  try {
    const { search, type, year } = req.query;
    
    const result = await omdbService.searchMovies({ search, type, year });

    if (result.success) {
      res.json({
        success: true,
        movies: result.movies,
        message: `Found ${result.movies.length} movies`
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
        movies: []
      });
    }
  } catch (error) {
    console.error('Movie search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search movies'
    });
  }
});

router.get('/popular', auth, async (req, res) => {
  try {
    const result = await omdbService.getPopularMovies();
    
    if (result.success) {
      res.json({
        success: true,
        movies: result.movies,
        category: 'Popular Movies'
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
        movies: []
      });
    }
  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular movies'
    });
  }
});

router.get('/new', auth, async (req, res) => {
  try {
    const result = await omdbService.getNewMovies();
    
    if (result.success) {
      res.json({
        success: true,
        movies: result.movies,
        category: 'New Movies'
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
        movies: []
      });
    }
  } catch (error) {
    console.error('New movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new movies'
    });
  }
});

router.get('/details/:imdbID', auth, async (req, res) => {
  try {
    const { imdbID } = req.params;
    
    const result = await omdbService.getMovieDetails(imdbID);
    
    if (result.success) {
      res.json({
        success: true,
        movie: result.movie
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie details'
    });
  }
});

module.exports = router;