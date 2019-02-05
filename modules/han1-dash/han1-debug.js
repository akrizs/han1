// Require hexy
const {
  hexy
} = require('hexy');
// Require the Socket connection
const {
  dbgSocket
} = require('./han1-sockets');

const findDataType = require('../han1-parser/han1-profile').findDataType;


/**
 * @name han1Debug
 * @description
 * Creates and delivers debug information for data received from the HAN port to the browser.
 * @param {*} dbgInfo
 */

function han1Debug(data, parsed, lastPrice) {
  const dbgPack = {};

  dbgPack.hexified = hexy(data, {
    width: 16,
    numbering: 'none',
    caps: 'upper',
    format: 'twos',
    annotate: 'none'
  });

  dbgPack.obis = debugFindObis(data)
  dbgPack.date = parsed.dateTime;
  dbgPack.raw = data;
  dbgPack.parsed = parsed
  if (!!lastPrice) {
    dbgPack.price = lastPrice
  }
  dbgSocket.emit('dbgData', dbgPack)
}

function debugFindObis(raw) {
  const obis = [];
  let sponge = Array.from(raw).map((int, idx, arr) => {
    let dataType;
    if (int === 0xFF) {
      // 0x01 stands for Electronics 0x00 for general
      if (arr[idx - 5] === 0x01 && arr[idx - 4] === 0x00 || arr[idx - 5] === 0x00 && arr[idx - 4] === 0x01 || arr[idx - 5] === 0x01 && arr[idx - 4] === 0x01 || arr[idx - 5] === 0x00 && arr[idx - 4] === 0x00) {

        dataType = findDataType(arr[idx + 1])

        let string = `${arr[idx - 5]}-${arr[idx - 4]}:${arr[idx - 3]}.${arr[idx - 2]}.${arr[idx - 1]}.${arr[idx]}`
        return [string, dataType, idx - 5, idx]
      }
    }
  }).filter(Boolean).map((obis, idx, arr) => {
    let c, n, nl, dStart, dEnd;
    c = obis
    dStart = (obis[obis.length - 1] + 1)
    if (arr[idx + 1]) {
      // There is a next object.
      n = arr[idx + 1]
      dEnd = (n[n.length - 2] - 1)
    } else {
      dEnd = raw.length - 3;
    }

    obis[obis.length] = dStart;
    obis[obis.length] = dEnd;

    return obis;
  })
  return sponge;
}

module.exports = han1Debug;
