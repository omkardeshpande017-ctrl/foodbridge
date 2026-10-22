import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signUser } from '../utils/jwt.js';

const r = Router();

r.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      location,
      organization,
      skills
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Name, email, password and role are required'
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    const u = await User.create({
      name,
      email,
      phone,
      passwordHash: await bcrypt.hash(password, 10),
      role,
      location,
      organization,
      skills
    });

    res.status(201).json({
      token: signUser(u),
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        location: u.location,
        organization: u.organization
      }
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
});

r.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const u = await User.findOne({ email });

    if (
      !u ||
      u.status !== 'active' ||
      !(await bcrypt.compare(password, u.passwordHash))
    ) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if (role && role !== u.role) {
      return res.status(401).json({
        message: 'Selected role does not match this account'
      });
    }

    res.json({
      token: signUser(u),
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        location: u.location,
        organization: u.organization
      }
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
});

export default r;