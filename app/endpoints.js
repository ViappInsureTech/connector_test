const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const { createClient } = require('./utils/soapClient');
const { authenticate, checkAccess, executeMethod } = require('./utils/rcaUtils');


// Подключаем нужные утилиты и модули
const { login, auth } = require('./utils/auth');
const { sendEmail } = require('./utils/email');
const { sendSms } = require('./utils/sms');


const {
    //AES_KEY,
    RCA_USER,
    RCA_PASS
} = process.env
  



const endpoints = (app) => {
  app.post('/login', login);

 

  app.post('/send-email', auth, async (req, res) => {
    const prefs = req.body;

    try {
      // Вызываем функцию отправки email
      await sendEmail(prefs);
      res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error in /send-email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });

  app.post('/send-sms', async (req, res) => {
    const { num, text } = req.body;

    if (!num || !text) {
      return res.status(400).json({ success: false, error: 'Missing num or text in request body' });
    }

    try {
      const response = await sendSms(num, text);
      res.json({ success: true, message: 'SMS sent successfully', response });
    } catch (error) {
      console.error('Error in /send-sms:', error);
      res.status(500).json({ success: false, error: 'Failed to send SMS' });
    }
  });


  app.post('/apirca', auth, async (req, res) => {
    const url = 'https://rcaapi.bnm.md:5838/RcaExportService.asmx?WSDL';
  
    const credentials = {
      UserName: RCA_USER,
      UserPassword: RCA_PASS,
    };
  
    const input = req.body;
  
    try {
      // Создание SOAP клиента
      const client = await createClient(url);
  
      // Проверка доступа
      const accessCheck = await checkAccess(client, credentials);
      console.log('Access Check Response:', accessCheck);
  
      // Аутентификация
      const securityToken = await authenticate(client, credentials);
  
      // Создаём тело запроса
      const body = {
        SecurityToken: securityToken, // Токен на верхнем уровне
        request: {}, // Запрос, который будет заполняться из input
      };
  
      // Динамическое добавление данных из input
      for (const key in input) {
        if (input.hasOwnProperty(key) && key !== 'method') {
          if (key === 'request') {
            body.request = { ...body.request, ...input[key] };
          } else if (key === 'fileRequest') {
            body.fileRequest = { ...body.fileRequest, ...input[key] };
          } else {
            body[key] = input[key];
          }
        }
      }
  
      console.log('Final Request Body:', body);
  
      // Вызов метода через executeMethod
      const method = input.method;
      if (method) {
        const result = await executeMethod(client, method, body);
        res.json({
          success: true,
          result,
        });
      } else {
        res.status(400).json({ error: 'Method is required in request body' });
      }
    } catch (error) {
      console.error('Error in /apirca:', error.message);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        details: error.message,
      });
    }
  });
  

  
};

module.exports = endpoints;