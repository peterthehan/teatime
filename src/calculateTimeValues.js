function calculateTimeValues(startDate, endDate) {
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  let year = endDate.getFullYear() - startDate.getFullYear();
  let month = endDate.getMonth() - startDate.getMonth();
  let day = endDate.getDate() - startDate.getDate();
  let hour = endDate.getHours() - startDate.getHours();
  let minute = endDate.getMinutes() - startDate.getMinutes();
  let second = endDate.getSeconds() - startDate.getSeconds();
  let millisecond = endDate.getMilliseconds() - startDate.getMilliseconds();

  if (millisecond < 0) {
    millisecond += 1000;
    --second;
  }

  if (second < 0) {
    second += 60;
    --minute;
  }
  if (minute < 0) {
    minute += 60;
    --hour;
  }
  if (hour < 0) {
    hour += 24;
    --day;
  }

  for (let currentMonth = endDate.getMonth(); day < 0; --currentMonth) {
    const prevMonth = new Date(endDate.getFullYear(), currentMonth, 0);
    day += prevMonth.getDate();
    --month;
  }

  if (month < 0) {
    month += 12;
    --year;
  }

  const week = Math.floor(day / 7);
  day %= 7;

  return { year, month, week, day, hour, minute, second, millisecond };
}

module.exports = { calculateTimeValues };
