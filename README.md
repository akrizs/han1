# han1

A nodejs project to read from AMS electrical meters through the mbus protocol.

## Still in a major Dev mode.

Short and simple to get startet

Currently just setup for Raspberry Pi!

Using the serial pins.

Clone or download the repo.

```javascript
npm install --only=prod
run node index.js to start the app.
// I have not tested this, so let me know if there is an issue.
run npm install
run node dev.js to work on the project.
```

scream out if you need any help, this is how it will be until the project is ready/done.

# Read Before You Run And Have In Mind

1. The UI displays real time values from the electronic meter, allthough it is at the moment only set up for the data from Kamstrup and Aidon meters!.
2. The program is written "as is now" on and for Raspberry Pi, the program can be run on all other devices that can run node, you just have to edit the serial port receiving the data.
3. There are and will be errors in the program as it is now.
4. This is my first "real" Javascript application with both hardware, backend and frontend.
5. I will be working on Kaifa meters as well.

---

# @Todo

- Parsers and display for Kaifa.
- Some extra modules.
- Setup/Install IF.
- noSQL storage option (meanwhile will probably just be json object written to a file.)
- REST API (the url is active, just doesn't deliver any data.)


# ScreenGIF

![Han1 Dash Opening Sequence](https://media.giphy.com/media/1flyJX30ss7woWjynf/giphy.gif)
![Han1 Dash Power Increase Sequence](https://media.giphy.com/media/2siapMfufIMQYxzenz/giphy.gif)
![Han1 Debug view](https://media.giphy.com/media/RIVJam7MB1zygDldmS/giphy.gif)
