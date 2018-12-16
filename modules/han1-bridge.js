// Require demodata for dev.
const demodata = require('../demodata/demodata');
// Require Hexy
const {
  hexy
} = require('hexy');
// Require the validator!
const han1Validator = require('./han1-validator');
// Require the parser!
const han1Parser = require('./han1-parser/han1-parser');
// Require the io socket connection!
const {
  io
} = require('./han1-dash/han1-dash');



async function han1Bridge(data) {
  const validated = await han1Validator(data);
  // const validated = await han1Validator(demodata.kamstrup.second);

  let hexified = hexy(validated.data.main, {
    width: 16,
    numbering: 'none',
    caps: 'upper',
    format: 'twos'
  });
  console.log(hexified);

  const parsed = await han1Parser(validated)

  io.emit('meterData', parsed);
}

module.exports = han1Bridge;
