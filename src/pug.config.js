let version = require('../package.json').version;

console.log(version);

module.exports = {
  locals: {
    scriptTags: {
      io: 'http://scramblebamble.let/socket.io/socket.io.js'
    },
    title: `Han1`,
    version: version
  }
}
