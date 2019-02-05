const express = require('express');
const han1RestAPI = express.Router();

han1RestAPI.get('/', (req, res) => {
  res.json({
    Status: 'Everything coming through okay!'
  })
})

module.exports = han1RestAPI
