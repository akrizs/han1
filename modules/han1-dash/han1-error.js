const {
  errorSocket
} = require('./han1-sockets');

function han1Error(error) {
  if (process.cfg.debug) {
    console.log(error);
  }
  errorSocket.emit('error', error.toString());
}

module.exports = han1Error;
