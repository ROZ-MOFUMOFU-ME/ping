const Server = require('socket.io').Server;
const http = require('http');
const { exec } = require('child_process');

const httpServer = http.createServer();
const io = new Server(httpServer);

function getFormattedTime() {
  return new Promise((resolve, reject) => {
    exec("date '+%Y/%m/%d %H:%M:%S'", (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to get server time:", stderr);
        reject("Time Error");
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function logConnection(action, socket, extraInfo = '') {
  try {
    const dateStr = await getFormattedTime();
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    const origin = new URL(socket.handshake.headers['origin'] || 'http://localhost').hostname;
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
  } catch (error) {
    console.error("Logging error:", error);
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
    logConnection('FATALERROR', socket, `${err}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async () => {
  const startTime = await getFormattedTime();
  console.log(`${startTime} Server is listening on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});

module.exports = httpServer;