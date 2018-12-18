const nodemon = require('nodemon');
const fs = require('fs');
const path = require('path');
const clean = require('./devTools/clean');
require('dotenv').config();
const watchable = require('./devTools/htmlStringEditor');
const bundler = require('./devTools/bundler')

const {
  spawn
} = require('child_process');

const cleanFiles = [ /*'.parcel-cache/*',*/ 'modules/han1-dash/dash/*']

const nodemonOpts = {
  verbose: true,
  ignore: [
    'node_modules',
    'demodata/*',
    'src/*',
    'modules/han1-dash/dash/*',
    '.parcel-cache/*',
    'devTools/*'
  ],
  watch: ['.*'],
  restartable: 'rs',
  colours: true,
  execMap: [Object],
  stdin: true,
  runOnChangeOnly: false,
  signal: 'SIGUSR2',
  stdout: true,
  watchOptions: {},
};

const watchableOpts = {
  path: 'modules/han1-dash/dash/',
  ext: '.html',
  func: async (inp) => {
    let output, has;
    has = inp.match(/(?:\<script){1}(?:\ src="){1}(http:\/\/scramblebamble.let\/socket.io\/socket.io.js){1}(\"\>){1}(\<\/script\>){1}/gi);
    if (has) {
      output = inp.replace(/(http:\/\/scramblebamble.let)/gi, '')
      return output
    } else {
      return
    }
  },
  watch: true
}

console.clear();

clean(cleanFiles)
  .then(() => {
    bundler.bundle()
    nodemon(nodemonOpts)
    watchable(watchableOpts)
  });
