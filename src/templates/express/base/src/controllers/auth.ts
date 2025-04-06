import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { AppError } from '../middleware/error';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AppError(400, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName
  });

  req.session.userId = user._id;
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError(401, 'Invalid credentials');
  }

  req.session.userId = user._id;
  res.json(user);
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      throw new AppError(500, 'Error logging out');
    }
    res.clearCookie('sid').json({ message: 'Logged out successfully' });
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.session.userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.json(user);
}; 