const soap = require('soap');

/**
 * Создаёт SOAP клиент
 * @param {string} url - WSDL URL
 * @returns {Promise<object>} - SOAP клиент
 */
const createClient = async (url) => {
  try {
    const client = await soap.createClientAsync(url);
    return client;
  } catch (error) {
    console.error('Error creating SOAP client:', error.message);
    throw new Error('Failed to create SOAP client');
  }
};

module.exports = { createClient };
