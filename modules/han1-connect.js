let han1Connect;

const serialOpts = {
  portId: !!process.cfg.serial.port ? process.cfg.serial.port : "/dev/ttyAMA0",
  baudRate: !!process.cfg.serial.baudRate ? process.cfg.serial.baudRate : 2400,
  dataBits: !!process.cfg.serial.dataBits ? process.cfg.serial.dataBits : 8,
  stopBits: !!process.cfg.serial.stopBits ? process.cfg.serial.stopBits : 1,
  parity: !!process.cfg.serial.parity ? process.cfg.serial.parity : "none",
}

if (!process.cfg.firstStart) {

  if (process.cfg.host === "raspi") {
    const raspi = require('raspi');
    const {
      Serial
    } = require('raspi-serial');

    han1Connect = new Serial(serialOpts)

    raspi.init(() => {
      han1Connect.open(() => {
        if (process.cfg.debug) {
          console.log('Serial port opened!')
        }
      })
    })
  } else if (process.cfg.host === "other") {
    // Setup serial package for the "other" device
  } else {
    throw new Error('At the moment the host device should be "raspi"');
  }

} else {
  // Don't connect yet until the settings have been set by the installation!
}

module.exports = han1Connect;
