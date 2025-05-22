const axios = require("axios");

class OMDBService {
  constructor() {
    this.apiKey = process.env.OMDB_API_KEY;
    this.baseURL = "http://www.omdbapi.com/";
  }

  async searchMovies({ search, type, year }) {
    try {
      const params = {
        apikey: this.apiKey,
        s: search || "movie",
        ...(type && { type }),
        ...(year && { y: year }),
      };

      const response = await axios.get(this.baseURL, { params });

      if (response.data.Response === "True") {
        return {
          success: true,
          movies: response.data.Search.map((movie) => ({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Type: movie.Type,
            Poster: movie.Poster !== "N/A" ? movie.Poster : null,
          })),
        };
      } else {
        return {
          success: false,
          message: response.data.Error || "No movies found",
          movies: [],
        };
      }
    } catch (error) {
      console.error("OMDB API Error:", error.message);
      return {
        success: false,
        message: "Failed to fetch movies",
        movies: [],
      };
    }
  }

  async getMovieDetails(imdbID) {
    try {
      const params = {
        apikey: this.apiKey,
        i: imdbID,
        plot: "full",
      };

      const response = await axios.get(this.baseURL, { params });

      if (response.data.Response === "True") {
        return {
          success: true,
          movie: response.data,
        };
      } else {
        return {
          success: false,
          message: response.data.Error || "Movie not found",
        };
      }
    } catch (error) {
      console.error("OMDB API Error:", error.message);
      return {
        success: false,
        message: "Failed to fetch movie details",
      };
    }
  }

  async getPopularMovies() {
    return await this.searchMovies({ search: "popular" });
  }

  async getNewMovies() {
    const currentYear = new Date().getFullYear();
    return await this.searchMovies({ search: "action", year: currentYear });
  }
}

module.exports = new OMDBService();
