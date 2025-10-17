import AuthService from '../services/auth.service.js';
const authService = new AuthService();

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.validateToken(token);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await authService.logout(userId);
    res.status(200).json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
