/**
 * Standardized API response wrapper.
 * All API endpoints return responses in this format.
 */
export class ApiResponse {
  constructor(statusCode, message, data = null, meta = {}) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;

    if (meta.pagination) {
      this.pagination = meta.pagination;
    }

    if (meta.extra) {
      Object.assign(this, meta.extra);
    }
  }

  static success(res, message, data = null, statusCode = 200, meta = {}) {
    const response = new ApiResponse(statusCode, message, data, meta);
    return res.status(statusCode).json(response);
  }

  static created(res, message, data = null) {
    return ApiResponse.success(res, message, data, 201);
  }

  static paginated(res, message, data, pagination) {
    return ApiResponse.success(res, message, data, 200, { pagination });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}
