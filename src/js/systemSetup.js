import ProgressBar from 'progressbar.js';
import LoadingScreen from './modules/loadingScreen';

class han1Installation {
  constructor() {
    this.progress = new ProgressBar.Line('#setupProcessBar', {
      easing: 'easeInOut',
      color: '',
      strokeWidth: .5,
      svgStyle: {
        display: 'block',
        width: '100%'
      }
    });
    this.userDefinedSettings = {};
    this.systemDefaultSettings = {};
    this.setupArea = window.document.all.setupContainer
    this.pages = Array.from(this.setupArea.querySelectorAll('[data-han1installation="page"]'));
    this.nextButton = this.setupArea.querySelector('#nextPage');
    this.prevButton = this.setupArea.querySelector('#prevPage');
    this.currentPage = this.pages[0];
    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('Connected to device');
    });
    this.defaultConfigReceived = false;
    this.socket.on('defaultConfig', (defConfig, serialList) => {
      if (!this.defaultConfigReceived) {
        this.systemDefaultSettings = defConfig;
        this.availableSerialPorts = serialList;
        this.generatePages();
        this.defaultConfigReceived = true;
      }
      console.log(this.systemDefaultSettings);
    });
    this.loadingScreen = new LoadingScreen({
      run: false,
      text: 'Default Placeholder text for the loader!',
      animation: 'scroller',
      mainContent: 'MainContent'
    });
    this.init();
  }

  async init() {
    this.nextButton.onclick = this.nextPage.bind(this);
    this.nextButton.onsubmit = this.submitSettings.bind(this);
    this.prevButton.onclick = this.prevPage.bind(this);
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 39) {
        // Right
        this.nextPage(e)
      }
      if (e.keyCode === 37) {
        // Left
        this.prevPage(e)
      }
    })
  }

  nextPage(e) {
    styleAdj.call(this, null, 'next')
  }

  prevPage(e) {
    styleAdj.call(this, null, 'prev')
  }

  submitSettings(e) {
    console.log('submit!')
  }

  generatePages(defConf) {
    defConf = defConf ? defConf : this.systemDefaultSettings;
    let pageTypes = this.pages.map((page, idx) => {
      return [page.dataset.content, idx];
    })

    pageTypes.forEach(page => {
      let [name, id] = page;
      if (name === 'intro') {
        generateIntroPage.call(this, id)
      } else if (name === 'general') {
        generateGeneralPage.call(this, id)
      } else if (name === 'meter') {
        generateMeterPage.call(this, id)
      } else if (name === 'dashboard') {
        generateDashboardPage.call(this, id)
      } else if (name === 'addons') {
        generateAddonsPage.call(this, id)
      } else if (name === 'storage') {
        generateStoragePage.call(this, id)
      } else if (name === 'review') {
        generateReviewPage.call(this, id)
      }
    })
  }

}

window.han1Install = new han1Installation();


function styleAdj(button, dir) {
  button = button ? button : this.nextButton;
  const o = {
    upcomingPage: '',
    firstPage: 0,
    currentPage: this.pages.indexOf(this.currentPage),
    lastPage: this.pages.length - 1,
    currentPageDOM: this.currentPage,
    firstPageDOM: this.pages[0],
    lastPageDOM: this.pages[this.pages.length - 1]
  }

  if (dir === 'next') {
    if (o.currentPage === o.lastPage) {
      button.onsubmit();
      return
    }
    o.upcomingPage = o.currentPage + 1;

  } else if (dir === 'prev') {
    if (o.currentPage === o.firstPage) {
      return
    }
    o.upcomingPage = o.currentPage - 1;
  }

  transitionPages(this.currentPage, this.pages[o.upcomingPage]);

  this.currentPage = this.pages[o.upcomingPage];
  o.currentPage = o.upcomingPage;
  this.progress.animate(o.currentPage / (this.pages.length - 1));

  if (this.currentPage === this.pages[0]) {
    !button.classList.contains('start') ? button.classList.add('start') : null;
    button.classList.contains('save') ? button.classList.remove('save') : null;
    button.classList.contains('next') ? button.classList.remove('next') : null;
    button.title = 'Begin Setup!'
  } else if (this.currentPage === this.pages[this.pages.length - 1]) {
    !button.classList.contains('save') ? button.classList.add('save') : null;
    button.classList.contains('start') ? button.classList.remove('start') : null;
    button.classList.contains('next') ? button.classList.remove('next') : null;
    button.title = 'Save'
  } else {
    !button.classList.contains('next') ? button.classList.add('next') : null;
    button.classList.contains('start') ? button.classList.remove('start') : null;
    button.classList.contains('save') ? button.classList.remove('save') : null;
    button.title = 'Next page!'
  }
  if (o.currentPage !== 0) {
    this.prevButton.style.display = 'block';
    button.parentElement.classList.contains('single') ? button.parentElement.classList.remove('single') : null;
  } else {
    this.prevButton.style.display = 'none';
    !button.parentElement.classList.contains('single') ? button.parentElement.classList.add('single') : null;
  }
}

function transitionPages(curr, next) {
  if (curr.classList.contains('active')) {
    curr.classList.remove('active')
  }
  if (!next.classList.contains('active')) {
    next.classList.add('active')
  }
}

function generateIntroPage(id) {
  let page = this.pages[id]
  page.querySelector('h4.version').innerText = `ver. ${this.systemDefaultSettings.version}`
}

function generateGeneralPage(id) {
  /**
   * Debug
   * host
   * log
   * serial
   */
  let page = this.pages[id]
  let content = document.createElement('div');
  content.classList.add('settingsArea');
  let serialPorts = this.availableSerialPorts.map(sp => {
    let string;
    string = sp.manufacturer === undefined ? `${sp.comName}` : `${sp.manufacturer.trim()}: ${sp.comName}`
    return [string, sp.comName];
  })

  // Host & Log level
  let DOMHostAndLog = document.createElement('div');
  DOMHostAndLog.classList.add('hostAndLog');
  let DOMDebugEnabled = document.createElement('input')
  DOMDebugEnabled.type = 'checkbox';
  let DOMHost = generateSelectElements('host', this.systemDefaultSettings.host)
  let DOMLogLevel = generateSelectElements('loglevel', this.systemDefaultSettings.log)

  DOMHostAndLog.appendChild(DOMHost);
  DOMHostAndLog.appendChild(DOMDebugEnabled);
  DOMHostAndLog.appendChild(DOMLogLevel);

  // Serial Connection values!
  let DOMSerialPort = document.createElement('div');
  let DOMSerials = generateSelectElements('serialPort', serialPorts)
  let DOMSerialBaudRate = document.createElement('input');
  let DOMSerialDataBits = document.createElement('input');
  let DOMSerialStopBits = document.createElement('input');
  let DOMSerialParity = generateSelectElements('serialParity', this.systemDefaultSettings.serial.parity);

  DOMSerialPort.appendChild(DOMSerials);
  DOMSerialPort.appendChild(DOMSerialBaudRate)
  DOMSerialPort.appendChild(DOMSerialDataBits)
  DOMSerialPort.appendChild(DOMSerialStopBits)
  DOMSerialPort.appendChild(DOMSerialParity);

  content.appendChild(DOMHostAndLog);
  content.appendChild(DOMSerialPort);
  page.appendChild(content);
}

function generateMeterPage(id) {
  let page = this.pages[id]
  let content = document.createElement('div');
  content.classList.add('settingsArea');
  // MeterInfo
  let DOMMeter = document.createElement('div');
  let DOMMeterManufacturer = generateSelectElements('serialParity', this.systemDefaultSettings.meter.manufacturer);
  let DOMMeterId = document.createElement('input');
  let DOMMeterSerial = document.createElement('input');
  let DOMMeterType = document.createElement('input');

  DOMMeter.appendChild(DOMMeterManufacturer);
  DOMMeter.appendChild(DOMMeterId);
  DOMMeter.appendChild(DOMMeterSerial);
  DOMMeter.appendChild(DOMMeterType);


  content.appendChild(DOMMeter);
  page.appendChild(content);
}

function generateDashboardPage(id) {
  let page = this.pages[id]
  let content = document.createElement('div');
  content.classList.add('settingsArea');

  let DOMDash = document.createElement('div');
  let DOMDashApi = document.createElement('input');
  DOMDashApi.type = 'checkbox';
  let DOMDashPort = document.createElement('input');

  DOMDash.appendChild(DOMDashPort)
  DOMDash.appendChild(DOMDashApi)

  content.appendChild(DOMDash)
  page.appendChild(content);
}

function generateAddonsPage(id) {
  let page = this.pages[id]
  let content = document.createElement('div');
  content.classList.add('settingsArea');
}

function generateStoragePage(id) {
  let page = this.pages[id]
  let content = document.createElement('div');
  content.classList.add('settingsArea');
}

function generateReviewPage(id) {
  let page = this.pages[id]
  let content = document.createElement('div');
  content.classList.add('settingsArea');
}


function generateSelectElements(wrapper, options) {
  wrapper = typeof wrapper === 'string' ? document.createElement('select') : wrapper;

  wrapper.name = 'serialPorts';

  options.forEach(opt => {
    let option = document.createElement("option");
    if (Array.isArray(opt)) {
      option.text = opt[0];
      option.value = opt[1];
    } else if (typeof opt === 'string') {
      option.text = opt
      option.value = opt;
    }
    wrapper.add(option);
  });
  return wrapper;
}
