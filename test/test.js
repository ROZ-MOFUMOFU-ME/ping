const { expect } = require('chai');
const { spawn } = require('child_process');

describe('Server launch test', function() {
  this.timeout(5000);

  it('should display "Server is listening on port 3000"', function(done) {
    const server = spawn('node', ['app.js']);
    let testCompleted = false;

    const cleanUpAndFinish = (error = null) => {
      if (!testCompleted) {
        testCompleted = true;
        server.kill();
        done(error);
      }
    };

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server is listening on port 3000')) {
        cleanUpAndFinish();
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    server.on('close', (code) => {
      if (code !== 0) {
        console.log(`Server process exited with code ${code}`);
      }
    });

    server.on('error', (error) => {
      console.error(`Server process encountered an error: ${error}`);
      cleanUpAndFinish(new Error('Server process encountered an error'));
    });

    setTimeout(() => {
      cleanUpAndFinish(new Error('Failed to detect server startup message.'));
    }, 4900);
  });
});
