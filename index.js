// Require the serial Connection.
const han1Connect = require('./modules/han1-connect');
// Require the package script.
const han1Packer = require('./modules/han1-packer');
// Start the Web UI/Dashboard.
require('./modules/han1-dash/han1-dash');

/**
 * Receive the data from the serial connection
 * and send it through to the packaging script.
 * The whole program is controlled by the interval
 * of the data received by the serial connection.
 */
han1Connect.on('data', han1Packer)
