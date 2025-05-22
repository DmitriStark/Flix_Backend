const axios = require('axios');

class MovieRepository {
  constructor() {
    this.baseURL = 'http://www.omdbapi.com/';
    this.apiKey = process.env.OMDB_API_KEY;
  }

  async searchMovies(searchParams) {
    try {
      const { search, type = 'movie', year, page = 1 } = searchParams;
      
      const params = {
        apikey: this.apiKey,
        s: search,
        type: type,
        page: page
      };

      if (year) {
        params.y = year;
      }

      const response = await axios.get(this.baseURL, { params });
      
      if (response.data.Response === 'True') {
        return {
          success: true,
          data: {
            movies: response.data.Search || [],
            totalResults: response.data.totalResults || 0,
            page: page
          }
        };
      } else {
        return {
          success: false,
          error: response.data.Error || 'No movies found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch movies'
      };
    }
  }

  async getMovieById(imdbID) {
    try {
      const params = {
        apikey: this.apiKey,
        i: imdbID,
        plot: 'full'
      };

      const response = await axios.get(this.baseURL, { params });
      
      if (response.data.Response === 'True') {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.data.Error || 'Movie not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch movie details'
      };
    }
  }

  async getDefaultMovies() {
    try {
      const superheroMovies = await this.searchMovies({ 
        search: 'superhero', 
        type: 'movie' 
      });
      
      const actionMovies = await this.searchMovies({ 
        search: 'action', 
        type: 'movie' 
      });

      return {
        success: true,
        data: {
          recommended: superheroMovies.success ? superheroMovies.data.movies : [],
          newMovies: actionMovies.success ? actionMovies.data.movies : []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch default movies'
      };
    }
  }
}

module.exports = new MovieRepository();