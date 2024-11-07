const twilio = require('twilio');
const logger = require('../startup/logger'); // Adjust the path as needed
require('dotenv').config();



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = new twilio(accountSid, authToken)


exports.phoneservice = async (phone, sms) => {
     client.messages
          .create({
               to: phone, // The recipient's phone number
               from: '+14692703155', // Your Twilio phone number
               body: 'Confidate App \n\n '+sms // The message body
          })
          .then(message => {
               logger.info('Message sent: ' + message.sid);
          })
          .catch(error => {
               logger.error('Error sending message: ', error);
          });
}

