const han1Profile = require('./han1-profile').han1Profile;

class Kaifa extends han1Profile {
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

    this.init();
  }

  async init() {
    this.obis = await super.parseObis();

    // this.parseData();
  }
}

module.exports = Kaifa;
