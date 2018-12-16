const han1Bridge = require('./han1-bridge');

const rem = {
  start: false,
  length: 0,
  dataLength: 0,
  promises: [],
  counter: 0
}

function han1Packer(data) {
  if (rem.start === false && data[0] === 0x7E && data[1] === 0xA0) {
    rem.start = true;
    rem.length = data.readUInt8(2);
  }
  if (rem.start) {
    data.map(d => {
      return rem.dataLength++
    })
    // rem.data.push(...data);
    rem.promises.push(new Promise((res, rej) => {
      res(data);
    }))
  }

  if (rem.dataLength === rem.length + 2) {
    Promise.all(rem.promises).then(re => {
      return Buffer.concat(re);
    }).then((packet) => {
      han1Bridge(packet);
      rem.dataLength = 0;
      rem.length = undefined;
      rem.start = false;
      rem.data = [];
      rem.promises = [];
    })
  }
}

module.exports = han1Packer;
