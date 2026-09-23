// Restricts a route to the roles passed in
// Must be used after verifyToken so req.user is populated
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }
    next();
  };
};

export default requireRole;
