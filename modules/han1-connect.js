const raspi = require('raspi');
const {
  Serial
} = require('raspi-serial');

const han1Connect = new Serial({
  baudRate: 2400,
  dataBits: 8,
  stopBits: 1,
  parity: 'none'
})

raspi.init(() => {
  han1Connect.open(() => {})
})

module.exports = han1Connect;
