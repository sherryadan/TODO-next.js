import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default-secret-key";

export function generateToken(payload, expiresIn = "1h") {
return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
export function verifyToken(token) {
try {
return jwt.decode(token, SECRET_KEY);
} catch (error) {
console.error("Token verification failed:", error);
}
}