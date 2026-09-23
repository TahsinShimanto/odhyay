import jwt from "jsonwebtoken"

// Verifies the access token from the cookies and attaches the decoded payload to req.user
// Fails the request with 401 when the token is missing or invalid
const verifyToken = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};


// Same as verifyToken, but a missing/invalid token simply means "anonymous"
// Used on the public questions endpoint so signed-in users still get
// their `saved` flags while anonymous visitors are unaffected
export const optionalVerifyToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // treat as anonymous
  }

  next();
};


export default verifyToken;
