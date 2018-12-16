const rimraf = require('rimraf');

function clean(...arr) {
  return new Promise((res, rej) => {
    let promises = [];
    const cleanse = [].concat.apply([], arr);
    if (!arr || cleanse.length === 0) {
      throw new TypeError('Give me something to eat!')
    }

    cleanse.forEach(clean => {
      promises.push(new Promise((res, rej) => {
        rimraf(clean, (err) => {
          if (err) rej(err)
          res(`${clean} was removed!`);
        })
      }))
    })

    Promise.all(promises)
      .then(() => {
        console.log('\x1b[92mAll Files Cleaned\x1b[0m')
        res(true)
      })
      .catch(err => {
        rej(err);
      })
  });
}

// clean();

module.exports = clean;
