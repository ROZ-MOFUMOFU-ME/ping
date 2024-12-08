const chai = require('chai');
const expect = chai.expect;
const io = require('socket.io-client');
const { exec } = require('child_process');
const httpServer = require('../app');

describe('Socket.io Server', function () {
  this.timeout(10000);
  let clientSocket;
  let serverProcess;
  const serverUrl = 'http://localhost:3000';

  before(function (done) {
    console.log('Starting server...');
    serverProcess = exec('node app.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${stderr}`);
        return done(error);
      }
    });

    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        console.log('Server started successfully');
        done();
      }
    }, 5000);
  });

  after(function (done) {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }

    if (serverProcess) {
      serverProcess.kill();
      console.log('Server stopped');
    } else {
      console.error('Server process not found');
    }

    httpServer.close(() => {
      console.log('HTTP server closed');
      done();
    });
  });

  beforeEach(function (done) {
    clientSocket = io(serverUrl);
    clientSocket.on('connect', done);
  });

  afterEach(function () {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it('should connect to the server', function (done) {
    expect(clientSocket.connected).to.be.true;
    done();
  });

  it('should respond to latency event', function (done) {
    const startTime = Date.now();
    clientSocket.emit('latency', startTime, function (responseTime) {
      expect(responseTime).to.equal(startTime);
      done();
    });
  });

  it('should handle disconnection gracefully', function (done) {
    clientSocket.disconnect();
    setTimeout(() => {
      expect(clientSocket.connected).to.be.false;
      done();
    }, 100);
  });
});