const calendarElement = document.querySelector('.calendar');

const leadingZero = (number) => {
  number = `${number}`;
  console.log(number.length);
  if (number.length === 1) {
    return `0${number}`;
  }
  return number;
};

const calendarize = (calendar, numOfDays, higlightedDays) => {
  const body = calendar.querySelector('.cal-body');
  const offset = 5;
  for (let i = 0; i < offset; i++) {
    const day = document.createElement('p');
    day.className = 'number-day';
    body.appendChild(day);
  }
  for (let i = 0; i < numOfDays; i++) {
    const day = document.createElement('p');
    day.className = 'number-day';
    if (higlightedDays.includes(i + 1)) {
      day.className += ' highlight';
    }
    day.append(document.createTextNode(leadingZero(i + 1)));
    body.appendChild(day);
  }
  calendar.querySelector('.cal-head').style.opacity = 1;
  body.style.opacity = 1;
};

calendarize(calendarElement, 30, [3, 13, 21]);
