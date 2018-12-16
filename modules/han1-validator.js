const {
  crc16modbus,
  crc16xmodem,
  crc16ccitt,
  crc16
} = require('crc');
const hex2bin = require('./baseConv')

async function han1Validator(buffer) {
  buffer = Buffer.from(buffer, 'base64')

  const headerEnd = Array.from(buffer).map((byte, i, arr) => {
    if (byte === 0xE6 && arr[i + 1] === 0xE7 || byte === 0xE6 && arr[i + 1] === 0xE6) {
      return i
    } else {
      return false
    }
  }).filter(Boolean)[0];

  const data = {
    start: buffer.slice(0, headerEnd),
    main: buffer.slice(headerEnd, buffer.length - 3),
    end: buffer.slice(buffer.length - 3, buffer.length)
  }

  const addr = {
    dest: (data.start.readUInt8(4)).toString(16)[0],
    source: (data.start.readUInt8(5)).toString(16)[0],
    LSAP: {
      dest: [data.main[0].toString(2), data.main.readUInt8(0)],
      source: [data.main[1].toString(2), data.main.readUInt8(1)],
      type: LSB(data.main[1].toString(2), 1) ? 'command' : 'response'
    },
    // llcQuality - Reserved for later use.
    llcQuality: data.main[2].toString(16)
  }


  const ctrl = {
    frameFormat: data.start[1] >> 4 === 10 ? 3 : 'Unknown',
    frameSize: ((data.start.readUInt8(1) & 0x0F) << 8) | data.start.readUInt8(2),
    fsef: [data.start[0].toString(16), data.end[data.end.length - 1].toString(16)],
    ctrlField: data.start[5] & 0x0F,
    fcs: (data.end.slice(0, 2).readUInt16BE(0)).toString(16)
  }
  ctrl.fullFrame = ctrl.frameSize + ctrl.fsef.length === buffer.length;

  /**
   * @TODO:
   * Add a CRC check
   * Figure out rest of LSAP Kamstrup(00 0F 00 00 00 00 0C)
   * 
   */

  const obis = Array.from(data.main).map((int, i, arr) => {
    if (int === 0xff) {
      return `${arr[i - 5]}-${arr[i - 4]}:${arr[i - 3]}.${arr[i - 2]}.${arr[i - 1]}.${arr[i]}`
    }
  }).filter(Boolean);


  ctrl.hasObis = obis.length > 0;

  let manufacturer;
  if (data.main.toString().includes('Kamstrup')) {
    manufacturer = 'kamstrup';
  } else if (data.main.toString().includes('KFM')) {
    manufacturer = 'kaifa'
  } else if (data.main.toString().includes('AIDON')) {
    manufacturer = 'aidon'
  }

  if (ctrl.fullFrame && ctrl.hasObis) {
    return {
      manufacturer,
      data,
      addr,
      ctrl,
      statusCode: 200,
      statusText: 'Everything coming through as it should!'
    }
  } else {
    return {
      statusCode: 400,
      statusText: 'Something went wrong inside the han1Validator!'
    }
  }

}

function LSB(bin, lsb) {
  if (!!lsb) {
    return bin[bin.length - 1] === lsb;
  } else {
    return bin[bin.length - 1];
  }
}

function MSB(bin, msb) {
  if (!!msb) {
    return bin[0] === msb;
  } else {
    return bin[0];
  }
}

function bin2hex(bin, splitter) {
  let returned;
  const original = ''.concat(bin);
  let length = original.length;
  if (!!bin) {
    if (typeof bin === 'number') {
      bin = bin.toString();
    }

    if (length === 4) {
      bin = '0000'.concat(bin);
      returned = '0x0'.concat(parseInt(bin, 2).toString(16).toUpperCase());
      returned.length * 2
      let arr = new Uint8Array(1)
      return returned;
    } else if (length === 8) {
      returned = '0x0'.concat(bin.toUpperCase());
      return returned
    }
  }
}

module.exports = han1Validator;
