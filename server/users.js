// Simple in-memory user store (for demo purposes)
const users = [
  // Example user: username: 'admin', password: 'password' (hashed)
  // Passwords should be hashed using bcrypt
  { username: 'admin', password: '$2b$10$Q9QwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ' }, // password: admin123
  { username: 'nicole', password: '$2b$10$Qw8Qw8Qw8Qw8Qw8Qw8QwOeQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Q' }, // password: 142284
];

module.exports = users;
