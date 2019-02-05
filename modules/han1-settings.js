const path = require('path');
const han1SerialScanner = require('../han1-serialscanner');
const {
  settingsSocket
} = require('./han1-sockets');

async function getHan1Settings(req, res) {
  const availableSerialPorts = await han1SerialScanner()


  res.send(availableSerialPorts)
}

function setHan1Settings(req, res) {

}



module.exports = {
  setHan1Settings,
  getHan1Settings
};
