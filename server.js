const http = require('http');
const app = require('./app');
const port = process.env.PORT || 8000;
const logger = require('./logger');
// const moment = require('moment');

const server = http.createServer(app);
server.listen(port, () => {
  logger.info(`listening on http://localhost:${port}`);
  console.log('Server Started At: ',new Date());
});