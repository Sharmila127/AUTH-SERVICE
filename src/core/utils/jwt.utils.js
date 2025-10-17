import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

export const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
};
