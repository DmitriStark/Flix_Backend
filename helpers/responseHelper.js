class ResponseHelper {
  success(res, data = {}, message = "Success") {
    return res.json({
      success: true,
      message,
      ...data,
    });
  }

  created(res, data = {}, message = "Created successfully") {
    return res.status(201).json({
      success: true,
      message,
      ...data,
    });
  }

  notFound(res, message = "Resource not found", data = {}) {
    return res.status(404).json({
      success: false,
      message,
      ...data,
    });
  }

  badRequest(res, message = "Bad request", errors = []) {
    return res.status(400).json({
      success: false,
      message,
      errors,
    });
  }

  unauthorized(res, message = "Unauthorized") {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  forbidden(res, message = "Forbidden") {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  serverError(res, message = "Internal server error") {
    return res.status(500).json({
      success: false,
      message,
    });
  }

  // Custom response for pagination
  paginated(res, data, pagination, message = "Success") {
    return res.json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: pagination.currentPage || 1,
        totalPages: pagination.totalPages || 1,
        totalItems: pagination.totalItems || 0,
        itemsPerPage: pagination.itemsPerPage || 10,
      },
    });
  }

  // Custom response for movie-specific data
  movieResponse(res, movies, category = null, total = null) {
    const response = {
      success: true,
      movies,
      total: total || movies.length,
    };

    if (category) {
      response.category = category;
    }

    return res.json(response);
  }
}

module.exports = new ResponseHelper();
