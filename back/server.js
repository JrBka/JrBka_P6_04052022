//importe les package http
const http = require('http');
//importe le fichier app.js
const app = require('./app');

//utilisation de ce port
app.set('port', 3000);

//fonction qui gere les erreur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + 3000;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//création du server
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + 3000;
  console.log('Listening on ' + bind);
});

//écoute du port sur lequel executer le serveur
server.listen(3000);

