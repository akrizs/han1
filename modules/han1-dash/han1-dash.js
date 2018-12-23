const path = require('path');
const express = require('express');
const han1Dash = express();
const http = require('http').Server(han1Dash);
const io = require('socket.io')(http);

const port = process.cfg.dash.port || 3000;

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
//   // Set some kind of authentication method.
// }

if (process.cfg.firstStart) {
  han1Dash.get('*', (req, res) => {
    // Setup
    res.sendFile(path.join(__dirname, 'dash', _filenames.setup))
  })
}

han1Dash.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dash', _filenames.index))
})

han1Dash.get('/graph', (req, res) => {
  // Find all stored data and create graphs out of them.
  res.sendFile(path.join(__dirname, 'dash', _filenames.graph))
})

han1Dash.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'dash', _filenames.settings))
})

if (process.cfg.debug) {
  han1Dash.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, 'dash', _filenames.debug))
  })
}
han1Dash.get('/api', (req, res) => {
  // The RESTapi route!
  res.json({
    Hello: 'Here the data will arrive!'
  })
})

const mainWeb = io.of('/main');

mainWeb.on('connection', function (socket) {
  if (process.cfg.debug) {
    console.log('a user connected');
    console.log(socket.connected);
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  }
});

const dbgWeb = io.of('/debug');
if (process.cfg.debug) {
  dbgWeb.on('connection', (socket) => {
    console.log('A user connected to debug');
  })
}

http.listen(port, function () {
  if (process.cfg.debug) {
    console.log(`listening on *:${port}`);
  }
});

module.exports = {
  han1Dash,
  mainWeb,
  dbgWeb
};
