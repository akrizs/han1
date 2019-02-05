const express = require('express')
const han1Settings = express.Router();
const path = require('path');

const han1SerialScanner = require('../han1-serialscanner.js');
const {
  settingsSocket
} = require('./han1-sockets');

han1Settings.get('/', async (req, res) => {
  let serialPorts = await han1SerialScanner()

  res.send(serialPorts);
})



module.exports = han1Settings;
