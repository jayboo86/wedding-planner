// Simple in-memory user store (for demo purposes)
const users = [
  // Example user: username: 'admin', password: 'password' (hashed)
  // Passwords should be hashed using bcrypt
  { username: 'admin', password: '$2b$10$UsccWWawCggwP2ByDom4meX2KnEqOwLByUVcNG.5LoUjsJhe2SLSi' }, // password: admin123
  { username: 'nicole', password: '$2b$10$IomhF31cvmkn.fjK9VlcGefy7iBVArrAs5BgN41jMovXxfLhCkm.2' }, // password: 142284
];

module.exports = users;
