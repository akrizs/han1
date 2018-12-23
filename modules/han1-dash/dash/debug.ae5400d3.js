// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"../node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],"../node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"../node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./nonIterableRest":"../node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"js/debug.js":[function(require,module,exports) {
"use strict";

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _loadingScreen = _interopRequireDefault(require("./modules/loadingScreen"));

var _mainMenu = require("./modules/_mainMenu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbgConn = io.connect('/debug');
var dbgHexTbl = document.all.debugHexTable;
var obisTable = document.all.obisTable;
var waitig = true;
var frozen = false;
var waitscreen = new _loadingScreen.default({
  text: 'Waiting for data!',
  animation: 'scroller'
});

_mainMenu.mainMenu.init();

window.waitscreen = waitscreen;
createFreezeButton();
dbgConn.on('dbgData', function (frmSrv) {
  var hexified = frmSrv.hexified,
      obis = frmSrv.obis,
      date = frmSrv.date,
      raw = frmSrv.raw,
      rest = (0, _objectWithoutProperties2.default)(frmSrv, ["hexified", "obis", "date", "raw"]);

  if (waitscreen.isActive) {
    waitscreen.disable();
  }

  if (!frozen) {
    debugHexTable(date, hexified, obis, raw.ctrl.frameSize);
    generateObisTable(raw.manufacturer, null, obis);
    addEvListenersToTables();
    console.log(frmSrv);
  } else {
    console.log('The data stream is frozen!');
  }
});

function addEvListenersToTables() {
  Array.from(obisTable.tBodies[0].rows).map(function (row) {
    row.addEventListener('click', function () {
      this.classList.toggle('selected');
      var bStart,
          bEnd,
          obStart,
          obEnd,
          rowl = row.cells.length,
          hexTable,
          bytes,
          nOBytes;
      bStart = parseInt(row.cells[rowl - 2].innerText);
      bEnd = parseInt(row.cells[rowl - 1].innerText);
      obStart = parseInt(row.cells[rowl - 4].innerText);
      obEnd = parseInt(row.cells[rowl - 3].innerText);
      bytes = bEnd - bStart + (obEnd - obStart) + 2;
      obStart = obStart - 2;
      hexTable = document.querySelector('.dbgHexTblContent');

      for (var i = 0; i < hexTable.children.length; i++) {
        var byte = hexTable.children[i];

        if (obStart > i || i > obStart + bytes - 1) {
          byte.classList.toggle('dl');
        }
      }
    });
  });
}

function generateObisTable(mfact, listNr, obisVals) {
  var tableHeader = document.all.obisTable.tHead;
  tableHeader.rows[2].cells[0].innerText = listNr;
  var tableBody = document.all.obisTable.tBodies[0];
  var nr = 1;
  var obisRows = obisVals.map(function (obis) {
    var _obis = (0, _slicedToArray2.default)(obis, 6),
        str = _obis[0],
        type = _obis[1],
        obStart = _obis[2],
        obEnd = _obis[3],
        dStart = _obis[4],
        dEnd = _obis[5];

    var obisArray = str.split(/-|:|\./gi).map(function (ob) {
      return parseInt(ob);
    });

    var _obisArray = (0, _slicedToArray2.default)(obisArray, 6),
        a = _obisArray[0],
        b = _obisArray[1],
        c = _obisArray[2],
        d = _obisArray[3],
        e = _obisArray[4],
        f = _obisArray[5];

    if (mfact === 'kamstrup') {
      if (type.match(/^(int)(\d)(bytes)/gi)) {
        type = 'u'.concat(type);
      }
    }

    obisArray.push(str);
    var row = ["<tr>", "<td class=\"obisListIdNr\">".concat(nr++, "</td>"), "<td class=\"obisGroup obisGroup__A\">".concat(a, "</td>"), "<td class=\"obisGroup obisGroup__B\">".concat(b, "</td>"), "<td class=\"obisGroup obisGroup__C\">".concat(c, "</td>"), "<td class=\"obisGroup obisGroup__D\">".concat(d, "</td>"), "<td class=\"obisGroup obisGroup__E\">".concat(e, "</td>"), "<td class=\"obisGroup obisGroup__F\">".concat(f, "</td>"), "<td class=\"obis__name\">".concat(findObisName(obisArray, mfact), "</td>"), "<td class=\"obis__unit\">".concat(findUnitType(obisArray, mfact), "</td>"), "<td class=\"obis__dataType\">".concat(type, "</td>"), "<td class=\"obis__obis_byteStart\">".concat(obStart, "</td>"), "<td class=\"obis__obis_byteEnd\">".concat(obEnd, "</td>"), "<td class=\"obis__value_byteStart\">".concat(dStart, "</td>"), "<td class=\"obis__value_byteEnd\">".concat(dEnd, "</td>"), "</tr>"];
    return row.join('');
  }).join('');
  tableBody.innerHTML = obisRows;
}

function debugHexTable(date, hexified, obisVals, size) {
  var meterDate = new Date(date.meter);
  var serverDate = new Date(date.server);
  var rL = hexified.split('\n').filter(Boolean).length;
  var no = -1;
  var obS, dS, octrlS, dctrlS;
  var webified = hexified.split('\n').filter(Boolean).map(function (row) {
    return row.trim();
  }).map(function (row) {
    var bytes = row.split(' ').map(function (byte) {
      no++;
      var t = '';
      obisVals.map(function (obis, idx) {
        var _obis2 = (0, _slicedToArray2.default)(obis, 6),
            str = _obis2[0],
            type = _obis2[1],
            obStart = _obis2[2],
            obEnd = _obis2[3],
            dStart = _obis2[4],
            dEnd = _obis2[5];

        if (no === parseInt(obStart) - 2) {
          octrlS = true;
        }

        if (no === parseInt(obStart)) {
          octrlS = false;
          obS = true;
        }

        if (no - 1 === parseInt(obEnd)) {
          obS = false;
        }

        if (no === parseInt(dStart)) {
          dctrlS = true;
        }

        if (no === parseInt(dStart) + 1) {
          dctrlS = false;
          dS = true;
        }

        if (no === parseInt(dEnd) - 1) {
          dS = false;
        }
      });

      if (octrlS) {
        t = 'obisCtrl';
      }

      if (obS) {
        t = 'obis';
      }

      if (dctrlS) {
        if (t != 'obisCtrl') {
          t = 'dataCtrl';
        }
      }

      if (dS) {
        t = 'data';
      }

      if (no === 0 || no === size + 1) {
        t = 'fsef';
      }

      if (no === size || no === size - 1) {
        t = 'fcs';
      }

      if (no === 1) {
        t = 'frameFormat';
      }

      if (no === 2) {
        t = 'frameSize';
      }

      if (no === 3) {
        t = 'destAddr';
      }

      if (no === 4) {
        t = 'srcAddr';
      }

      if (no === 5) {
        t = 'ctrlField';
      }

      if (no === 6 || no === 7) {
        t = 'hcs';
      }

      if (no === size - 2) {
        t = 'data';
      }

      return "<p class=\"byte".concat(t ? ' ' + t : '', "\" data-byteNr=\"").concat(no, "\" data-type=\"").concat(t, "\">").concat(byte, "</p>");
    }).join(' ');
    return bytes;
  }).join('\n');
  var packLength = no + 1;
  dbgHexTbl.querySelector('.dbgHexTblDateTime').innerText = "".concat(meterDate.toLocaleDateString(), " ").concat(meterDate.toLocaleTimeString());
  dbgHexTbl.querySelector('.dbgHexTblAddInfo').innerText = "Length: ".concat(packLength);
  dbgHexTbl.querySelector('.dbgHexTblContent').innerHTML = webified;
}

function findObisName(obis, mfact) {
  var _obis3 = (0, _slicedToArray2.default)(obis, 7),
      a = _obis3[0],
      b = _obis3[1],
      c = _obis3[2],
      d = _obis3[3],
      e = _obis3[4],
      f = _obis3[5],
      str = _obis3[6];

  if (str === '1-1:0.2.129.255') {
    return 'Obis List Version Identifier';
  }

  if (str === '1-1:0.0.5.255' || str === '0-0:96.1.0.255') {
    return 'Meter ID (GIAI GS1 16 Digit)';
  }

  if (str === '1-1:96.1.1.255' || str === '0-0:96.1.7.255') {
    return 'Meter Type';
  }

  if (str === '1-1:1.7.0.255' || str === '1-0:1.7.0.255') {
    return 'Active Power + (Q1+Q4)';
  }

  if (str === '1-1:2.7.0.255' || str === '1-0:2.7.0.255') {
    return 'Active Power - (Q2+Q3)';
  }

  if (str === '1-1:3.7.0.255' || str === '1-0:3.7.0.255') {
    return 'Reactive Power + (Q1+Q2)';
  }

  if (str === '1-1:4.7.0.255' || str === '1-0:4.7.0.255') {
    return 'Reactive Power - (Q3-Q4)';
  }

  if (str === '1-1:31.7.0.255' || str === '1-0:31.7.0.255') {
    return 'IL1 Current Phase L1';
  }

  if (str === '1-1:51.7.0.255' || str === '1-0:51.7.0.255') {
    return 'IL2 Current Phase L2';
  }

  if (str === '1-1:71.7.0.255' || str === '1-0:71.7.0.255') {
    return 'IL3 Current Phase L3';
  }

  if (str === '1-1:32.7.0.255' || str === '1-0:32.7.0.255') {
    return 'ULN1 Phase Voltage 4W meter, Line voltage 3W meter.';
  }

  if (str === '1-1:52.7.0.255' || str === '1-0:52.7.0.255') {
    return 'ULN2 Phase Voltage 4W meter, Line voltage 3W meter.';
  }

  if (str === '1-1:72.7.0.255' || str === '1-0:72.7.0.255') {
    return 'ULN3 Phase Voltage 4W meter, Line voltage 3W meter.';
  }

  if (str === '0-1:1.0.0.255' || str === '0-0:1.0.0.255') {
    return 'Clock and Date in meter';
  }

  if (str === '1-1:1.8.0.255' || str === '1-0:1.8.0.255') {
    return 'Cumulative hourly active import energy (A+)(Q1+Q4)';
  }

  if (str === '1-1:2.8.0.255' || str === '1-0:2.8.0.255') {
    return 'Cumulative hourly active export energy (A-)(Q2+Q3)';
  }

  if (str === '1-1:3.8.0.255' || str === '1-0:3.8.0.255') {
    return 'Cumulative hourly reactive import energy (R+)(Q1+Q2)';
  }

  if (str === '1-1:4.8.0.255' || str === '1-0:4.8.0.255') {
    return 'Cumulative hourly reactive export energy (R-)(Q3+Q4)';
  }
}

function findUnitType(obis, mfact) {
  var _obis4 = (0, _slicedToArray2.default)(obis, 7),
      a = _obis4[0],
      b = _obis4[1],
      c = _obis4[2],
      d = _obis4[3],
      e = _obis4[4],
      f = _obis4[5],
      str = _obis4[6];

  if (str === '1-1:0.2.129.255' || str === '1-1:0.0.5.255' || str === '1-1:96.1.1.255' || str === '0-1:1.0.0.255') {
    return '';
  }

  if (str === '1-1:1.7.0.255' || str === '1-1:2.7.0.255') {
    return 'kW';
  }

  if (str === '1-1:3.7.0.255' || str === '1-1:4.7.0.255') {
    return 'kVAr';
  }

  if (str === '1-1:31.7.0.255' || str === '1-1:51.7.0.255' || str === '1-1:71.7.0.255') {
    return 'A';
  }

  if (str === '1-1:32.7.0.255' || str === '1-1:52.7.0.255' || str === '1-1:72.7.0.255') {
    return 'V';
  }

  if (str === '1-1:1.8.0.255' || str === '1-1:2.8.0.255') {
    return 'kWh';
  }

  if (str === '1-1:3.8.0.255' || str === '1-1:4.8.0.255') {
    return 'kVArh';
  }
}

function createFreezeButton() {
  var freezeButton = document.createElement('button');
  freezeButton.classList.add('freezeButton');
  freezeButton.id = 'freezer';
  freezeButton.innerText = 'Freeze Data';

  freezeButton.onclick = function () {
    frozen = frozen === false ? true : false;
    this.innerText = frozen === false ? 'Freeze Data' : 'Data is Frozen!';
    frozen ? this.dataset.frozen = '' : delete this.dataset.frozen;
  };

  document.body.insertAdjacentElement('afterbegin', freezeButton);
}
},{"@babel/runtime/helpers/slicedToArray":"../node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/helpers/objectWithoutProperties":"../node_modules/@babel/runtime/helpers/objectWithoutProperties.js","./modules/loadingScreen":"js/modules/loadingScreen.js","./modules/_mainMenu":"js/modules/_mainMenu.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "37845" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;

    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };

    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));b.load([]).then(function(){require("js/debug.js");});
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=debug.ae5400d3.map