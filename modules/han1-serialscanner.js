const serialPort = require('serialport');

function han1SerialScanner() {
  return new Promise((res, rej) => {
    serialPort.list((err, ports) => {
      if (err) throw new Error('Something went wrong while scanning the serial ports!');
      portCounts = ports.length;

      ports.map(async port => {
        return port
      })

      Promise.all(ports).then(data => {
        res(data);
      }).catch(err => {
        console.log(err);
      })
    })
  });
}



module.exports = han1SerialScanner
