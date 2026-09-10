

// Reusable pagination middleware
// Reads page and limit from query params, sanitizes them,
// and attaches { page, limit, skip } to req.pagination.
const pagination = (defaults = {}) => {
  const { defaultPage = 1, defaultLimit = 20, maxLimit = 40 } = defaults;

  return (req, res, next) => {
    const page = Math.max(Number(req.query.page) || defaultPage, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || defaultLimit, 1),
      maxLimit
    );

    req.pagination = {
      page,
      limit,
      skip: (page - 1) * limit,
    };

    next();
  };
};

export default pagination;