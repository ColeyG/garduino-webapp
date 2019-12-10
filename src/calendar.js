const calendarElement = document.querySelector('.calendar');

const leadingZero = (number) => {
  number = `${number}`;
  console.log(number.length);
  if (number.length === 1) {
    return `0${number}`;
  }
  return number;
};

const calendarize = (calendar) => {
  const body = calendar.querySelector('.cal-body');
  const numOfDays = 31;
  const offset = 2;
  for (let i = 0; i < offset; i++) {
    const day = document.createElement('p');
    day.className = 'number-day';
    body.appendChild(day);
  }
  for (let i = 0; i < numOfDays; i++) {
    const day = document.createElement('p');
    day.className = 'number-day';
    day.append(document.createTextNode(leadingZero(i + 1)));
    body.appendChild(day);
  }
};

calendarize(calendarElement);
