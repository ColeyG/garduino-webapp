import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';

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
