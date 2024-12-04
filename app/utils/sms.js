const axios = require('axios');

const SMS_API_TOKEN = process.env.SMS_API_TOKEN;
const ALPHANAME_ID = process.env.ALPHANAME_ID;

console.log(SMS_API_TOKEN, ALPHANAME_ID)


const sendSms = async (num, text) => {
  try {
    const response = await axios.post('https://app.dataedge.md/api/v1/sendQuickSMS', {
      token: SMS_API_TOKEN,
      alphaname_id: ALPHANAME_ID,
      message: text,
      phone: num,
    });

    console.log('SMS sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendSms };