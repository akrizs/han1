// Require hexy
const {
  hexy
} = require('hexy');
// Require the Socket connection
const {
  dbgWeb
} = require('./han1-dash/han1-dash');


/**
 * @name han1Debug
 * @description
 * Creates and delivers debug information for data received from the HAN port to the browser.
 * @param {*} dbgInfo
 */

function han1Debug(data, parsed) {
  const dbgPack = {};

  dbgPack.hexified = hexy(data, {
    width: 16,
    numbering: 'none',
    caps: 'upper',
    format: 'twos',
    annotate: 'none'
  });
  let obis = debugFindObis(data);
  dbgPack.obis = obis
  dbgPack.date = parsed.dateTime;
  dbgPack.raw = parsed.raw;
  dbgPack.raw.fullData = data;
  dbgWeb.emit('dbgData', dbgPack)
}

function debugFindObis(raw) {
  const obis = [];
  let sponge = Array.from(raw).map((int, idx, arr) => {
    let dataType;
    // Obis codes as the date of app creation usually are unused and therefore end with 0xFF;
    if (int === 0xFF) {
      // 0x01 stands for Electronics 0x00 for general
      if (arr[idx - 5] === 0x01 || arr[idx - 5] === 0x00) {

        if (arr[idx + 1] === 0x0A) {
          // OBIS code value
          dataType = 'obisCodeValue';
        } else if (arr[idx + 1] === 0x09) {
          // String value
          dataType = 'string';
        } else if (arr[idx + 1] === 0x02) {
          // byte value (1 byte)
          dataType = '1byte';
        } else if (arr[idx + 1] === 0x12) {
          // integer value (2 bytes)
          dataType = 'int2bytes';
        } else if (arr[idx + 1] === 0x06) {
          // integer value (4 bytes)
          dataType = 'int4bytes';
        }

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
