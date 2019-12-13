/* eslint-disable no-restricted-globals */
/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import './calendar';

const { exec } = require('child_process');
const { remote } = require('electron');

const temp = document.querySelector('.temperature');
const light = document.querySelector('.light');
const moisture = document.querySelector('.moisture');

const tempArray = [];
const lightArray = [];
const moistureArray = [];

document.querySelector('.close-btn').addEventListener('click', (e) => {
  const window = remote.getCurrentWindow();
  window.close();
});

document.querySelector('.maximize-btn').addEventListener('click', (e) => {
  const window = remote.getCurrentWindow();
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
});

document.querySelector('.minimize-btn').addEventListener('click', (e) => {
  const window = remote.getCurrentWindow();
  window.minimize();
});

const addToArrayWithMax = (array, toAdd, max) => {
  if (array.length >= max) {
    array.shift();
    array.push(toAdd);
  } else {
    array.push(toAdd);
  }
};

const getAverageOfArray = (array) => {
  let resp = 0;
  array.forEach((number) => {
    resp += number;
  });
  resp /= array.length;
  return resp;
};

const arduinoHandler = (data) => {
  const dataArray = data.split(':');

  switch (dataArray[0]) {
  case 'temp':
    // console.log(tempArray);
    const tempData = dataArray[1] / 2.38;
    addToArrayWithMax(tempArray, tempData, 10);
    const aavg = getAverageOfArray(tempArray);
    if (!isNaN(aavg)) {
      temp.innerHTML = aavg.toFixed(2);
    }
    break;
  case 'light':
    // console.log(lightArray);
    let lightPercent = (dataArray[1] / 1024) * 100;
    lightPercent -= 100;
    lightPercent *= -1;
    addToArrayWithMax(lightArray, lightPercent, 10);
    const bavg = getAverageOfArray(lightArray);
    if (!isNaN(bavg)) {
      light.innerHTML = bavg.toFixed(2);
    }
    break;
  case 'moisture':
    // console.log(moistureArray);
    let wetPercent = (dataArray[1] / 1024) * 100;
    wetPercent -= 100;
    wetPercent *= -1;
    addToArrayWithMax(moistureArray, wetPercent, 10);
    const cavg = getAverageOfArray(moistureArray);
    if (!isNaN(cavg)) {
      moisture.innerHTML = cavg.toFixed(2);
    }
    break;
  default:
    break;
  }
};

const child = exec('node arduino.js',
  (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });

child.stdout.on('data', (data) => {
  arduinoHandler(data.toString());
});
