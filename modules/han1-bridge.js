// Require demodata for dev.
const demodata = require('../demodata/demodata');
// Require the validator!
const han1Validator = require('./han1-validator');
// Require the parser!
const han1Parser = require('./han1-parser/han1-parser');
// Require the debugTool
const han1Debug = require('./han1-debug');
// Require the io socket connection!
const {
  mainWeb
} = require('./han1-dash/han1-dash');

const han1Tibber = require('./han1-tibber/han1-tibber');

let lastPrice;

let date = new Date();


async function han1Bridge(data) {
  let fullHour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  // data = demodata.kamstrup.second
  const validated = await han1Validator(data);
  const parsed = await han1Parser(validated)
  if (process.cfg.addons.han1Tibber.active) {
    if (!lastPrice || fullHour === '00') {
      lastPrice = await han1Tibber.getPrice();
    }
  }
  mainWeb.emit('meterData', parsed);

  if (process.cfg.debug) {
    han1Debug(data, parsed, lastPrice);
  }

}

module.exports = han1Bridge;
