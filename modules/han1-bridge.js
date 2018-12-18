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
  io
} = require('./han1-dash/han1-dash');



async function han1Bridge(data) {
  // data = demodata.kamstrup.second
  const validated = await han1Validator(data);
  const parsed = await han1Parser(validated)

  io.emit('meterData', parsed);

  if (process.cfg.debug) {
    han1Debug(data, parsed)
  }

}

module.exports = han1Bridge;
