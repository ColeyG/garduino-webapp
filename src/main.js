import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';
import './calendar';

const { exec } = require('child_process');
const { remote } = require('electron');

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

const child = exec('node arduino.js',
  (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });

child.stdout.on('data', (data) => {
  console.log(data.toString());
});
