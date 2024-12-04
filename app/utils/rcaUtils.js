const { createClient } = require('./soapClient');

/**
 * Аутентификация в RCA API
 * @param {object} client - SOAP клиент
 * @param {object} credentials - Учетные данные { UserName, UserPassword }
 * @returns {Promise<string>} - Security Token
 */
const authenticate = async (client, credentials) => {
  try {
    const body = { author: credentials };
    const auth = await client.AuthenticateAsync(body);
    return auth[0].AuthenticateResult;
  } catch (error) {
    console.error('Error during authentication:', error.message);
    throw new Error('Authentication failed');
  }
};

/**
 * Проверка доступа к RCA API
 * @param {object} client - SOAP клиент
 * @param {object} credentials - Учетные данные { UserName, UserPassword }
 * @returns {Promise<object>} - Результат проверки
 */
const checkAccess = async (client, credentials) => {
  try {
    const response = await client.CheckAccessAsync({
      login: credentials.UserName,
      password: credentials.UserPassword,
    });
    return response;
  } catch (error) {
    console.error('Error during access check:', error.message);
    throw new Error('Access check failed');
  }
};

/**
 * Выполняет метод RCA API
 * @param {object} client - SOAP клиент
 * @param {string} method - Название метода
 * @param {object} body - Тело запроса
 * @returns {Promise<object>} - Результат выполнения метода
 */
const executeMethod = async (client, method, body) => {
  if (!method || typeof client[`${method}Async`] !== 'function') {
    throw new Error(`Method '${method}' not found`);
  }
  try {
    const result = await client[`${method}Async`](body);
    return result[0];
  } catch (error) {
    console.error(`Error executing method '${method}':`, error.message);
    throw new Error(`Failed to execute method '${method}'`);
  }
};

module.exports = { authenticate, checkAccess, executeMethod };
