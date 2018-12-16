class han1Profile {
  constructor() {}

  parseDate(mainData) {
    let parsedDate;
    const now = new Date;
    const yearInBin = '0'.concat(Number(now.getFullYear()).toString(16)).match(/.{1,2}/g);

    let pos = mainData
      .toString('hex')
      .match(/.{1,2}/g)
      .map((byte, idx, arr) => {
        if (byte === yearInBin[0] && arr[idx + 1] === yearInBin[1]) {
          return idx
        }
      }).filter(Boolean)[0];

    let y = mainData.readUInt16BE(pos);
    let m = mainData.readUInt8(pos + 2) - 1;
    let d = mainData.readUInt8(pos + 3);
    let wD = mainData.readUInt8(pos + 4);
    let h = mainData.readUInt8(pos + 5);
    let min = mainData.readUInt8(pos + 6);
    let sec = mainData.readUInt8(pos + 7);

    parsedDate = new Date(y, m, d, h, min, sec)

    return {
      'meter': parsedDate,
      'server': now
    }
  }

  async traceObis(mainData) {
    let obises = [];

    return obises
  }
}

module.exports = han1Profile;
