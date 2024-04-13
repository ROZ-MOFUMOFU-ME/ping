const { Server } = require('socket.io');
const http = require('http');
const { execSync } = require('child_process');

const server = http.createServer();
const io = new Server(server);

const serverStartTime = getFormattedTime();

function getFormattedTime() {
  try {
    return execSync("date '+%Y/%m/%d %H:%M:%S'").toString().trim();
  } catch (error) {
    console.error("Failed to get server time:", error);
    return "Time Error";
  }
}

function logConnection(action, socket, extraInfo = '') {
  const dateStr = getFormattedTime();
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  const origin = (socket.handshake.headers['origin'] || 'unknown origin').replace('https://', '');
  const logMessage = `${dateStr} ${action} ${ip} [${origin}] ${extraInfo}`;

  switch (action) {
    case 'CONNECTION':
      console.info(logMessage);
      break;
    case 'DISCONNECT':
      console.info(logMessage);
      break;
    case 'FATALERROR':
      console.error(logMessage);
      break;
    default:
      console.log(logMessage);
  }
}

io.on('connection', (socket) => {
  logConnection('CONNECTION', socket);

  socket.on('latency', (startTime, cb) => {
    cb(startTime);
  });

  socket.on('disconnect', () => {
    logConnection('DISCONNECT', socket);
  });

  socket.on('error', (err) => {
    const errorInfo = `${err}`
    logConnection('FATALERROR', socket, errorInfo);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`${serverStartTime} Server is listening on port ${PORT}`);
});
