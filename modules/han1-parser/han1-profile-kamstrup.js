const han1Profile = require('./han1-profile');

class Kamstrup extends han1Profile {
  constructor(pack) {
    super()
    this.raw = pack;
    this.meter = {};
    this.meter.manufacturer = pack.manufacturer;
    this.listId = this.findListID(this.raw.data.main);
    this.dateTime = super.parseDate(this.raw.data.main);
    this.init(pack);

  }

  findListID(data) {
    let iStart = Array.from(data).map((byte, i, arr) => {
      if (Buffer.from(
          byte.toString(16), 'hex')
        .toString('utf8')
        .toLowerCase() == 'k' &&
        Buffer.from(
          arr[i + 1].toString(16), 'hex')
        .toString('utf8')
        .toLowerCase() == 'a') {
        return i;
      }
    }).filter(Boolean)[0];
    return data.readUInt8(iStart - 3)
  }

  async init(pack) {
    this.obis = await this.findObis();
    this.parseData();
  }

  async parseData() {
    let workData = this.raw.data.main;
    this.data = {}
    this.data.phases = {
      l1: {},
      l2: {},
      l3: {}
    };
    this.obis.map((c, idx, arr) => {
      let n, p, nStart, nEnd, pStart, pEnd, dataStart, dataEnd, obisCodeString, dataType, getData;
      obisCodeString = c[0];
      dataType = c[1];

      if (dataType === 'obisCodeValue') {
        getData = this.getObisCodeValue;
      }
      if (dataType === 'string') {
        getData = this.getString;
        if (obisCodeString === '0-1:1.0.0.255') {
          getData = this.getDate;
        }
      }
      if (dataType === '1byte') {
        getData = this.get1Byte;
      }
      if (dataType === 'int2bytes') {
        getData = this.getInt2Bytes;
      }
      if (dataType === 'int4bytes') {
        getData = this.getInt4Bytes;
      }

      if (this.listId === 25 || this.listId === 35) {
        if (arr[idx - 1]) {
          p = arr[idx - 1];
          pStart = (arr[idx - 1].length - 2);
          pEnd = (arr[idx - 1].length - 1);
        }
        if (arr[idx + 1]) {
          n = arr[idx + 1];
          nStart = (arr[idx + 1].length - 2);
          nEnd = (arr[idx + 1].length - 1);
          dataEnd = n[n.length - 2] - 1;
        } else {
          nStart = (workData.length);
          dataEnd = (workData.length);
        }
        dataStart = (c[(c.length - 1)] + 2);

        if (obisCodeString === '1-1:0.2.129.255') {
          // OBIS List version identifier.
          this.obisVListId = workData.slice(dataStart, dataEnd - 1).toString('utf8')
        }
        if (obisCodeString === '1-1:0.0.5.255') {
          // Meter ID (GIAI GS1 - 16digit)
          this.meter.id = getData(workData.slice(dataStart, dataEnd - 1))
          this.meter.serial = this.meter.id.slice(8, (this.meter.id.length - 1))
        }
        if (obisCodeString === '1-1:96.1.1.255') {
          // Meter Type.
          this.meter.type = getData(workData.slice(dataStart, dataEnd - 1))
        }
        if (obisCodeString === '1-1:1.7.0.255') {
          // Active Import Power + (P+)(Q1+Q4).

          this.data.activePowerPos = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:2.7.0.255') {
          // Active Export Power - (Q2+Q3).
          this.data.activePowerNeg = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:3.7.0.255') {
          // Reactive Power + (Q1+Q2).
          this.data.reactivePowerPos = getData(workData.slice(dataStart, dataEnd))
        }
        if (obisCodeString === '1-1:4.7.0.255') {
          // Reactive Power - (Q3+Q4).
          this.data.reactivePowerNeg = getData(workData.slice(dataStart, dataEnd))
        }
        if (obisCodeString === '1-1:31.7.0.255') {
          // IL1 Current phase L1.
          this.data.phases.l1.i = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:51.7.0.255') {
          // IL2 Current phase L2.
          this.data.phases.l2.i = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:71.7.0.255') {
          // IL3 Current phase L3.
          this.data.phases.l3.i = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:32.7.0.255') {
          // ULN1 Phase Voltage 4W Meter, Line voltage 3W meter L1.
          this.data.phases.l1.v = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:52.7.0.255') {
          // ULN2 Phase Voltage 4W Meter, Line voltage 3W meter L2
          this.data.phases.l2.v = getData(workData.slice(dataStart, dataEnd));
        }
        if (obisCodeString === '1-1:72.7.0.255') {
          // ULN3 Phase Voltage 4W Meter, Line voltage 3W meter L3.
          this.data.phases.l3.v = getData(workData.slice(dataStart, dataEnd));
        }
      }
      if (this.listId === 35) {
        if (obisCodeString === '0-1:1.0.0.255') {
          // Clock and date in meter!
          this.meter.datetime = getData(workData.slice(dataStart, dataEnd))
        }
        if (obisCodeString === '1-1:1.8.0.255') {
          // Cumulative hourly active import energy (A+) (Q1+Q4).
          this.data.chaie = getData(workData.slice(dataStart, dataEnd))
        }
        if (obisCodeString === '1-1:2.8.0.255') {
          // Cumulative hourly active export energy (A-) (Q2+Q3).
          this.data.chaee = getData(workData.slice(dataStart, dataEnd))
        }
        if (obisCodeString === '1-1:3.8.0.255') {
          // Cumulative hourly reactive import energy (R+) (Q1+Q2).
          this.data.chrie = getData(workData.slice(dataStart, dataEnd))
        }
        if (obisCodeString === '1-1:4.8.0.255') {
          // Cumulative hourly reactive export energy (R-) (Q3+Q4).
          this.data.chree = getData(workData.slice(dataStart, dataEnd))
        }
      }
    })
    return
  }

  async findObis() {
    const obis = [];
    Array.from(this.raw.data.main).map((int, idx, arr) => {
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
          obis.push([ /*arr[idx - 5], arr[idx - 4], arr[idx - 3], arr[idx - 2], arr[idx - 1], arr[idx],*/ string, dataType, idx - 5, idx]);
        }
      }
    })
    return obis;
  }

  getObisCodeValue(sliced) {
    return sliced.toString('utf8');
  }

  getString(sliced) {
    return sliced.toString('utf8');
  }

  get1Byte(sliced) {
    return sliced.readUInt8(0);
  }

  getInt2Bytes(sliced) {
    return sliced.readUInt16BE(0);
  }

  getInt4Bytes(sliced) {
    return sliced.readUInt32BE(0);
  }

  getDate(sliced) {
    let y, m, d, wd, h, min, sec, ctrlChar, rest;
    ctrlChar = sliced.readUInt8(0)
    y = sliced.readUInt16BE(1);
    m = sliced.readUInt8(3) - 1;
    d = sliced.readUInt8(4);
    h = sliced.readUInt8(6);
    min = sliced.readUInt8(7);
    sec = sliced.readUInt8(8);
    // @TODO: Figure out rest. (have a feeling that its the timezone "ff800000");
    rest = sliced.slice(8, sliced.length);
    return new Date(y, m, d, h, min, sec);
  }

}

module.exports = Kamstrup;
