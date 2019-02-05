import ProgressBar from 'progressbar.js';
import loadingScreen from './modules/loadingScreen';
import {
  mainMenu
} from './modules/_mainMenu';


window.ProgressBar = ProgressBar;


mainMenu.init();

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 77) {
    mainMenu.handleMainMenuToggle.call(mainMenu.BTN, e);
  }
})

const loading = new loadingScreen({
  text: 'Waiting for data!'
})

const metersOptions = {
  activeMeterOpts: {
    color: '#ffffff',
    strokeWidth: 4,
    trailColor: null,
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
    trailColor: null,
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
    trailColor: null,
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




const mainSocket = io.connect('/main');
const errorSocket = io.connect('/error');

window.mainSocket = mainSocket;
window.errorSocket = errorSocket;

errorSocket.on('error', (e) => {
  console.dir(e);
})


let lastUpdate = document.all.lastUpdate;
let activePower = document.all.activePower;

let activeWmeter = new ProgressBar.SemiCircle(activePower.querySelector('.meter'), metersOptions.activeMeterOpts);
activeWmeter.trail.classList.add('meterTrail')
activeWmeter.text.removeAttribute('style');
activeWmeter.path.classList.add('meterGauge')
activeWmeter.path.setAttribute('stroke-linecap', 'round')


let l1 = document.all.l1;
let il1Meter = new ProgressBar.SemiCircle(l1.querySelector('.current'), metersOptions.ampsMetersOpts);
il1Meter.trail.classList.add('meterTrail');
il1Meter.path.setAttribute('stroke-linecap', 'round');
il1Meter.path.classList.add('meterGauge')
il1Meter.text.removeAttribute('style');
let vl1Meter = new ProgressBar.SemiCircle(l1.querySelector('.volt'), metersOptions.voltMetersOpts);
vl1Meter.trail.classList.add('meterTrail');
vl1Meter.path.setAttribute('stroke-linecap', 'round');
vl1Meter.path.classList.add('meterGauge')
vl1Meter.text.removeAttribute('style');


let l2 = document.all.l2;
let il2Meter = new ProgressBar.SemiCircle(l2.querySelector('.current'), metersOptions.ampsMetersOpts);
il2Meter.trail.classList.add('meterTrail')
il2Meter.path.classList.add('meterGauge')
il2Meter.path.setAttribute('stroke-linecap', 'round')
il2Meter.text.removeAttribute('style');

let vl2Meter = new ProgressBar.SemiCircle(l2.querySelector('.volt'), metersOptions.voltMetersOpts);
vl2Meter.trail.classList.add('meterTrail')
vl2Meter.path.classList.add('meterGauge')
vl2Meter.path.setAttribute('stroke-linecap', 'round')
vl2Meter.text.removeAttribute('style');

let l3 = document.all.l3;
let il3Meter = new ProgressBar.SemiCircle(l3.querySelector('.current'), metersOptions.ampsMetersOpts);
il3Meter.trail.classList.add('meterTrail')
il3Meter.path.classList.add('meterGauge')
il3Meter.path.setAttribute('stroke-linecap', 'round')
il3Meter.text.removeAttribute('style');

let vl3Meter = new ProgressBar.SemiCircle(l3.querySelector('.volt'), metersOptions.voltMetersOpts);
vl3Meter.trail.classList.add('meterTrail')
vl3Meter.path.classList.add('meterGauge')
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


mainSocket.on('disconnect', function () {
  loading.enable('Lost Connection')
});

mainSocket.on('reconnect', function () {
  loading.disable()
});

mainSocket.on('meterData', (frmSrv, lastPrice) => {
  const {
    data,
    meter,
    listID,
    manufacturer,
    ...rest
  } = frmSrv;

  if (loading.isActive) {
    loading.disable();
  }

  console.log(frmSrv);

  workThePrice(lastPrice);

  if (listID === 1 || listID === 2 || listID === 3) {
    // Update the activePowerMeter on every list!
    activePowerMeterUpdate.call(activeWmeter, data.aPowPlus, manufacturer)
  }

  if (listID === 2 || listID === 3) {
    currentMetersUpdate.call(il1Meter, data.phases.l1.i, manufacturer);
    currentMetersUpdate.call(il2Meter, data.phases.l2.i, manufacturer);
    currentMetersUpdate.call(il3Meter, data.phases.l3.i, manufacturer);

    voltageMetersUpdate.call(vl1Meter, data.phases.l1.v, manufacturer)
    voltageMetersUpdate.call(vl2Meter, data.phases.l2.v, manufacturer)
    voltageMetersUpdate.call(vl3Meter, data.phases.l3.v, manufacturer)


    const date = new Date(data.time);


    lastUpdate.querySelector('h4').textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    // `${data.date.date}/${data.date.month}/${data.date.year}\n${data.date.hour}:${data.date.min}:${data.date.sec}`
  }
  if (listID === 3) {

  }
})


function workThePrice(price) {
  const {
    current,
    today,
    tomorrow
  } = price;
  let days;

  const cont = document.querySelector('.priceInfo')

  if (today.length && tomorrow.length) {
    days = [today, tomorrow].map(getAvgAndHighHours);
    cont.innerText = `${days[0].str}
    ${days[1].str}`;
  } else if (today.length) {
    days = [today].map(getAvgAndHighHours);
    cont.innerText = days[0].str;
  }



}

function getAvgAndHighHours(day, idx) {
  let dayStr = idx === 0 ? 'Today' : 'Tomorrow';

  const getTotals = (time, idx, arr) => time.total;
  const reducer = (acc, curr, idx, arr) => acc + curr;
  const getHighHours = (avg, hour, idx, arr) => hour.total > avg ? hour : null;
  const getHours = (hour) => {
    let d = new Date(hour.startsAt);
    return d.getHours()
  }

  const totalOnDay = day.map(getTotals).reduce(reducer);
  const avgOnDayBC = (totalOnDay / day.length)
  const avgOnDay = round((avgOnDayBC * 100), 2);
  const highHoursOnDay = day.map(getHighHours.bind(null, avgOnDayBC)).filter(Boolean).map(getHours);
  const avgOnDayStr = `${dayStr}: ${avgOnDay} øre`;

  return {
    avg: avgOnDay,
    avgBf: avgOnDayBC,
    str: avgOnDayStr,
    highHours: highHoursOnDay
  }
}


function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function currentMetersUpdate(pack, manufacturer) {
  let {
    value,
    unit
  } = pack;

  if (manufacturer === 'kamstrup') {
    value = value
  } else {
    value = value * 100;
  }

  value = parseInt(value) / 100

  this.animate(value / metersOptions.ampsMax, metersOptions.animationOpts);
  this.setText(`${value.toFixed(2)} A`)
  if (value > 0 && value < metersOptions.ampsAlot) {
    this.path.setAttribute('stroke', metersOptions.sColors.fine)
  }
  if (value > metersOptions.ampsAlot && value < 25) {
    this.path.setAttribute('stroke', metersOptions.sColors.warning)
  }
  if (value > 25 && value < metersOptions.ampsMax) {
    this.path.setAttribute('stroke', metersOptions.sColors.error)
  }
}

function voltageMetersUpdate(pack, manufacturer) {
  let {
    value,
    unit
  } = pack;

  this.animate(value / metersOptions.voltsMax, metersOptions.animationOpts);
  this.setText(`${value} V`)
  if (value > 220 && value < 240) {
    this.path.setAttribute('stroke', metersOptions.sColors.fine)
  }
  if (value < 220 &&
    value > 240) {
    this.path.setAttribute('stroke', metersOptions.sColors.error)
  }
}

function activePowerMeterUpdate(pack, manufacturer) {
  let {
    value,
    unit
  } = pack;

  this.animate((value / metersOptions.maxWatts), metersOptions.animationOpts);
  this.setText(`${(value / 1000).toFixed(3)} kW`)
  if (value > 0 && value < 5000) {
    this.path.setAttribute('stroke', metersOptions.sColors.fine)
  }
  if (value > 5000 && value < 8000) {
    this.path.setAttribute('stroke', metersOptions.sColors.warning)
  }
  if (value > 8000 && value < metersOptions.maxWatts) {
    this.path.setAttribute('stroke', metersOptions.sColors.error)
  }
}
