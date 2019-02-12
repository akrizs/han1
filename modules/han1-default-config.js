module.exports = {
  "version": require('../package').version,
  "firstStart": true,
  "debug": true,
  "log": ["error", "info", "full"],
  "host": ["raspi", "other"],
  "serial": {
    "port": "/dev/ttyAMA0",
    "baudRate": 2400,
    "dataBits": 8,
    "stopBits": 1,
    "parity": ["none", "odd", "even"]
  },
  "meter": {
    "manufacturer": ["aidon", "kaifa", "kamstrup"],
    "id": "",
    "serial": "",
    "type": ""
  },
  "dashboard": {
    "port": 3000,
    "api": false,
    "protect": {
      "active": false,
      "username": "admin",
      "password": "admin"
    }
  },
  "addons": {
    "han1Tibber": {
      "active": true,
      "homeId": "",
      "apiKey": ""
    },
    "han1Nettleie": {
      "active": false,
      "noan": 23825,
      "consumeTax": true,
      "vat": true
    }
  },
  "dataStorage": {
    "active": false,
    "type": ["file", "mongodb"],
    "username": "admin",
    "password": "admin",
    "uri": ""
  }
}
