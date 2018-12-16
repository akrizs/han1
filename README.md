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

1. The only parser that is ready is the Kamstrup one, if you want to pull on any other parser and work on it, please do so.
2. The UI displays real time values from the electronic meter, allthough it is at the moment only set up for the data from list 2(25) for Kamstrup meters.
3. The program is written as is now on and for Raspberry Pi.
4. There are and will be errors in the program as it is now.
5. This is my first "real" Javascript application with both hardware/backend and frontend.
6. I will be working on Aidon and Kaifa meters as well.

---

# @Todo

- Parsers and display for Kaifa & Aidon.
- Some extra modules.
- noSQL storage option (meanwhile will probably just be json object written to a json file.)
- REST API (the url is active, just doesn't deliver any data.)
- This is the second time i write this program, so there are probably thousand more things to do... please post me a message if you get any ideas.
