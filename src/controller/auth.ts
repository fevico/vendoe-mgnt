import { RequestHandler } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  login: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }  

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });

      res.status(200).json({
        message: 'Login successful',
        user: {
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

 register: RequestHandler = async (req, res) => {
    try {
      const { name, email, password, businessName, businessAddress, phoneNumber, role } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        res.status(409).json({ error: 'Email already in use' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || undefined, // Use body role if provided, else Prisma default
          businessName,
          businessAddress,
          phoneNumber,
          isActive: role === 'vendor' ? true : false, // Set isActive based on role
        },
      });

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  logout: RequestHandler = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  };
}