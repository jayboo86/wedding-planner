const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('./users');

const SECRET = 'your_jwt_secret'; // Change this to a strong secret in production

function registerUser(username, password) {
  const existing = users.find(u => u.username === username);
  if (existing) throw new Error('User already exists');
  const hash = bcrypt.hashSync(password, 10);
  users.push({ username, password: hash });
}

function authenticateUser(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}

function generateToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  generateToken,
  verifyToken,
};
