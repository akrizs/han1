var int64LE = require("int64-buffer").Int64LE;
const {
  hexy
} = require('hexy');

class han1Profile {
  constructor({
    data,
    listID,
    manufacturer,
    frameSize
  }) {
    this.rawData = data;
    this.listID = listID;
    this.manufacturer = manufacturer;
    this.frameSize = frameSize;
    this.clientDate = Date.now();
    this.data = {};
  }

  async parseObis() {
    let obis = Array.from(this.rawData.main).map((byte, idx, arr) => {
      let a, b, c, d, e, f, dataStart, obisStart, obisEnd, noEl;

      if (byte === 0xFF) {
        // 0x01 stands for Electronics 0x00 for general
        a = idx - 5
        b = idx - 4
        c = idx - 3
        d = idx - 2
        e = idx - 1
        f = idx
        dataStart = f + 1
        if (arr[a] === 0x01 && arr[b] === 0x00 ||
          arr[a] === 0x00 && arr[b] === 0x01 ||
          arr[a] === 0x00 && arr[b] === 0x00 ||
          arr[a] === 0x01 && arr[b] === 0x01) {
          if (arr[a - 2] === 0x09 && arr[a - 1] === 0x06) {
            // Then we know its an octet string(9) with the length of 6(0:0-0.0.0.0 = OBIS).
            // Damn you kamstrup

            let {
              dataType,
              dataLength,
              padding
            } = findDataType(arr[f + 1], arr[f + 2]);

            let string = `${arr[a]}-${arr[b]}:${arr[c]}.${arr[d]}.${arr[e]}.${arr[f]}`;
            // Damn you kamstrup
            if (this.manufacturer === 'kamstrup') {
              obisStart = a - 2
              obisEnd = f
            } else {
              obisStart = a - 4
              obisEnd = f
            }

            if (this.manufacturer !== 'kamstrup') {
              noEl = arr[obisStart + 1];
            }

            return {
              string,
              noElements: noEl,
              mainData: {
                dataType,
                dataLength
              },
              padding,
              obisStart,
              obisEnd
            }
          }
        }
      }
    }).filter(Boolean);

    obis = obis.map((O, idx, arr) => {
      O.dataStart = (O.obisEnd + 1) + O.padding;
      if (arr[idx + 1]) {
        // At the last obis group.
        O.dataEnd = arr[idx + 1].obisStart
      } else {
        O.dataEnd = this.rawData.main.length;
      }
      O.rawData = {
        data: this.rawData.main.slice(O.obisStart, O.dataEnd),
        l: this.rawData.main.slice(O.obisStart, O.dataEnd).length
      };
      // The object has more than 1 data (2x = OBIS code and data)
      if (O.noElements > 2) {
        O.altData = []
        let endOfMainData = O.dataStart + O.mainData.dataLength
        let typeLength = this.findDataType(this.rawData.main[endOfMainData], this.rawData.main[endOfMainData + 1])
        let leftOvers = this.rawData.main.slice(endOfMainData, O.dataEnd)
        if (typeLength.dataType === 'structure' || typeLength.dataType === 'array') {
          leftOvers = leftOvers.slice(typeLength.padding, leftOvers.length);
          let eachSize = leftOvers.length / typeLength.dataLength;
          let padder = eachSize;
          for (let i = 0; i < typeLength.dataLength; i++) {

            let data, start, dataInfo;
            if (eachSize === padder) {
              start = 0
              data = leftOvers.slice(start, padder);
            } else {
              start = eachSize
              data = leftOvers.slice(start, padder)
              start += eachSize;
            }
            padder += eachSize;

            dataInfo = this.findDataType(data[0], data[1]);
            if (dataInfo.dataType === 'enum') {
              // There is an enumerator for physical units, go get it!
              O.unit = this.findUnit(data[1])
            } else if (dataInfo.dataType === 'integer') {
              // Guess its an exponent for the multiplication.
              O.exponent = data.slice(1).readInt8(0)
            }
            O.altData.push(dataInfo);
          }
        }
      }

      if (this.manufacturer === 'kamstrup') {
        O.unit = this.findUnit(O.string);
      }

      O.description = this.findDataName(O.string, 'desc');
      return O
    })

    return obis;
  }

  findUnit(byte) {
    return findUnit(byte);
  }

  findDataName(obis, pick) {
    return findDataName(obis, pick);
  }

  findDataType(byte, length) {
    return findDataType(byte, length)
  }

  getVisibleString(data) {
    return data.toString();
  }

  getDoubleLongUnsigned(data) {
    return data.readUInt32BE(0);
  }

  getLong(data) {
    return data.readInt16BE(0);
  }

  getLongUnsigned(data) {
    return data.readUInt16BE(0);
  }

  getOctetString(data, id) {
    if (id === '0-0:1.0.0.255' || id === '0-1:1.0.0.255') {
      return this.getDate(data);
    } else {
      return
    }
  }

  getDate(data) {
    let y, m, d, wd, h, min, s;
    y = data.readUInt16BE(0)
    m = data.readUInt8(2) - 1;
    d = data.readUInt8(3);
    wd = data.readUInt8(4);
    h = data.readUInt8(5);
    min = data.readUInt8(6);
    s = data.readUInt8(7);
    /** 
     *  The rest of the bytes is a defintion on the clock state
     *  and the timezone the clock is set to, 
     *  (Currently not in use in Norway)
     * */

    /** 
     * @NOTE: DLMS Blue Book 4.1.6.1 Date and time Formats
     * deviation: Interpreted as long;
     *            range -720 -> +720 in minutes of local time to UTC
     *            0x8000 = not specified
     * clock_status: interpreted as unsigned. the bits are 
     *               defined as follows:
     * bit 0(LSB): invalid value,
     * bit 1:      doubtful value
     * bit 2:      different clock base
     * bit 3:      invalid clock status
     * bit 4:      reserved
     * bit 5:      reserved
     * bit 6:      reserved
     * bit 7(MSB): daylight saving active
     * */

    return new Date(y, m, d, h, min, s).getTime();
  }

  handlePhaseObjects(obis, data, unit, variable) {
    return handlePhaseObjects.call(this, obis, data, unit, variable)
  }
}

function findUnit(byte) {
  let isObisString;
  if (/((?:\d{1}-\d{1}):(?:\d{1,2})(?:\.(?:\d{1})\.(?:\d{1,3})\.255))/gi.test(byte)) {
    isObisString = true;
  }
  if (!isObisString) {
    if (byte === 0x1B) {
      return 'W';
    }
    if (byte === 0x1D) {
      return 'VAr';
    }
    if (byte === 0x1E) {
      return 'Wh';
    }
    if (byte === 0x20) {
      return 'VArh';
    }
    if (byte === 0x21) {
      return 'A';
    }
    if (byte === 0x23) {
      return 'V';
    }
  } else if (isObisString) {
    if (/((?:(?:1)-(?:1|0)):(?:1|2)(?:\.(?:7)\.(?:0)\.255))/gi.test(byte)) {
      return 'W';
    }
    if (/((?:(?:1)-(?:1|0)):(?:3|4)(?:\.(?:7)\.(?:0)\.255))/gi.test(byte)) {
      return 'VAr';
    }
    if (/((?:(?:1)-(?:1|0)):(?:1|2)(?:\.(?:8)\.(?:0)\.255))/gi.test(byte)) {
      return 'Wh';
    }
    if (/((?:(?:1)-(?:1|0)):(?:3|4)(?:\.(?:8)\.(?:0)\.255))/gi.test(byte)) {
      return 'VArh';
    }
    if (/((?:(?:1)-(?:1|0)):(?:31|51|71)(?:\.(?:7)\.(?:0)\.255))/gi.test(byte)) {
      return 'A';
    }
    if (/((?:(?:1)-(?:1|0)):(?:32|52|72)(?:\.(?:7)\.(?:0)\.255))/gi.test(byte)) {
      return 'V';
    }
  }


  return null;

}

function kamstrupFindUnit(byte) {

}

function findDataName(obis, pick) {

  if (/((?:(?:1|0)-(?:1|0)):(?:0)(?:\.(?:2)\.(?:129)\.255))/gi.test(obis)) {

    if (pick === 'desc') {
      return 'Obis List Version Identifier'
    } else if (pick === 'var') {
      return 'oli'
    }
  } else
  if (/((?:(?:1|0)-(?:1|0)):(?:0|96)(?:\.(?:0|1)\.(?:0|5)\.255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Meter ID (GIAI GS1 16 Digit)'
    } else if (pick === 'var') {
      return 'meterId'
    }
  } else
  if (/((?:1|0)-(?:1|0):(?:96)\.(?:1)\.(?:1|7)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Meter Type'
    } else if (pick === 'var') {
      return 'meterType'
    }
  } else
  if (/((?:1)-(?:1|0):(?:1)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Active Power + (Q1+Q4)'
    } else if (pick === 'var') {
      return 'aPowPlus'
    }
  } else
  if (/((?:1)-(?:1|0):(?:2)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Active Power - (Q2+Q3)'
    } else if (pick === 'var') {
      return 'aPowNeg'
    }
  } else
  if (/((?:1)-(?:1|0):(?:3)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Reactive Power + (Q1+Q2)'
    } else if (pick === 'var') {
      return 'rPowPlus'
    }
  } else
  if (/((?:1)-(?:1|0):(?:4)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Reactive Power - (Q3-Q4)'
    } else if (pick === 'var') {
      return 'rPowNeg'
    }
  } else
  if (/((?:1)-(?:1|0):(?:31)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'IL1 Current Phase L1'
    } else if (pick === 'var') {
      return 'i'
    }
  } else
  if (/((?:1)-(?:1|0):(?:51)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'IL2 Current Phase L2'
    } else if (pick === 'var') {
      return 'i'
    }
  } else
  if (/((?:1)-(?:1|0):(?:71)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'IL3 Current Phase L3'
    } else if (pick === 'var') {
      return 'i'
    }
  } else
  if (/((?:1)-(?:1|0):(?:32)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'ULN1 Phase Voltage 4W meter, Line voltage 3W meter.'
    } else if (pick === 'var') {
      return 'v'
    }
  } else
  if (/((?:1)-(?:1|0):(?:52)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'ULN2 Phase Voltage 4W meter, Line voltage 3W meter.'
    } else if (pick === 'var') {
      return 'v'
    }
  } else
  if (/((?:1)-(?:1|0):(?:72)\.(?:7)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'ULN3 Phase Voltage 4W meter, Line voltage 3W meter.'
    } else if (pick === 'var') {
      return 'v'
    }
  } else
  if (/((?:0)-(?:1|0):(?:1)\.(?:0)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Clock and Date in meter'
    } else if (pick === 'var') {
      return 'time'
    }
  } else
  if (/((?:1)-(?:1|0):(?:1)\.(?:8)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Cumulative hourly active import energy (A+)(Q1+Q4)'
    } else if (pick === 'var') {
      return 'cHAI'
    }
  } else
  if (/((?:1)-(?:1|0):(?:2)\.(?:8)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Cumulative hourly active export energy (A-)(Q2+Q3)'
    } else if (pick === 'var') {
      return 'cHAE'
    }
  } else
  if (/((?:1)-(?:1|0):(?:3)\.(?:8)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Cumulative hourly reactive import energy (R+)(Q1+Q2)'
    } else if (pick === 'var') {
      return 'cHRI'
    }
  } else
  if (/((?:1)-(?:1|0):(?:4)\.(?:8)\.(?:0)\.(?:255))/gi.test(obis)) {
    if (pick === 'desc') {
      return 'Cumulative hourly reactive export energy (R-)(Q3+Q4)'
    } else if (pick === 'var') {
      return 'cHRE'
    }
  }
  return null;
}

function findDataType(byte, length) {
  if (byte === 0x00) {
    // Tag 0 -> null-data
    return {
      dataType: 'null-data',
      dataLength: null,
      padding: 1
    }
  }
  if (byte === 0x01) {
    // Tag 1 -> The elements of the array are defined in the Attribute or Method description section of a COSEM IC spec.
    return {
      dataType: 'array',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x02) {
    // Tag 2 -> The elements of the structure are defined in the Attribute of Method Descr. section of a COSEM IC spec.
    return {
      dataType: 'structure',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x03) {
    // Tag 3 -> true || false
    return {
      dataType: 'boolean',
      dataLength: null,
      padding: 1
    }
  }
  if (byte === 0x04) {
    // Tag 4 -> and ordered sequence of boolean values
    return {
      dataType: 'bit-string',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x05) {
    // Tag 5 -> double-long 32 (4bytes)(-0+)
    return {
      dataType: 'double-long',
      dataLength: 4,
      padding: 1
    }
  }
  if (byte === 0x06) {
    // Tag 6 -> double-long unsigned 32 (4bytes)(0+)
    return {
      dataType: 'double-long-unsigned',
      dataLength: 4,
      padding: 1
    }
  }
  if (byte === 0x09) {
    // Tag 9 -> octet-string
    return {
      dataType: 'octet-string',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x0A) {
    // Tag 10 -> visible-string
    return {
      dataType: 'visible-string',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x0C) {
    // Tag 12 -> utf8-string
    return {
      dataType: 'utf8-string',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x0D) {
    // Tag 13 -> binary-coded-decimal
    return {
      dataType: 'binary-coded-decimal',
      dataLength: null,
      padding: 1
    }
  }
  if (byte === 0x0F) {
    // Tag 15 -> Integer 8 (1byte) (-0+)
    return {
      dataType: 'integer',
      dataLength: 1,
      padding: 1
    }
  }
  if (byte === 0x10) {
    // Tag 16 -> Integer 16 (2bytes) (-0+)
    return {
      dataType: 'long',
      dataLength: 2,
      padding: 1
    }
  }
  if (byte === 0x11) {
    // Tag 17 -> Unsigned 8 (1byte) (0+)
    return {
      dataType: 'unsigned',
      dataLength: 1,
      padding: 1
    }
  }
  if (byte === 0x12) {
    // Tag 18 -> Unsigned 16 (2bytes)(0+)
    return {
      dataType: 'long-unsigned',
      dataLength: 2,
      padding: 1
    }
  }
  if (byte === 0x13) {
    // Tag 19 -> Provides and alternative, compact encoding of complex data.
    return {
      dataType: 'compact-array',
      dataLength: length,
      padding: 2
    }
  }
  if (byte === 0x14) {
    // Tag 20 -> Integer 64 (8bytes)(-0+)
    return {
      dataType: 'long64',
      dataLength: 8,
      padding: 1
    }
  }
  if (byte === 0x15) {
    // Tag 21 -> Unsigned 64 (8bytes)(0+)
    return {
      dataType: 'unsigned64',
      dataLength: 8,
      padding: 1
    }
  }
  if (byte === 0x16) {
    // Tag 22 -> enumerator, The elements of the enumeration type are defined in the Attr. desc. or Method desc. section of a COSEM IC spec.
    return {
      dataType: 'enum',
      dataLength: 1,
      padding: 1
    }
  }
  if (byte === 0x17) {
    // Tag 23 -> octet-string(size(4))
    return {
      dataType: 'float32',
      dataLength: 4,
      padding: 1
    }
  }
  if (byte === 0x18) {
    // Tag 24 -> octet-string(size(8))
    return {
      dataType: 'float64',
      dataLength: 8,
      padding: 1
    }
  }
  if (byte === 0x19) {
    // Tag 25 -> octet-string(size(12))
    return {
      dataType: 'date-time',
      dataLength: 12,
      padding: 1
    }
  }
  if (byte === 0x1A) {
    // Tag 26 -> octet-string(size(5))
    return {
      dataType: 'date',
      dataLength: 5,
      padding: 1
    }
  }
  if (byte === 0x1B) {
    // Tag 27 -> octet-string(size(4))
    return {
      dataType: 'time',
      dataLength: 4,
      padding: 1
    }
  }

  return {
    dataType: '',
    dataLength: null,
    padding: 0
  };
}

function handlePhaseObjects(obis, data, unit, variable) {
  if (this.manufacturer !== 'kamstrup') {
    if (/((?:(?:1|0)-(?:1|0)):(?:31|51|71)(?:\.(?:7)\.(?:0)\.255))/gi.test(obis.string)) {
      // Current objects
      data = data.toFixed(2);
    } else {
      data = data.toFixed(1);
    }
  }
  if (!this.data.phases) {
    this.data.phases = {};
  }

  if (/((?:(?:1|0)-(?:1|0)):(?:3(?:1|2))(?:\.(?:7)\.(?:0)\.255))/gi.test(obis)) {
    // L1, phase 1
    if (!this.data.phases.l1) {
      this.data.phases.l1 = {};
    }
    this.data.phases.l1[variable] = {
      value: data,
      unit: unit
    }
  }
  if (/((?:(?:1|0)-(?:1|0)):(?:5(?:1|2))(?:\.(?:7)\.(?:0)\.255))/gi.test(obis)) {
    // L2, phase 2
    if (!this.data.phases.l2) {
      this.data.phases.l2 = {};
    }
    this.data.phases.l2[variable] = {
      value: data,
      unit: unit
    }
  }
  if (/((?:(?:1|0)-(?:1|0)):(?:7(?:1|2))(?:\.(?:7)\.(?:0)\.255))/gi.test(obis)) {
    // L3, Phase 3
    if (!this.data.phases.l3) {
      this.data.phases.l3 = {};
    }
    this.data.phases.l3[variable] = {
      value: data,
      unit: unit
    }
  }
  return
}


module.exports = {
  han1Profile,
  findDataType
};
