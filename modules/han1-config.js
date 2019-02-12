const fs = require('fs');
const Path = require('path');
const defaultConfig = require('./han1-default-config');

const cfgPath = Path.join(process.cwd(), 'han1-config.json')

module.exports = async () => {
  const doesExist = new Promise((res, rej) => {
    fs.access(cfgPath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        err.code === 'ENOENT' ? res('notFound') : res('read-only')
      } else {
        res(true);
      }
    })
  });

  return new Promise((res, rej) => {

    doesExist.then(value => {
      if (value === true) {
        // Read the config
        fs.readFile(cfgPath, (err, cfg) => {
          res(JSON.parse(cfg));
        })

      } else if (value === 'notFound') {
        // Create the config file and input the defaults.
        const writeNewFile = new Promise((res, rej) => {
          fs.writeFile(cfgPath, JSON.stringify(defaultConfig, null, 2), 'utf8', (err) => {
            if (err) {
              rej(new Error('Had some issues with creating the config file.'))
            } else {
              res(true);
            }
          })
        })

        writeNewFile.then(() => {
          fs.readFile(cfgPath, (err, cfg) => {
            res(JSON.parse(cfg));
          })
        })

      } else if (value === 'read-only') {
        // Throw an error that the file cannot be written too.
        throw new Error("The config file is read-only, can't write to it!")
      }
    })
  })
};
