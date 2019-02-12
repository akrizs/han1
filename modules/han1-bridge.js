// Require demodata for dev.
const demodata = require('../demodata/demodata');
// Require the validator!
const han1Validator = require('./han1-validator').han1Validator;
// Require the parser!
const han1Parser = require('./han1-parser/han1-parser');
// Require the debugTool
const han1Debug = require('./han1-dash/han1-debug');
// Require the io socket connection!
const {
  mainSocket
} = require('./han1-dash/han1-sockets');
const han1Error = require('./han1-dash/han1-error')
const han1Tibber = require('./han1-tibber/han1-tibber');
let lastPrice;
let date = new Date();

async function han1Bridge(data) {
  try {
    const package = {};
    let fullHour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    data = demodata.aidon.second;
    const validated = await han1Validator(data);


    if (validated) {
      package.parsed = await han1Parser(data)
    } else {
      throw new Error('Package did not pass validation!')
    }

    if (process.cfg.addons.han1Tibber.active) {
      if (!lastPrice || fullHour === '00') {
        package.lastPrice = await han1Tibber.getPrice();
      }
    }

    let main = {
      clientDate: package.parsed.clientDate,
      data: package.parsed.data,
      frameSize: package.parsed.frameSize,
      listID: package.parsed.listID,
      manufacturer: package.parsed.manufacturer
    }

    mainSocket.emit('meterData', main, package.lastPrice);

    if (process.cfg.debug) {
      han1Debug(data, package.parsed, package.lastPrice);
    }

  } catch (e) {
    han1Error(e);
  }


}

module.exports = han1Bridge;
