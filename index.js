const config = require('./modules/han1-config.js');

config().then(cfg => {
  try {
    process.cfg = cfg;
    if (cfg.debug) {
      console.log(process.cfg);
    }
    // Require the serial Connection.
    const han1Connect = require('./modules/han1-connect');
    // Require the package script.
    const han1Packer = require('./modules/han1-packer');
    // Start the Web UI/Dashboard.
    const han1WebServer = require('./modules/han1-dash/han1-webserver');


    /**
     * Receive the data from the serial connection
     * and send it through to the packaging script.
     * The whole program is controlled by the interval
     * of the data received by the serial connection.
     */

    han1Connect.on('data', han1Packer)

    han1WebServer.listen(3000, (err) => {
      if (err) throw new Error('Issues with starting up the Web Server!')
      if (process.cfg.debug) {
        console.log('Listening on port 3000')
      }
    })
  } catch (e) {
    let han1Error = require('./modules/han1-dash/han1-error');
    han1Error(e)
  }

})
