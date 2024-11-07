const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const logger = require('./startup/logger'); // Adjust the path as needed
app.use(cors());

require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 8090;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

require('./startup/sockets')(server, app);

module.exports = server;