const Kamstrup = require('./han1-profile-kamstrup')
const Kaifa = require('./han1-profile-kaifa')
const Aidon = require('./han1-profile-aidon')

async function han1Parser(pack) {
  if (pack.manufacturer === 'kamstrup') {
    return new Kamstrup(pack)
  } else if (pack.manufacturer === 'aidon') {
    return new Aidon(pack)
  } else if (pack.manufacturer === 'kaifa') {
    return new Kaifa(pack)
  } else {
    return {
      statusCode: 400,
      statusText: 'Some issues in the parser!'
    }
  }
};

module.exports = han1Parser
