import loadingScreen from './modules/loadingScreen';

const dbgConn = io.connect('/debug')

const dbgHexTbl = document.all.debugHexTable;

const obisTable = document.all.obisTable;

let waitig = true;
let frozen = false;

let waitscreen = new loadingScreen({
  text: 'Waiting for data!',
  animation: 'scroller'
});

window.waitscreen = waitscreen;

createFreezeButton();



dbgConn.on('dbgData', (frmSrv) => {
  const {
    hexified,
    obis,
    date,
    raw,
    ...rest
  } = frmSrv;

  if (waitscreen.isActive) {
    waitscreen.disable();
  }

  if (!frozen) {
    debugHexTable(date, hexified, obis, raw.ctrl.frameSize);
    generateObisTable(raw.manufacturer, null, obis);
    addEvListenersToTables();
    console.log(frmSrv);
  } else {
    console.log('The data stream is frozen!')
  }



})

function addEvListenersToTables() {
  Array.from(obisTable.tBodies[0].rows).map(row => {
    row.addEventListener('click', function () {
      this.classList.toggle('selected')

      let bStart, bEnd, obStart, obEnd, rowl = row.cells.length,
        hexTable, bytes, nOBytes;
      bStart = parseInt(row.cells[rowl - 2].innerText)
      bEnd = parseInt(row.cells[rowl - 1].innerText)
      obStart = parseInt(row.cells[rowl - 4].innerText)
      obEnd = parseInt(row.cells[rowl - 3].innerText)

      bytes = (bEnd - bStart) + (obEnd - obStart) + 2;
      obStart = obStart - 2;

      hexTable = document.querySelector('.dbgHexTblContent')

      for (let i = 0; i < hexTable.children.length; i++) {
        let byte = hexTable.children[i];
        if (obStart > i || i > (obStart + bytes - 1)) {
          byte.classList.toggle('dl');
        }
      }
    })
  });
}

function generateObisTable(mfact, listNr, obisVals) {
  const tableHeader = document.all.obisTable.tHead;
  tableHeader.rows[2].cells[0].innerText = listNr;
  const tableBody = document.all.obisTable.tBodies[0];

  let nr = 1;
  const obisRows = obisVals.map(obis => {
    let [str, type, obStart, obEnd, dStart, dEnd] = obis
    let obisArray = str.split(/-|:|\./gi).map(ob => {
      return parseInt(ob);
    });
    let [a, b, c, d, e, f] = obisArray

    if (mfact === 'kamstrup') {
      if (type.match(/^(int)(\d)(bytes)/gi)) {
        type = 'u'.concat(type);
      }
    }

    obisArray.push(str)

    let row = [`<tr>`,
      `<td class="obisListIdNr">${nr++}</td>`,
      `<td class="obisGroup obisGroup__A">${a}</td>`,
      `<td class="obisGroup obisGroup__B">${b}</td>`,
      `<td class="obisGroup obisGroup__C">${c}</td>`,
      `<td class="obisGroup obisGroup__D">${d}</td>`,
      `<td class="obisGroup obisGroup__E">${e}</td>`,
      `<td class="obisGroup obisGroup__F">${f}</td>`,
      `<td class="obis__name">${findObisName(obisArray, mfact)}</td>`,
      `<td class="obis__unit">${findUnitType(obisArray, mfact)}</td>`,
      `<td class="obis__dataType">${type}</td>`,
      `<td class="obis__obis_byteStart">${obStart}</td>`,
      `<td class="obis__obis_byteEnd">${obEnd}</td>`,
      `<td class="obis__value_byteStart">${dStart}</td>`,
      `<td class="obis__value_byteEnd">${dEnd}</td>`,
      `</tr>`
    ]
    return row.join('');
  }).join('')

  tableBody.innerHTML = obisRows;
}


function debugHexTable(date, hexified, obisVals, size) {
  let meterDate = new Date(date.meter);
  let serverDate = new Date(date.server);

  let rL = hexified.split('\n').filter(Boolean).length
  let no = -1;
  let obS, dS, octrlS, dctrlS;
  const webified = hexified
    .split('\n')
    .filter(Boolean)
    .map(row => row.trim())
    .map((row) => {
      let bytes = row.split(' ').map((byte) => {
        no++
        let t = '';
        obisVals.map((obis, idx) => {
          let [str, type, obStart, obEnd, dStart, dEnd] = obis
          if (no === parseInt(obStart) - 2) {
            octrlS = true;
          }
          if (no === parseInt(obStart)) {
            octrlS = false;
            obS = true
          }
          if (no - 1 === parseInt(obEnd)) {
            obS = false;
          }
          if (no === parseInt(dStart)) {
            dctrlS = true;
          }
          if (no === parseInt(dStart) + 1) {
            dctrlS = false;
            dS = true
          }
          if (no === parseInt(dEnd) - 1) {
            dS = false;
          }
        });

        if (octrlS) {
          t = 'obisCtrl'
        }
        if (obS) {
          t = 'obis';
        }
        if (dctrlS) {
          if (t != 'obisCtrl') {
            t = 'dataCtrl'
          }
        }
        if (dS) {
          t = 'data';
        }

        if (no === 0 || no === (size + 1)) {
          t = 'fsef'
        }

        if (no === (size) || no === (size - 1)) {
          t = 'fcs'
        }

        if (no === 1) {
          t = 'frameFormat'
        }

        if (no === 2) {
          t = 'frameSize'
        }

        if (no === 3) {
          t = 'destAddr'
        }

        if (no === 4) {
          t = 'srcAddr'
        }

        if (no === 5) {
          t = 'ctrlField'
        }

        if (no === 6 || no === 7) {
          t = 'hcs'
        }

        if (no === (size - 2)) {
          t = 'data';
        }


        return `<p class="byte${t ? ' ' + t : ''}" data-byteNr="${no}" data-type="${t}">${byte}</p>`
      }).join(' ')
      return bytes;
    }).join('\n')

  let packLength = no + 1;

  dbgHexTbl.querySelector('.dbgHexTblDateTime').innerText = `${meterDate.toLocaleDateString()} ${meterDate.toLocaleTimeString()}`;
  dbgHexTbl.querySelector('.dbgHexTblAddInfo').innerText = `Length: ${packLength}`;
  dbgHexTbl.querySelector('.dbgHexTblContent').innerHTML = webified;
}


function findObisName(obis, mfact) {
  const [a, b, c, d, e, f, str] = obis;
  if (str === '1-1:0.2.129.255') {
    return 'Obis List Version Identifier'
  }
  if (str === '1-1:0.0.5.255' || str === '0-0:96.1.0.255') {
    return 'Meter ID (GIAI GS1 16 Digit)'
  }
  if (str === '1-1:96.1.1.255' || str === '0-0:96.1.7.255') {
    return 'Meter Type'
  }
  if (str === '1-1:1.7.0.255' || str === '1-0:1.7.0.255') {
    return 'Active Power + (Q1+Q4)'
  }
  if (str === '1-1:2.7.0.255' || str === '1-0:2.7.0.255') {
    return 'Active Power - (Q2+Q3)'
  }
  if (str === '1-1:3.7.0.255' || str === '1-0:3.7.0.255') {
    return 'Reactive Power + (Q1+Q2)'
  }
  if (str === '1-1:4.7.0.255' || str === '1-0:4.7.0.255') {
    return 'Reactive Power - (Q3-Q4)'
  }
  if (str === '1-1:31.7.0.255' || str === '1-0:31.7.0.255') {
    return 'IL1 Current Phase L1'
  }
  if (str === '1-1:51.7.0.255' || str === '1-0:51.7.0.255') {
    return 'IL2 Current Phase L2'
  }
  if (str === '1-1:71.7.0.255' || str === '1-0:71.7.0.255') {
    return 'IL3 Current Phase L3'
  }
  if (str === '1-1:32.7.0.255' || str === '1-0:32.7.0.255') {
    return 'ULN1 Phase Voltage 4W meter, Line voltage 3W meter.'
  }
  if (str === '1-1:52.7.0.255' || str === '1-0:52.7.0.255') {
    return 'ULN2 Phase Voltage 4W meter, Line voltage 3W meter.'
  }
  if (str === '1-1:72.7.0.255' || str === '1-0:72.7.0.255') {
    return 'ULN3 Phase Voltage 4W meter, Line voltage 3W meter.'
  }
  if (str === '0-1:1.0.0.255' || str === '0-0:1.0.0.255') {
    return 'Clock and Date in meter'
  }
  if (str === '1-1:1.8.0.255' || str === '1-0:1.8.0.255') {
    return 'Cumulative hourly active import energy (A+)(Q1+Q4)'
  }
  if (str === '1-1:2.8.0.255' || str === '1-0:2.8.0.255') {
    return 'Cumulative hourly active export energy (A-)(Q2+Q3)'
  }
  if (str === '1-1:3.8.0.255' || str === '1-0:3.8.0.255') {
    return 'Cumulative hourly reactive import energy (R+)(Q1+Q2)'
  }
  if (str === '1-1:4.8.0.255' || str === '1-0:4.8.0.255') {
    return 'Cumulative hourly reactive export energy (R-)(Q3+Q4)'
  }
}

function findUnitType(obis, mfact) {
  const [a, b, c, d, e, f, str] = obis;
  if (str === '1-1:0.2.129.255' ||
    str === '1-1:0.0.5.255' ||
    str === '1-1:96.1.1.255' ||
    str === '0-1:1.0.0.255') {
    return ''
  }
  if (str === '1-1:1.7.0.255' || str === '1-1:2.7.0.255') {
    return 'kW'
  }
  if (str === '1-1:3.7.0.255' || str === '1-1:4.7.0.255') {
    return 'kVAr'
  }
  if (str === '1-1:31.7.0.255' ||
    str === '1-1:51.7.0.255' ||
    str === '1-1:71.7.0.255') {
    return 'A'
  }
  if (str === '1-1:32.7.0.255' || str === '1-1:52.7.0.255' || str === '1-1:72.7.0.255') {
    return 'V'
  }
  if (str === '1-1:1.8.0.255' || str === '1-1:2.8.0.255') {
    return 'kWh'
  }
  if (str === '1-1:3.8.0.255' || str === '1-1:4.8.0.255') {
    return 'kVArh'
  }
}

function createFreezeButton() {
  const freezeButton = document.createElement('button');
  freezeButton.classList.add('freezeButton');
  freezeButton.id = 'freezer';
  freezeButton.innerText = 'Freeze Data';
  freezeButton.onclick = function () {
    frozen = frozen === false ? true : false;
    this.innerText = frozen === false ? 'Freeze Data' : 'Data is Frozen!';
    frozen ? this.dataset.frozen = '' : delete this.dataset.frozen;
  }

  document.body.insertAdjacentElement('afterbegin', freezeButton);
}
