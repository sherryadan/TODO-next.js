import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default-secret-key";

/**

 * @param {Object} payload .
 * @param {string} expiresIn
 * @returns {string} 
 */
export function generateToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

/**
 * @param {string} token 
 * @returns {Object} 
 * @throws {Error}
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}