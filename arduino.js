const five = require('johnny-five');

const board = new five.Board();
let temp;
let photoresistor;
let moisture;
board.on('ready', () => {
  temp = new five.Sensor({
    pin: 'A4',
    frequency: 250,
  }); photoresistor = new five.Sensor({
    pin: 'A2',
    frequency: 250,
  }); moisture = new five.Sensor({
    pin: 'A0',
    frequency: 250,
  }); function changeTemp() {
    console.log(this.value);
  } function changeLight() {
    console.log(this.value);
  } function changeMoisture() {
    console.log(this.value);
  } temp.on('data', changeTemp);
  photoresistor.on('data', changeLight);
  moisture.on('data', changeMoisture);
});
