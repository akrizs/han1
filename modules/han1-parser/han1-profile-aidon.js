const han1Profile = require('./han1-profile').han1Profile;

class Aidon extends han1Profile {
  constructor({
    data,
    ctrl,
    addr
  }) {
    super({
      data,
      listID: ctrl.listID,
      manufacturer: ctrl.manufacturer,
      frameSize: ctrl.frameSize
    })

    this.init()
  }

  async init() {
    super.parseObis().then((data) => {
      return this.obis = data;
    }).then(() => {
      return this.parseData()
    }).catch((err) => {
      if (err) console.log(err);
    });
  }

  parseData() {
    let obisPadd = 10;

    this.obis.forEach(obis => {
      let data, parsedData, variable;

      data = obis.rawData.data.slice(obisPadd + obis.padding, obisPadd + obis.padding + obis.mainData.dataLength);

      parsedData = this.getData(obis.mainData.dataType, data, obis.string);

      if (obis.exponent) {
        parsedData = (parsedData * Math.pow(10, obis.exponent))
      }

      variable = super.findDataName(obis.string, 'var');
      // Inside the phases!
      if (/((?:(?:1|0)-(?:1|0)):(?:3(?:1|2)|5(?:1|2)|7(?:1|2))(?:\.(?:7)\.(?:0)\.255))/gi.test(obis.string)) {
        super.handlePhaseObjects.call(this, obis.string, parsedData, obis.unit, variable)
      } else if (/((?:(?:1|0)-(?:1|0)):(?:0|1|96)(?:\.(?:0|1|2)\.(?:0|129|7)\.255))/gi.test(obis.string)) {
        this.data[variable] = parsedData;
      } else {
        this.data[variable] = {
          value: parsedData,
          unit: obis.unit
        }
      }
    });
    if (this.listID !== 1) {
      this.data.meterSerial = this.data.meterId.substring(this.data.meterId.length - 9, this.data.meterId.length - 1);
    }
    if (this.listID !== 3) {
      if (!this.time) {
        this.data.time = Date.now();
      }
    }
  }

  getData(type, data, id) {
    if (type === 'visible-string') {
      return super.getVisibleString(data);
    } else if (type === 'double-long-unsigned') {
      return super.getDoubleLongUnsigned(data);
    } else if (type === 'long') {
      return super.getLong(data);
    } else if (type === 'long-unsigned') {
      return super.getLongUnsigned(data);
    } else if (type === 'octet-string') {
      return super.getOctetString(data, id);
    }
  }

}

/**
 * AIDON Datatypes:
 * visible-string
 * double-long-unsigned
 * long
 * long-unsigned
 * octet-string
 */



module.exports = Aidon;
