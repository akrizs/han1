const config = require('./modules/han1-config.js');
let han1Connect, han1Packer, han1WebServer;

config().then(cfg => {
  try {
    cfg.version = require('./package').version;
    process.cfg = cfg;
    if (cfg.debug) {
      console.log(process.cfg);
    }


    if (process.cfg.firstStart) {
      const {
        spawn
      } = require('child_process');

      console.log('Main Process PID:', process.pid)
      console.log('Main Process PPID:', process.ppid)

      const han1Setup = spawn('node', ['./modules/han1-setup']);



      han1Setup.stdout.on('data', (data) => {
        console.log('\x1b[32m%s\x1b[0m', '[Setup]', `\n${data}`);
      });

      han1Setup.stderr.on('data', (data) => {
        console.log('\x1b[31m%s\x1b[0m', '[Setup]', `\n${data}`);
      });

      han1Setup.on('close', (code) => {
        console.log('\x1b[33m%s\x1b[0m', '[Setup]', `Child process exited with code ${code}`);
      });

    } else {
      // Require the serial Connection.
      han1Connect = require('./modules/han1-connect');
      // Require the package script.
      han1Packer = require('./modules/han1-packer');
      // Start the Web UI/Dashboard.
      han1WebServer = require('./modules/han1-dash/han1-webserver');
      /**
       * Receive the data from the serial connection
       * and send it through to the packaging script.
       * The whole program is controlled by the interval
       * of the data received by the serial connection.
       */
      startUpHan1();

    }
  } catch (e) {
    console.log(e);
  }

})

function startUpHan1() {
  han1Connect.on('data', han1Packer)

  han1WebServer.listen(3000, (err) => {
    if (err) throw new Error('Issues with starting up the Web Server!')
    if (process.cfg.debug) {
      console.log('Listening on port 3000')
    }
  })
}
