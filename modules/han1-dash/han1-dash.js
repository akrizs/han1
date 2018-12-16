const path = require('path');
const express = require('express');
const han1Dash = express();
const http = require('http').Server(han1Dash);
const io = require('socket.io')(http);

const port = 3000;

han1Dash.use(express.static(__dirname + '/dash'));
han1Dash.use(express.static(__dirname + '/dash/assets'));

han1Dash.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dash', 'views.9661ef0e.html'))
})

han1Dash.get('/graph', (req, res) => {
  res.sendFile(path.join(__dirname, 'dash', 'views.9661ef0e.html'))
})

han1Dash.get('/debug', (req, res) => {
  res.sendFile(path.join(__dirname, 'dash', 'debug.1c4e6360.html'))
})

han1Dash.get('/api', (req, res) => {
  // The RESTapi route!
  res.json({
    Hello: 'Here the data will arrive!'
  })
})

io.on('connection', function (socket) {
  console.log('a user connected');
  if (process.env.debug == 'true') {
    console.log(socket.connected);
  }
});

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});

module.exports = {
  han1Dash,
  io
};
