const jwt = require('jsonwebtoken');

// Middleware to protect private routes
module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid or Expired Token!' });
  }
};
