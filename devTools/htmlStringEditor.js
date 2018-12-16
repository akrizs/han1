const fs = require('fs');
const path = require('path');
const md5 = require('md5');
require('log-timestamp')(() => {
  let date, y, sy, m, d, h, min, sec
  date = new Date();
  y = date.getFullYear().toString();
  sy = y.substr(y.length - 2, y.length);
  m = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
  d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  return `\x1b[35m[${sy}/${m}/${d} ${h}:${m}:${sec}]\x1b[0m \x1b[90m=>\x1b[0m %s`
});

// const demodata = [{
//   path: 'modules/han1-dash/dash/dash.js',
//   func: () => {
//     console.log(this)
//   },
//   watch: true
// }, {
//   path: 'modules/han1-dash/dash/',
//   ext: '.html',
//   func: async (inp) => {
//     let output, has;
//     has = inp.match(/(?:\<script){1}(?:\ src="){1}(http:\/\/scramblebamble.let\/socket.io\/socket.io.js){1}(\"\>){1}(\<\/script\>){1}/gi);
//     if (has) {
//       output = inp.replace(/(http:\/\/scramblebamble.let)/gi, '')
//       return output
//     } else {
//       return
//     }
//   },
//   watch: true
// }]

let wDir;

if (require.main === module) {
  let pP = path.parse(process.cwd());
  wDir = pP.dir
  let argues = process.argv.slice(2, process.argv.length).map(arg => {
    if (typeof arg === 'string') {
      if (arg.match(/^(?:\{{1,})(?:.{0,})(?:\}{1,})$/gi)) {
        return JSON.parse(arg);
      } else {
        return arg;
      }
    }
  });
  workFOF(demodata);
} else {
  wDir = process.cwd();
}

/**
 * @function workFOF
 * @description
 * A tool to watch folder or file and make modifications upon file event.
 * @param {Object[]|[Object]} pack - The object to populate the file/folder watch/modifier.
 * @param {String} pack.path - The path to the folder or the file to work on.
 * @param {String} pack.ext - Extension of files to watch if a folder is set as path.
 * @param {Function} pack.func - The function to run against the folder or file.
 * @param {Boolean} pack.watch - A flag to create a watch for the file/folder.
 * @returns void
 *
 *   */
async function workFOF(...pack) {
  if (Array.isArray(pack[0])) {
    pack = pack[0];
  }

  try {
    // Trigger forEach or just for one.
    if (pack.length > 1) {
      // Parse the elements!
      let parsed = await Promise.all(pack.map(parseFOF));
      parsed.forEach(splitFOF)
    } else {
      let single = await parseFOF(pack[0]);
      splitFOF(single);
    }

  } catch (e) {
    throw e;
  }
}

/**
 * @function parseFOF
 * @description
 * Parses the input and does some minor modifications 
 * before returning it back!
 * @param {Object} inp
 * @returns {Promise}
 */
async function parseFOF(inp) {
  try {
    let {
      p = path.normalize(path.join(wDir, inp.path)), ext, func, watch
    } = inp
    const returned = {};
    returned.path = path.parse(p);
    /* Lets just parse it as a file or a folder and then double check later on when the folder/file is actually found */
    returned.fof = returned.path.ext ? 'file' : 'folder';
    returned.ext = ext ? ext : returned.path.ext;
    returned.func = func;
    if (returned.fof === 'file') {
      let slash = p.split('')[p.length - 1] === '/';
      returned.path.full = slash ? p.slice(0, p.length - 1) : p;
    } else {
      returned.path.full = p;
    }
    returned.watch = watch;
    return returned
  } catch (e) {
    throw e
  }
}

async function splitFOF(all) {
  try {
    let exists = await fofExists(all.path.full);
    if (exists) {
      let addInfo = await fofExtraInfo(all.path.full);
      all.fof = addInfo.isDirectory() ? 'dir' : 'file';
      all.stats = addInfo;
      if (all.fof === 'dir') {
        fofHandleFolder(all)
      } else if (all.fof === 'file') {
        fofHandleFile(all)
      } else {
        throw new Error(`Don't know if I am working with a folder or a file? path:${all.path.full}`);
      }
    } else {
      // File folder does not exists what to do?
      throw new Error(`${all.path.full} does not exist, please check you typo or create the file/folder`);
    }

  } catch (err) {

  }
}

async function fofHandleFolder(folder) {
  try {
    if (folder.ext) {
      // Only work on those filetypes that have the specific extension.
      folder.ext = new RegExp(`(${folder.ext}){1}$`, 'gi');
    }
    if (folder.watch) {
      // Create a watcher on the folder.
      ;
      [ogFolders, ogFiles] = await fofDirList(folder.path.full);
      let md5Prev = null;
      fs.watch(folder.path.full, async (eT, fN) => {
        if (fN) {
          // [currFolders, currFiles] = await fofDirList(folder.path.full);
          if (fN.match(folder.ext)) {
            let wholePath = path.join(folder.path.full, fN)
            // A change has happened, check if the file actually still exists.
            let stillHere = await fofExists(wholePath)
            if (stillHere) {
              // Do what has to be done!
              const md5Curr = md5(fs.readFileSync(wholePath));
              if (md5Curr === md5Prev) return;
              let workedFile = await fofWorkFile(wholePath, folder.func);
              if (workedFile) {
                fofSave(workedFile, wholePath);
              }
              md5Prev = md5Curr;
              return;
            }
          }
        }
        if (ogFolders.length === 0 && ogFiles.length === 0) {
          [ogFolders, ogFiles] = await fofDirList(folder.path.full);
        }
      })
    }
    if (folder.func) {
      // Trigger the function we want on change.
    }
  } catch (e) {

  }
}

async function fofHandleFile(file) {
  try {
    if (file.watch) {

    }
    if (file.ext) {

    }
    if (file.func) {

    }
  } catch (e) {

  }
}


async function addFileWatcher(file) {
  try {

  } catch (e) {

  }
}

async function addFolderWatcher(folder) {
  try {

  } catch (e) {

  }
}

async function fofWorkFolder() {
  try {

  } catch (err) {

  }
}

function fofSave(file, uri) {
  return new Promise((res, rej) => {
    fs.writeFile(uri, file, 'utf8', (err) => {
      if (err) rej(err)
      res(true)
    })
  });
}

function fofWorkFile(file, fun) {
  return new Promise(async (res, rej) => {
    let openedFile = await fofReadFile(file);
    let workedFile = await fun(openedFile);
    res(workedFile)
  });
}

function fofReadFile(file) {
  return new Promise((res, rej) => {
    fs.readFile(file, 'utf8', (err, data) => {
      err ? res(false) : res(data);
    });
  });
}



function fofExists(fofPath) {
  return new Promise((res) => {
    fs.access(fofPath, fs.constants.F_OK, (err) => {
      err ? res(false) : res(true);
    })
  });
}


/**
 * 
 * @param {String} inpPath complete path up until file/folder.
 * @param {String} file - filename with extension.
 * @returns {String} - 'file' if is a file, 'dir' if a directory.
 */
async function fofFileOrFolder(inpPath, file) {
  let checkPath = path.join(inpPath, file ? file : '');
  let stat = await fofExtraInfo(checkPath);
  return stat.isFile() ? 'file' : 'dir';
}

/**
 * 
 * @param {String} fofPath - String of an absolut path to the folder.
 * @returns {Promise} [[],[]] - An array of 2 arrays, [0] 
 * is the folders and [1] is the files.
 */
function fofDirList(fofPath) {
  return new Promise((res, rej) => {

    fs.readdir(fofPath, {
      withFileTypes: true
    }, async (err, content) => {
      if (err) rej(err);
      let fofs = [
        [],
        []
      ];
      let forPromises = await content.map(async (fof) => {
        let flag = await fofFileOrFolder(fofPath, fof)
        if (flag === 'file') {
          fofs[1].push(fof);
        } else if (flag === 'dir') {
          fofs[0].push(fof);
        }
      })
      Promise.all(forPromises).then(() => {
        res(fofs);
      })

    })
  });
}

function fofExtraInfo(fofPath) {
  return new Promise((res, rej) => {
    fs.stat(fofPath, (err, stats) => {
      if (err) {
        rej(err);
      }
      res(stats)
    })
  })
}

module.exports = workFOF;
