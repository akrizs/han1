const express = require('express');
const han1InitSetup = express.Router();
const han1SerialScanner = require('./han1Serialscanner.js');

han1InitSetup.get('/', (req, res) => {
  console.log(req)

  res.json({
    Status: 'Everything running in initiation!'
  })
})

module.exports = han1InitSetup;
