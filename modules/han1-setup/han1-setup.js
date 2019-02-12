const path = require('path');
const express = require('express');
const han1Setup = express();
const han1SerialScanner = require('../han1-serialscanner');
const han1Process = require('./han1-setupProcess')

const han1SetupServer = require('http').Server(han1Setup);
const io = require('socket.io')(han1SetupServer)
const getIp = require('./han1-getIpAddress');

const defaultConfig = require('../han1-default-config');
const saveFolder = path.join(__dirname, '../..')
const templateFolder = path.join(__dirname, '../han1-dash/dash/')

const setupSocket = io.of('/');

setupSocket.on('connection', async (socket) => {
  console.log('A user connected to setup');
  let serialPorts = await han1SerialScanner();
  socket.emit('defaultConfig', defaultConfig, serialPorts);
  socket.on('disconnect', function () {
    console.log('A user disconnected from setup')
  });

});


han1Setup.use(express.static(templateFolder));
han1Setup.use(express.static(templateFolder + 'assets/'));

han1Setup.get('/', async (req, res) => {
  try {

    han1Process.restartParent();
    res.sendFile(path.join(templateFolder, 'setup.2de50de5.html'))
  } catch (e) {
    console.error(e);
  }

})

han1SetupServer.startServer = function (port) {
  port = port && typeof port === 'number' ? port : 3000;
  return this.listen(port, async (e) => {
    const ips = await getIp()
    let startString = '';
    startString += `\tThe setup is running!\n\tYou can access the it at:\n\n`;
    ips.map(interface => {
      startString += `\t\t${interface[0]} - http://${interface[1]}:${port}\n`;
    })

    console.log(startString);
  })
}

module.exports = {
  han1SetupServer
};
