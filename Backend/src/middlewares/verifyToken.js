import jwt from "jsonwebtoken"

// middleware function that verifies json web token
// checks if the token provided in through the cookies is null
// then it verifies the token with the jwt secret key
const verifyToken = (req, res, next) => {
  const { token } = req.cookies;

  if(!token) {
    return res.status(401).json({ error: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if(err) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};


export default verifyToken;