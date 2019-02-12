const path = require('path');
const express = require('express');
const han1Dash = express();

const han1Settings = require('./han1-settings.js');
const han1RestApi = require('./han1-restapi.js');

const fs = require('fs');

const _filenames = {}

fs.readdir(path.join(__dirname + '/dash'), (err, fn) => {
  fn.map(f => {
    f.match(/^(debug\.)(.*)(\.html)/gi) ? _filenames.debug = f : '';
    f.match(/^(views\.)(.*)(\.html)/gi) ? _filenames.index = f : '';
    f.match(/^(setup\.)(.*)(\.html)/gi) ? _filenames.setup = f : '';
    f.match(/^(settings\.)(.*)(\.html)/gi) ? _filenames.settings = f : '';
    f.match(/^(graph\.)(.*)(\.html)/gi) ? _filenames.graph = f : '';
  })
})

han1Dash.use(express.static(__dirname + '/dash'));
han1Dash.use(express.static(__dirname + '/dash/assets'));

// if (process.cfg.dash.protect) {
// Set some kind of authentication method.
// }

han1Dash.use('/settings', han1Settings)
han1Dash.use('/api', han1RestApi);

han1Dash.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dash', _filenames.index))
})

han1Dash.get('/graph', (req, res) => {
  // Find all stored data and create graphs out of them.
  res.sendFile(path.join(__dirname, 'dash', _filenames.graph))
})

if (process.cfg.debug) {
  han1Dash.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, 'dash', _filenames.debug))
  })
}

module.exports = han1Dash;
