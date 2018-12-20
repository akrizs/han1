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
})({"dash.js":[function(require,module,exports) {
"use strict";

require("./views/index.pug");

require("./views/debug.pug");

require("./views/graph.pug");

require("./views/settings.pug");

require("./views/setup.pug");
},{"./views/index.pug":"views/index.pug","./views/debug.pug":"views/debug.pug","./views/graph.pug":"views/graph.pug","./views/settings.pug":"views/settings.pug","./views/setup.pug":"views/setup.pug"}],"../node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":[function(require,module,exports) {
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;
},{}],"../node_modules/@babel/runtime/helpers/objectWithoutProperties.js":[function(require,module,exports) {
var objectWithoutPropertiesLoose = require("./objectWithoutPropertiesLoose");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
},{"./objectWithoutPropertiesLoose":"../node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js"}],"../node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"js/modules/loadingScreen.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadingScreen =
/*#__PURE__*/
function () {
  function loadingScreen() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      run: true,
      text: 'Default Placeholder text for the loader!',
      animation: 'scroller',
      mainContent: 'MainContent'
    },
        _ref$run = _ref.run,
        run = _ref$run === void 0 ? true : _ref$run,
        _ref$text = _ref.text,
        text = _ref$text === void 0 ? 'Default Placeholder text for the loader!' : _ref$text,
        _ref$animation = _ref.animation,
        animation = _ref$animation === void 0 ? 'scroller' : _ref$animation,
        _ref$mainContent = _ref.mainContent,
        mainContent = _ref$mainContent === void 0 ? 'MainContent' : _ref$mainContent;

    (0, _classCallCheck2.default)(this, loadingScreen);
    this.active = false;
    this.text = document.createTextNode(text);
    this.run = run;
    this.animation = animation;
    this.icon = {};
    this.createSVGicon();
    this.createDivs();

    if (document.querySelector("#".concat(mainContent))) {
      this.mainContainer = document.querySelector("#".concat(mainContent));
    }

    if (this.run) {
      this.enable();
    }
  }

  (0, _createClass2.default)(loadingScreen, [{
    key: "createSVGicon",
    value: function createSVGicon() {
      var xmlns = 'http://www.w3.org/2000/svg';
      this.icon.d = 'M3.13,188a3.13,3.13,0,0,1-2.88-4.35l35.1-83.38H3.13a3.14,3.14,0,0,1-2.8-4.54l47-94A3.14,3.14,0,0,1,50.13,0h50.14a3.14,3.14,0,0,1,2.65,4.81L66.27,62.67H103.4a3.12,3.12,0,0,1,2.84,1.81,3.15,3.15,0,0,1-.44,3.34L5.53,186.89A3.15,3.15,0,0,1,3.13,188';
      this.icon.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.icon.path.id = 'backPath';
      this.icon.path.classList.add('backPath');
      this.icon.path.setAttributeNS(null, 'd', this.icon.d);
      this.icon.backRect = document.createElementNS(xmlns, 'rect');
      this.icon.backRect.classList.add('backRect');
      this.icon.mask = document.createElementNS(xmlns, 'mask');
      this.icon.mask.id = 'iconMask';
      this.icon.mask.classList.add('iconMask');
      this.icon.mask.appendChild(this.icon.backRect);
      this.icon.mask.appendChild(this.icon.path);
      this.icon.frontRect = document.createElementNS(xmlns, 'rect');
      this.icon.frontRect.setAttributeNS(null, 'mask', 'url(#iconMask)');
      this.icon.frontRect.setAttributeNS(null, 'y', '-200');
      this.icon.frontRect.setAttributeNS(null, 'width', '100%');
      this.icon.frontRect.setAttributeNS(null, 'height', '100%');
      this.icon.frontRect.classList.add('frontRect');
      this.icon.frontRect.id = 'iconDisplay';

      if (this.animation === 'scroller') {
        this.icon.frontRect.classList.add('scroller');
      }

      this.icon.outline = document.createElementNS(xmlns, 'path');
      this.icon.outline.id = 'outline';
      this.icon.outline.classList.add('outline');
      this.icon.outline.setAttributeNS(null, 'd', this.icon.d);

      if (this.animation === 'trace') {
        this.icon.outline.classList.add('trace');
      }

      this.icon.svg = document.createElementNS(xmlns, 'svg');
      this.icon.svg.setAttributeNS(null, 'viewBox', '0 0 106.53 188');
      this.icon.svg.classList.add('iconSvg');
      this.icon.svg.appendChild(this.icon.outline);
      this.icon.svg.appendChild(this.icon.mask);
      this.icon.svg.appendChild(this.icon.frontRect);
      return this.icon.svg;
    }
  }, {
    key: "createDivs",
    value: function createDivs() {
      this.background = document.createElement('div');
      this.background.classList.add('phase', 'phaseBack');
      this.iconWrapper = document.createElement('div');
      this.iconWrapper.classList.add('iconPlace');
      this.iconWrapper.appendChild(this.icon.svg);
      this.textCont = document.createElement('h3');
      this.textCont.appendChild(this.text);
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('phase', 'phaseNote');
      this.wrapper.appendChild(this.iconWrapper);
      this.wrapper.appendChild(this.textCont);
      this.background.insertAdjacentElement('beforeend', this.wrapper);
    }
  }, {
    key: "enable",
    value: function enable(text) {
      var _this = this;

      if (!!text) {
        this.text.nodeValue = text;
      }

      if (!this.active) {
        this.active = true;
        document.body.insertAdjacentElement('afterbegin', this.background);
        document.body.classList.add('disScroll');
        setTimeout(function () {
          _this.background.setAttribute('data-display', '');

          if (!!_this.mainContainer && !_this.mainContainer.dataset.blurred) {
            _this.mainContainer.dataset.blurred = '';
          }
        }, 10);
      }
    }
  }, {
    key: "disable",
    value: function disable() {
      var _this2 = this;

      if (this.active) {
        delete this.background.dataset.display;
        this.background.setAttribute('data-hidden', '');

        if (!!this.mainContainer && !!this.mainContainer.dataset) {
          this.mainContainer.dataset.blurred = 'off';
        }

        setTimeout(function () {
          document.body.classList.remove('disScroll');

          _this2.background.parentNode.removeChild(_this2.background);

          _this2.active = false;

          if (!!_this2.mainContainer && !!_this2.mainContainer.dataset) {
            delete _this2.mainContainer.dataset.blurred;
          }

          delete _this2.background.dataset.hidden;
        }, 1000);
      }
    }
  }, {
    key: "isActive",
    get: function get() {
      return this.active;
    }
  }]);
  return loadingScreen;
}();

exports.default = loadingScreen;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "43213" + '/');

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
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/parcel-bundler/src/builtins/loaders/browser/html-loader.js":[function(require,module,exports) {
module.exports = function loadHTMLBundle(bundle) {
  return fetch(bundle).then(function (res) {
    return res.text();
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("html",require("../node_modules/parcel-bundler/src/builtins/loaders/browser/html-loader.js"));b.load([["views.9661ef0e.html","views/index.pug"],["debug.1c4e6360.html","views/debug.pug"],["graph.1a5e4c20.html","views/graph.pug"],["settings.c9a50872.html","views/settings.pug"],["setup.2de50de5.html","views/setup.pug"]]).then(function(){require("dash.js");});
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=dash.map