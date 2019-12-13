/* eslint-disable no-restricted-globals */
/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import './calendar';

const { exec } = require('child_process');
const { remote } = require('electron');

const tempArray = [];
const lightArray = [];
const moistureArray = [];

const lineChart = document.querySelector('.line-chart');
lineChart.height = 53;

const myLineChart = new Chart(lineChart, {
  type: 'line',
  data: {
    datasets: [{
      data: [{
        x: 10,
        y: 0,
      }, {
        x: 25,
        y: 5,
      }, {
        x: 20,
        y: 10,
      }],
      backgroundColor: [
        'rgb(255, 205, 86)',
        'rgb(255, 205, 86)',
        'rgb(255, 205, 86)',
      ],
    }],
  },
  options: {
    legend: {
      display: false,
    },
  },
});

function chartWrapper(canvas, color, shade) {
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      datasets: [{
        label: 'Gauge',
        data: [0, 100],
        backgroundColor: [
          color,
          shade,
          'rgb(255, 205, 86)',
        ],
      }],
    },
    options: {
      circumference: Math.PI * 2,
      rotation: Math.PI,
      cutoutPercentage: 80,
      plugins: {
        datalabels: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#ffffff',
          color(context) {
            return context.dataset.backgroundColor;
          },
          font(context) {
            const w = context.chart.width;
            return {
              size: w < 512 ? 18 : 20,
            };
          },
          align: 'start',
          anchor: 'start',
          borderRadius: 4,
        },
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
}

const ctxTemperature = document.querySelector('.chart-temperature');
const chartTemperature = chartWrapper(ctxTemperature, '#ffa37c', '#ffe4d9');

const ctxLight = document.querySelector('.chart-light');
const chartLight = chartWrapper(ctxLight, '#439a86', '#e3fff8');

const ctxMoisture = document.querySelector('.chart-moisture');
const chartMoisture = chartWrapper(ctxMoisture, '#4cb27c', '#c4ffe0');

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
    const tempData = dataArray[1] / 2.38;
    addToArrayWithMax(tempArray, tempData, 100);
    const aavg = getAverageOfArray(tempArray);
    if (!isNaN(aavg)) {
      chartTemperature.data.datasets.forEach((data) => {
        data.data = [aavg.toFixed(2) * 4, aavg.toFixed(2) * 4 - 200];
      });

      chartTemperature.update();
      document.querySelector('.tempamount').innerHTML = aavg.toFixed(2);
    }
    break;
  case 'light':
    let lightPercent = (dataArray[1] / 1024) * 100;
    lightPercent -= 100;
    lightPercent *= -1;
    addToArrayWithMax(lightArray, lightPercent, 100);
    const bavg = getAverageOfArray(lightArray);
    if (!isNaN(bavg)) {
      chartLight.data.datasets.forEach((data) => {
        data.data = [bavg.toFixed(2) * 2, bavg.toFixed(2) * 2 - 200];
      });

      chartLight.update();
      document.querySelector('.lightamount').innerHTML = bavg.toFixed(2);
    }
    break;
  case 'moisture':
    let wetPercent = (dataArray[1] / 1024) * 100;
    wetPercent -= 100;
    wetPercent *= -1;
    addToArrayWithMax(moistureArray, wetPercent, 100);
    const cavg = getAverageOfArray(moistureArray);
    if (!isNaN(cavg)) {
      chartMoisture.data.datasets.forEach((data) => {
        data.data = [cavg.toFixed(2) * 2, cavg.toFixed(2) * 2 - 200];
      });

      chartMoisture.update();
      document.querySelector('.moistureamount').innerHTML = cavg.toFixed(2);
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
