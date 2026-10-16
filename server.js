const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ❌ БАГ 1: пароль в открытом виде прямо в коде
const USERS = {
  admin: 'admin123',
  user: 'qwerty',
};

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ❌ БАГ 2: нет валидации полей
// ❌ БАГ 3: нет защиты от брутфорса (нет счётчика попыток)
// ❌ БАГ 4: разные сообщения об ошибке — раскрывают существование пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Введите имя пользователя' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Введите пароль' });
  }

  if (!USERS[username]) {
    // ❌ БАГ 5: сообщение раскрывает, что юзера нет
    return res.status(401).json({ error: 'Пользователь не найден' });
  }

  if (USERS[username] !== password) {
    // ❌ БАГ 6: сообщение раскрывает, что пароль неверный
    return res.status(401).json({ error: 'Неверный пароль' });
  }

  // ❌ БАГ 7: нет токена/сессии, просто «успех»
  res.json({ success: true, message: 'Добро пожаловать, ' + username });
});

// ❌ БАГ 8: страница "забыли пароль" возвращает 404
// (специально не реализована)

// Запуск
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});