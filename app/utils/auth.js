const jwt = require('jsonwebtoken');


const USERNAME = 'user';
const PASSWORD = '000000';
const JWT_SECRET = 'key'; 

// Логика авторизации
const login = (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    // Генерация токена
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Неверный логин или пароль' });
};

// Middleware для проверки токена
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Недействительный токен' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Токен отсутствует' });
  }
};



module.exports = { login, auth };
