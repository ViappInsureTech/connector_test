const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Получаем данные из переменных окружения
const SENDER = process.env.SENDER;
const SENDER_NAME = process.env.SENDER_NAME;
const CLIENT = process.env.GMAIL_CLIENT_ID;
const SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH = process.env.GMAIL_REFRESH_TOKEN;
const REDIRECT = 'https://developers.google.com/oauthplayground'; // URL переадресации

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(CLIENT, SECRET, REDIRECT);

// Функция отправки email
const sendEmail = async (prefs) => {
  try {
    // Устанавливаем креденшалы
    oauth2Client.setCredentials({ refresh_token: REFRESH });

    // Получаем accessToken
    const accessToken = await oauth2Client.getAccessToken();

    // Создаём транспортер для отправки email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER,
        clientId: CLIENT,
        clientSecret: SECRET,
        refreshToken: REFRESH,
        accessToken: accessToken.token,
      },
    });

    // Опции письма
    const mailOptions = {
      from: `${SENDER_NAME} <${SENDER}>`, // Отправитель
      to: prefs.to, // Получатель
      subject: prefs.subject, // Тема письма
      text: prefs.text, // Текстовое содержание
      html: prefs.html, // HTML-содержание
      attachments: prefs.attach || [], // Вложения (опционально)
    };

    // Отправка письма
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
