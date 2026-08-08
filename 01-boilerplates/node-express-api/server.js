const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// Mock User Database for instant running without strict DB connections
const users = [];

// Base Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Ultimate Node.js REST API Boilerplate is running perfectly!' });
});

// Authentication: Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully!', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication: Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials!' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '1h' });
  res.json({ message: 'Login successful!', token });
});

// Secure Dashboard Route (Uses the auth middleware)
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the Protected Admin Dashboard!', userId: req.user.id });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server blasting off on port ${PORT} 🚀`));
