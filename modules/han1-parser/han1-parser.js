const Kamstrup = require('./han1-profile-kamstrup')
const Kaifa = require('./han1-profile-kaifa')
const Aidon = require('./han1-profile-aidon')

async function han1Parser(buffer) {
  buffer = Buffer.from(buffer, 'base64')
  let listID, manufacturer, elementsCount;
  const data = {}
  const buffArr = Array.from(buffer);
  const buffStr = buffer.toString();

  const headerEnd = buffArr.map((byte, i, arr) => {
    if (byte === 0xE6 && arr[i + 1] === 0xE7 && arr[i + 2] === 0x00 || byte === 0xE6 && arr[i + 1] === 0xE6 && arr[i + 2] === 0x00) {
      return i
    } else {
      return false
    }
  }).filter(Boolean)[0];

  const obis = buffArr.map((int, i, arr) => {
    if (int === 0xff) {
      if (arr[i - 5] === 0x00 && arr[i - 4] === 0x00 ||
        arr[i - 5] === 0x01 && arr[i - 4] === 0x01 ||
        arr[i - 5] === 0x01 && arr[i - 4] === 0x00 ||
        arr[i - 5] === 0x00 && arr[i - 4] === 0x01) {
        return [`${arr[i - 5]}-${arr[i - 4]}:${arr[i - 3]}.${arr[i - 2]}.${arr[i - 1]}.${arr[i]}`, i - 7]
      }
    }
  }).filter(Boolean);

  // Try to figure out manufacturer by the version id string!
  if (buffStr.includes('Kamstrup')) {
    manufacturer = 'kamstrup';
    process.cfg.meter.manufacturer = 'kamstrup';
  } else if (buffStr.includes('KFM')) {
    manufacturer = 'kaifa';
    process.cfg.meter.manufacturer = 'kaifa';
  } else if (buffStr.includes('AIDON')) {
    manufacturer = 'aidon';
    process.cfg.meter.manufacturer = 'aidon';
  } else {
    // If its not set then just use the last found manufacturer or the one set by config (List 1);
    manufacturer = process.cfg.meter.manufacturer;
  }

  data.header = buffer.slice(0, headerEnd);
  if (manufacturer === 'kamstrup') {
    data.start = buffer.slice(headerEnd, obis[0][1]);
    data.main = buffer.slice(obis[0][1], buffer.length - 3);
  } else {
    data.start = buffer.slice(headerEnd, obis[0][1] - 4);
    data.main = buffer.slice(obis[0][1] - 4, buffer.length - 3);
  }

  data.end = buffer.slice(buffer.length - 3, buffer.length)

  elementsCount = buffer.slice(obis[0][1] - 3, obis[0][1] - 2).readUInt8(0);

  // Temporary fix until kamstrup manages to pull up their pants and follow the standard!
  // ElementCount defined by the "Norwegian standard"!
  if (elementsCount !== 1 || elementsCount !== 12 || elementsCount !== 18) {
    elementsCount = obis.length;
  }

  switch (elementsCount) {
    // Kamstrup's are delivering 12 elements in list 2.
    case 12:
      listID = 2;
      break;
    case 13:
      listID = 2;
      break;
      // Kamstrup's are delivering 17 elements in list 3.
    case 17:
      listID = 3
      break;
    case 18:
      listID = 3
      break;
      // Kamstrup's aren't delivering list 1.
    default:
    case 1:
      listID = 1;
      break;
  }

  const addr = {
    dest: (buffer.readUInt8(3)).toString(16)[0],
    source: (buffer.readUInt8(4)).toString(16)[0],
    LSAP: {
      dest: [data.start[0].toString(2), data.start.readUInt8(0)],
      source: [data.start[1].toString(2), data.start.readUInt8(1)],
      type: LSB(data.start[1].toString(2), 1) ? 'command' : 'response'
    },
    // llcQuality - Reserved for later use.
    llcQuality: data.main[2].toString(16)
  }

  const ctrl = {
    frameFormat: ('0x' + buffer.slice(1, 2).toString('hex')) >> 4 === 10 ? 3 : 'Unknown',
    frameSize: ((buffer.readUInt8(1) & 0x0F) << 8) | buffer.readUInt8(2),
    fsef: [buffer.slice(0, 1).toString('hex'), buffer.slice(buffer.length - 1, buffer.length).toString('hex')],
    ctrlField: ('0x' + buffer.slice(5, 6).toString('hex')) & 0x0F,
    fcs: swap16('0x' + (buffer.slice(buffer.length - 3, buffer.length - 1).toString('hex'))).toString(16),
    listID,
    elementsCount,
    hasObis: obis.length > 0,
    manufacturer
  }
  ctrl.fullFrame = ctrl.frameSize + ctrl.fsef.length === buffer.length;

  if (manufacturer === 'kamstrup') {
    return new Kamstrup({
      data,
      ctrl,
      addr
    })
  } else if (manufacturer === 'aidon') {
    return new Aidon({
      data,
      ctrl,
      addr
    })
  } else if (manufacturer === 'kaifa') {
    return new Kaifa({
      data,
      ctrl,
      addr
    })
  } else {
    return {
      statusCode: 400,
      statusText: "Couldn't figure out the manufacturer of the meter!"
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

function swap16(val) {
  return ((val & 0xFF) << 8) |
    ((val >> 8) & 0xFF);
}
module.exports = han1Parser
