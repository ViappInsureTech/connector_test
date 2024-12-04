const express = require('express');
const endpoints = require('./endpoints');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Подключаем эндпоинты
endpoints(app);

app.listen(PORT, () => {
  console.log(`Core test server run on ${PORT}`);
});