const mongoose = require('mongoose');
const logger = require('./logger'); // Adjust the path as needed

module.exports = function () {
  // const db = 'mongodb+srv://utecho683:f2uETWZL1gKn21D7@cluster0.dsviepk.mongodb.net/trabojos';
  const db = 'mongodb+srv://myapp1jb:APllZz9vbj3FXrLQ@clustermongosa.tch8fkz.mongodb.net/confidate';
  mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`));
}