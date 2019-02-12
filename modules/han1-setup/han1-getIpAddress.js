const os = require('os');
const ifaces = os.networkInterfaces();

async function getIp() {
  const ipRegex = new RegExp('((?:\\d{1,3})\\.(?:\\d{1,3})\\.(?:\\d{1,3})\\.(?:\\d{1,3}))', 'g');

  let ifObject = []
  let ips = Object.keys(ifaces).map(async (ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (ipRegex.test(iface.address)) {
        ifObject.push(new Promise((res, rej) => {
          res([ifname, iface.address])
        }))
      }
      return
    })
  }).filter(Boolean);


  return Promise.all(ifObject).then(d => {
    return d;
  })
}

module.exports = getIp;
