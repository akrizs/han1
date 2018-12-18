import ProgressBar from 'progressbar.js';

window.ProgressBar = ProgressBar;

const metersOptions = {
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

let conectedToDevice;
const socket = window.io();

let lastUpdate = document.all.lastUpdate;
let activePower = document.all.activePower;

let activeWmeter = new ProgressBar.SemiCircle(activePower.querySelector('.meter'), metersOptions.activeMeterOpts);
activeWmeter.text.removeAttribute('style');
activeWmeter.path.setAttribute('stroke-linecap', 'round')

let l1 = document.all.l1;
let il1Meter = new ProgressBar.SemiCircle(l1.querySelector('.current'), metersOptions.ampsMetersOpts);
il1Meter.path.setAttribute('stroke-linecap', 'round')
il1Meter.text.removeAttribute('style');
let vl1Meter = new ProgressBar.SemiCircle(l1.querySelector('.volt'), metersOptions.voltMetersOpts);
vl1Meter.path.setAttribute('stroke-linecap', 'round')
vl1Meter.text.removeAttribute('style');


let l2 = document.all.l2;
let il2Meter = new ProgressBar.SemiCircle(l2.querySelector('.current'), metersOptions.ampsMetersOpts);
il2Meter.path.setAttribute('stroke-linecap', 'round')
il2Meter.text.removeAttribute('style');
let vl2Meter = new ProgressBar.SemiCircle(l2.querySelector('.volt'), metersOptions.voltMetersOpts);
vl2Meter.path.setAttribute('stroke-linecap', 'round')
vl2Meter.text.removeAttribute('style');

let l3 = document.all.l3;
let il3Meter = new ProgressBar.SemiCircle(l3.querySelector('.current'), metersOptions.ampsMetersOpts);
il3Meter.path.setAttribute('stroke-linecap', 'round')
il3Meter.text.removeAttribute('style');

let vl3Meter = new ProgressBar.SemiCircle(l3.querySelector('.volt'), metersOptions.voltMetersOpts);
vl3Meter.path.setAttribute('stroke-linecap', 'round')
vl3Meter.text.removeAttribute('style');

document.addEventListener('DOMContentLoaded', () => {
  const meters = [activeWmeter, il1Meter, vl1Meter, il2Meter, vl2Meter, il3Meter, vl3Meter];

  meters.forEach(meter => {
    meter.animate(1, metersOptions.animationOpts);
    setTimeout(() => {
      meter.animate(0, metersOptions.animationOpts);
    }, 1000);
  })
})


socket.on('disconnect', function () {
  console.log(socket);
  console.log('disconnected')
});

socket.on('meterData', (frmSrv) => {
  const {
    data,
    meter,
    listId,
    ...rest
  } = frmSrv;

  console.log(frmSrv);
  if (listId === 25 || listId === 35) {
    activeWmeter.animate((data.activePowerPos / metersOptions.maxWatts), metersOptions.animationOpts);
    activeWmeter.setText(`${(data.activePowerPos / 1000).toFixed(3)} kW`)
    if (data.activePowerPos > 0 && data.activePowerPos < 5000) {
      activeWmeter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if (data.activePowerPos > 5000 && data.activePowerPos < 8000) {
      activeWmeter.path.setAttribute('stroke', metersOptions.sColors.warning)
    }
    if (data.activePowerPos > 8000 && data.activePowerPos < metersOptions.maxWatts) {
      activeWmeter.path.setAttribute('stroke', metersOptions.sColors.error)
    }

    il1Meter.animate((data.phases.l1.i / 100) / metersOptions.ampsMax, metersOptions.animationOpts);
    il1Meter.setText(`${(data.phases.l1.i / 100).toFixed(2)} A`)
    if ((data.phases.l1.i / 100) > 0 && (data.phases.l1.i / 100) < metersOptions.ampsAlot) {
      il1Meter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if ((data.phases.l1.i / 100) > metersOptions.ampsAlot && (data.phases.l1.i / 100) < 25) {
      il1Meter.path.setAttribute('stroke', metersOptions.sColors.warning)
    }
    if ((data.phases.l1.i / 100) > 25 && (data.phases.l1.i / 100) < metersOptions.ampsMax) {
      il1Meter.path.setAttribute('stroke', metersOptions.sColors.error)
    }
    vl1Meter.animate(data.phases.l1.v / metersOptions.voltsMax, metersOptions.animationOpts);
    vl1Meter.setText(`${data.phases.l1.v} V`)
    if (data.phases.l1.v > 220 && data.phases.l1.v < 240) {
      vl1Meter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if (data.phases.l1.v < 220 &&
      data.phases.l1.v > 240) {
      vl1Meter.path.setAttribute('stroke', metersOptions.sColors.error)
    }

    il2Meter.animate((data.phases.l2.i / 100) / metersOptions.ampsMax, metersOptions.animationOpts)
    il2Meter.setText(`${(data.phases.l2.i / 100).toFixed(2)} A`)
    if ((data.phases.l2.i / 100) > 0 && (data.phases.l2.i / 100) < metersOptions.ampsAlot) {
      il2Meter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if ((data.phases.l2.i / 100) > metersOptions.ampsAlot && (data.phases.l2.i / 100) < 25) {
      il2Meter.path.setAttribute('stroke', metersOptions.sColors.warning)
    }
    if ((data.phases.l2.i / 100) > 25 && (data.phases.l2.i / 100) < metersOptions.ampsMax) {
      il2Meter.path.setAttribute('stroke', metersOptions.sColors.error)
    }

    vl2Meter.animate(data.phases.l2.v / metersOptions.voltsMax, metersOptions.animationOpts)
    vl2Meter.setText(`${data.phases.l2.v} V`)
    if (data.phases.l2.v > 220 && data.phases.l2.v < 240) {
      vl2Meter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if (data.phases.l2.v < 220 &&
      data.phases.l2.v > 240) {
      vl2Meter.path.setAttribute('stroke', metersOptions.sColors.error)
    }

    il3Meter.animate((data.phases.l3.i / 100) / metersOptions.ampsMax, metersOptions.animationOpts)
    il3Meter.setText(`${(data.phases.l3.i / 100).toFixed(2)} A`)
    if ((data.phases.l3.i / 100) > 0 && (data.phases.l3.i / 100) < metersOptions.ampsAlot) {
      il3Meter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if ((data.phases.l3.i / 100) > metersOptions.ampsAlot && (data.phases.l3.i / 100) < 25) {
      il3Meter.path.setAttribute('stroke', metersOptions.sColors.warning)
    }
    if ((data.phases.l3.i / 100) > 25 && (data.phases.l3.i / 100) < metersOptions.ampsMax) {
      il3Meter.path.setAttribute('stroke', metersOptions.sColors.error)
    }

    vl3Meter.animate(data.phases.l3.v / metersOptions.voltsMax, metersOptions.animationOpts)
    vl3Meter.setText(`${data.phases.l3.v} V`)
    if (data.phases.l3.v > 220 && data.phases.l3.v < 240) {
      vl3Meter.path.setAttribute('stroke', metersOptions.sColors.fine)
    }
    if (data.phases.l3.v < 220 && data.phases.l3.v > 240) {
      vl3Meter.path.setAttribute('stroke', metersOptions.sColors.error)
    }


    lastUpdate.querySelector('h4').textContent = 'bubble';
    // `${data.date.date}/${data.date.month}/${data.date.year}\n${data.date.hour}:${data.date.min}:${data.date.sec}`
  }
  if (listId === 35) {

  }
})
