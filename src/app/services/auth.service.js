import bcrypt from 'bcryptjs';
import UserRepository from '../../domain/repositories/user.repository.js';
import { generateToken, verifyToken } from '../../core/utils/jwt.utils.js';
import { getRedisClient } from '../../infrastructure/cache/redisClient.js';
import { publish } from '../../infrastructure/messaging/rabbitmqConnection.js';
import AppError from '../../core/errors/AppError.js';

export default class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.redis = null;
    try { this.redis = getRedisClient(); } catch (e) {}
  }

  async register({ name, email, password }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new AppError('Email already registered', 400);
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, password: hashed });
    await publish('auth.register', { userId: user._id, email: user.email });
    return { id: user._id, email: user.email };
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Invalid credentials', 401);
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    if (this.redis) {
      await this.redis.set(`token:${user._id}`, token, { EX: 3600 });
    }
    await publish('auth.login', { userId: user._id, email: user.email });
    return { token, user: { id: user._id, email: user.email } };
  }

  async validateToken(token) {
    const decoded = verifyToken(token);
    if (this.redis) {
      const cached = await this.redis.get(`token:${decoded.id}`);
      if (!cached) throw new AppError('Token expired or revoked', 401);
    }
    return { user: { id: decoded.id, email: decoded.email, role: decoded.role } };
  }

  async logout(userId) {
    if (this.redis) await this.redis.del(`token:${userId}`);
    await publish('auth.logout', { userId });
    return true;
  }
}
