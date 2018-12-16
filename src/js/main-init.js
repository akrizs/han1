import ProgressBar from 'progressbar.js';

window.ProgressBar = ProgressBar;


window.metersOptions = {
  activeMeterOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: '#203D42',
    trailWidth: 0.8,
    text: {
      value: 'Active Power',
      className: 'activePowerLabel',
      style: {
        autoStyleContainer: false,
      }
    },
    svgStyle: {
      display: 'block',
      width: '100%'
    },
  },
  ampsMetersOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: '#203D42',
    trailWidth: 0.8,
    text: {
      value: 'Current',
      className: 'phaseVal phaseMeter__current',
      style: {
        autoStyleContainer: false,
      }
    },
    svgStyle: {
      display: 'block',
      width: '100%'
    },
  },
  voltMetersOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: '#203D42',
    trailWidth: 0.8,
    text: {
      value: 'Voltage',
      className: 'phaseVal phaseMeter__voltage',
      style: {
        autoStyleContainer: false,
      }
    },
    svgStyle: {
      display: 'block',
      width: '100%'
    },
  },
  voltsMax: 250,
  ampsMax: 50,
  ampsAlot: 15,
  maxWatts: 10000,
  animationOpts: {
    duration: 1200,
    easing: 'easeOut',
  },
  sColors: {
    error: 'rgb(255, 90, 82)',
    fine: 'rgb(82, 194, 43)',
    warning: 'rgb(255, 135, 0)',
  }
}
