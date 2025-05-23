const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { validateMovieSearch } = require("../middleware/validation");
const auth = require("../middleware/auth");

router.get("/search", auth, validateMovieSearch, movieController.searchMovies);
router.get("/popular", auth, movieController.getPopularMovies);
router.get("/new", auth, movieController.getNewMovies);
router.get("/details/:imdbID", auth, movieController.getMovieDetails);

module.exports = router;
