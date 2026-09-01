import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generates a hashed password with the default salt value 10
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  catch(err) {
    return err;
  }
};

// Compares the hashed password with a given password
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  }
  catch(err) {
    return err;
  }
};

// Token durations
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";

// Cookie options shared by both tokens
export const cookieOptions = (maxAge) => ({
  maxAge,
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

export const ACCESS_COOKIE_MAXAGE = 15 * 60 * 1000;       // 15 minutes
export const REFRESH_COOKIE_MAXAGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Signs a short-lived access token (15 min)
export const generateAccessToken = (userId, username) => {
  return jwt.sign(
    { id: userId, username },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Signs a long-lived refresh token (7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};