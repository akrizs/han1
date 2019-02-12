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
})({"js/main.js":[function(require,module,exports) {
"use strict";

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _progressbar = _interopRequireDefault(require("progressbar.js"));

var _loadingScreen = _interopRequireDefault(require("./modules/loadingScreen"));

var _mainMenu = require("./modules/_mainMenu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.ProgressBar = _progressbar.default;

_mainMenu.mainMenu.init();

document.addEventListener('keyup', function (e) {
  if (e.keyCode === 77) {
    _mainMenu.mainMenu.handleMainMenuToggle.call(_mainMenu.mainMenu.BTN, e);
  }
});
var loading = new _loadingScreen.default({
  text: 'Waiting for data!'
});
var metersOptions = {
  activeMeterOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: null,
    trailWidth: 0.8,
    text: {
      value: 'Active Power',
      className: 'activePowerLabel',
      style: {
        autoStyleContainer: false
      }
    },
    svgStyle: {
      display: 'block',
      width: '100%'
    }
  },
  ampsMetersOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: null,
    trailWidth: 0.8,
    text: {
      value: 'Current',
      className: 'phaseVal phaseMeter__current',
      style: {
        autoStyleContainer: false
      }
    },
    svgStyle: {
      display: 'block',
      width: '100%'
    }
  },
  voltMetersOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: null,
    trailWidth: 0.8,
    text: {
      value: 'Voltage',
      className: 'phaseVal phaseMeter__voltage',
      style: {
        autoStyleContainer: false
      }
    },
    svgStyle: {
      display: 'block',
      width: '100%'
    }
  },
  voltsMax: 250,
  ampsMax: 50,
  ampsAlot: 15,
  maxWatts: 10000,
  animationOpts: {
    duration: 1200,
    easing: 'easeOut'
  },
  sColors: {
    error: 'rgb(255, 90, 82)',
    fine: 'rgb(82, 194, 43)',
    warning: 'rgb(255, 135, 0)'
  }
};
var mainSocket = io.connect('/main');
var errorSocket = io.connect('/error');
window.mainSocket = mainSocket;
window.errorSocket = errorSocket;
errorSocket.on('error', function (e) {
  console.dir(e);
});
var lastUpdate = document.all.lastUpdate;
var activePower = document.all.activePower;
var activeWmeter = new _progressbar.default.SemiCircle(activePower.querySelector('.meter'), metersOptions.activeMeterOpts);
activeWmeter.trail.classList.add('meterTrail');
activeWmeter.text.removeAttribute('style');
activeWmeter.path.classList.add('meterGauge');
activeWmeter.path.setAttribute('stroke-linecap', 'round');
var l1 = document.all.l1;
var il1Meter = new _progressbar.default.SemiCircle(l1.querySelector('.current'), metersOptions.ampsMetersOpts);
il1Meter.trail.classList.add('meterTrail');
il1Meter.path.setAttribute('stroke-linecap', 'round');
il1Meter.path.classList.add('meterGauge');
il1Meter.text.removeAttribute('style');
var vl1Meter = new _progressbar.default.SemiCircle(l1.querySelector('.volt'), metersOptions.voltMetersOpts);
vl1Meter.trail.classList.add('meterTrail');
vl1Meter.path.setAttribute('stroke-linecap', 'round');
vl1Meter.path.classList.add('meterGauge');
vl1Meter.text.removeAttribute('style');
var l2 = document.all.l2;
var il2Meter = new _progressbar.default.SemiCircle(l2.querySelector('.current'), metersOptions.ampsMetersOpts);
il2Meter.trail.classList.add('meterTrail');
il2Meter.path.classList.add('meterGauge');
il2Meter.path.setAttribute('stroke-linecap', 'round');
il2Meter.text.removeAttribute('style');
var vl2Meter = new _progressbar.default.SemiCircle(l2.querySelector('.volt'), metersOptions.voltMetersOpts);
vl2Meter.trail.classList.add('meterTrail');
vl2Meter.path.classList.add('meterGauge');
vl2Meter.path.setAttribute('stroke-linecap', 'round');
vl2Meter.text.removeAttribute('style');
var l3 = document.all.l3;
var il3Meter = new _progressbar.default.SemiCircle(l3.querySelector('.current'), metersOptions.ampsMetersOpts);
il3Meter.trail.classList.add('meterTrail');
il3Meter.path.classList.add('meterGauge');
il3Meter.path.setAttribute('stroke-linecap', 'round');
il3Meter.text.removeAttribute('style');
var vl3Meter = new _progressbar.default.SemiCircle(l3.querySelector('.volt'), metersOptions.voltMetersOpts);
vl3Meter.trail.classList.add('meterTrail');
vl3Meter.path.classList.add('meterGauge');
vl3Meter.path.setAttribute('stroke-linecap', 'round');
vl3Meter.text.removeAttribute('style');
document.addEventListener('DOMContentLoaded', function () {
  var meters = [activeWmeter, il1Meter, vl1Meter, il2Meter, vl2Meter, il3Meter, vl3Meter];
  meters.forEach(function (meter) {
    meter.animate(1, metersOptions.animationOpts);
    setTimeout(function () {
      meter.animate(0, metersOptions.animationOpts);
    }, 1000);
  });
});
mainSocket.on('disconnect', function () {
  loading.enable('Lost Connection');
});
mainSocket.on('reconnect', function () {
  loading.disable();
});
mainSocket.on('meterData', function (frmSrv, lastPrice) {
  var data = frmSrv.data,
      meter = frmSrv.meter,
      listID = frmSrv.listID,
      manufacturer = frmSrv.manufacturer,
      rest = (0, _objectWithoutProperties2.default)(frmSrv, ["data", "meter", "listID", "manufacturer"]);

  if (loading.isActive) {
    loading.disable();
  }

  console.log(frmSrv);
  workThePrice(lastPrice);

  if (listID === 1 || listID === 2 || listID === 3) {
    // Update the activePowerMeter on every list!
    activePowerMeterUpdate.call(activeWmeter, data.aPowPlus, manufacturer);
  }

  if (listID === 2 || listID === 3) {
    currentMetersUpdate.call(il1Meter, data.phases.l1.i, manufacturer);
    currentMetersUpdate.call(il2Meter, data.phases.l2.i, manufacturer);
    currentMetersUpdate.call(il3Meter, data.phases.l3.i, manufacturer);
    voltageMetersUpdate.call(vl1Meter, data.phases.l1.v, manufacturer);
    voltageMetersUpdate.call(vl2Meter, data.phases.l2.v, manufacturer);
    voltageMetersUpdate.call(vl3Meter, data.phases.l3.v, manufacturer);
    var date = new Date(data.time);
    lastUpdate.querySelector('h4').textContent = "".concat(date.toLocaleDateString(), " ").concat(date.toLocaleTimeString()); // `${data.date.date}/${data.date.month}/${data.date.year}\n${data.date.hour}:${data.date.min}:${data.date.sec}`
  }

  if (listID === 3) {}
});

function workThePrice(price) {
  var current = price.current,
      today = price.today,
      tomorrow = price.tomorrow;
  var days;
  var cont = document.querySelector('.priceInfo');

  if (today.length && tomorrow.length) {
    days = [today, tomorrow].map(getAvgAndHighHours);
    cont.innerText = "".concat(days[0].str, "\n    ").concat(days[1].str);
  } else if (today.length) {
    days = [today].map(getAvgAndHighHours);
    cont.innerText = days[0].str;
  }
}

function getAvgAndHighHours(day, idx) {
  var dayStr = idx === 0 ? 'Today' : 'Tomorrow';

  var getTotals = function getTotals(time, idx, arr) {
    return time.total;
  };

  var reducer = function reducer(acc, curr, idx, arr) {
    return acc + curr;
  };

  var getHighHours = function getHighHours(avg, hour, idx, arr) {
    return hour.total > avg ? hour : null;
  };

  var getHours = function getHours(hour) {
    var d = new Date(hour.startsAt);
    return d.getHours();
  };

  var totalOnDay = day.map(getTotals).reduce(reducer);
  var avgOnDayBC = totalOnDay / day.length;
  var avgOnDay = round(avgOnDayBC * 100, 2);
  var highHoursOnDay = day.map(getHighHours.bind(null, avgOnDayBC)).filter(Boolean).map(getHours);
  var avgOnDayStr = "".concat(dayStr, ": ").concat(avgOnDay, " \xF8re");
  return {
    avg: avgOnDay,
    avgBf: avgOnDayBC,
    str: avgOnDayStr,
    highHours: highHoursOnDay
  };
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function currentMetersUpdate(pack, manufacturer) {
  var value = pack.value,
      unit = pack.unit;

  if (manufacturer === 'kamstrup') {
    value = value;
  } else {
    value = value * 100;
  }

  value = parseInt(value) / 100;
  this.animate(value / metersOptions.ampsMax, metersOptions.animationOpts);
  this.setText("".concat(value.toFixed(2), " A"));

  if (value > 0 && value < metersOptions.ampsAlot) {
    this.path.setAttribute('stroke', metersOptions.sColors.fine);
  }

  if (value > metersOptions.ampsAlot && value < 25) {
    this.path.setAttribute('stroke', metersOptions.sColors.warning);
  }

  if (value > 25 && value < metersOptions.ampsMax) {
    this.path.setAttribute('stroke', metersOptions.sColors.error);
  }
}

function voltageMetersUpdate(pack, manufacturer) {
  var value = pack.value,
      unit = pack.unit;
  this.animate(value / metersOptions.voltsMax, metersOptions.animationOpts);
  this.setText("".concat(value, " V"));

  if (value > 220 && value < 240) {
    this.path.setAttribute('stroke', metersOptions.sColors.fine);
  }

  if (value < 220 && value > 240) {
    this.path.setAttribute('stroke', metersOptions.sColors.error);
  }
}

function activePowerMeterUpdate(pack, manufacturer) {
  var value = pack.value,
      unit = pack.unit;
  this.animate(value / metersOptions.maxWatts, metersOptions.animationOpts);
  this.setText("".concat((value / 1000).toFixed(3), " kW"));

  if (value > 0 && value < 5000) {
    this.path.setAttribute('stroke', metersOptions.sColors.fine);
  }

  if (value > 5000 && value < 8000) {
    this.path.setAttribute('stroke', metersOptions.sColors.warning);
  }

  if (value > 8000 && value < metersOptions.maxWatts) {
    this.path.setAttribute('stroke', metersOptions.sColors.error);
  }
}
},{"@babel/runtime/helpers/objectWithoutProperties":"../node_modules/@babel/runtime/helpers/objectWithoutProperties.js","progressbar.js":"../node_modules/progressbar.js/src/main.js","./modules/loadingScreen":"js/modules/loadingScreen.js","./modules/_mainMenu":"js/modules/_mainMenu.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34581" + '/');

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
var b=require("../node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));b.load([]).then(function(){require("js/main.js");});
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=main.fb6bbcaf.map