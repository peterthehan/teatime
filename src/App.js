import { useEffect, useState } from "react";
import "./styles.css";

const TITLE_URL_PARAM = "title";
const DATE_URL_PARAM = "date";
const DEFAULT_DATE = new Date("2024-11-11T00:00:00");

function getTitleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get(TITLE_URL_PARAM);
}

function getDateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get(DATE_URL_PARAM);
  if (dateParam == null) {
    return DEFAULT_DATE;
  }

  const date = new Date(`${dateParam}T00:00:00`);
  if (isNaN(date)) {
    return DEFAULT_DATE;
  }

  return date;
}

function calculateTimeValues(startDate, endDate) {
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  let temp = new Date(startDate);

  function addUnit(unit, value) {
    let test = new Date(temp);
    if (unit === "year") test.setFullYear(test.getFullYear() + value);
    if (unit === "month") test.setMonth(test.getMonth() + value);
    if (unit === "day") test.setDate(test.getDate() + value);
    if (unit === "hour") test.setHours(test.getHours() + value);
    if (unit === "minute") test.setMinutes(test.getMinutes() + value);
    if (unit === "second") test.setSeconds(test.getSeconds() + value);
    return test <= endDate ? test : null;
  }

  function countUnit(unit) {
    let value = 0;
    while (addUnit(unit, value + 1)) {
      ++value;
    }
    temp = addUnit(unit, value) ?? temp;
    return value;
  }

  const year = countUnit("year");
  const month = countUnit("month");
  let day = countUnit("day");
  const week = Math.floor(day / 7);
  day %= 7;
  const hour = countUnit("hour");
  const minute = countUnit("minute");
  const second = countUnit("second");

  return { year, month, week, day, hour, minute, second };
}

function filterLeadingZeroes(timeValues) {
  const entries = Object.entries(timeValues);
  const index = entries.findIndex(([, value]) => value !== 0);

  return entries.slice(index);
}

function pluralize(value, unit) {
  return value === 1 ? unit : `${unit}s`;
}

function App() {
  const title = getTitleFromUrl();
  const date = getDateFromUrl();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeDifference = Math.abs(now - date);
  const timeValues = calculateTimeValues(date, now);

  const displayTimeValues = filterLeadingZeroes(timeValues).map(
    ([unit, value]) => ({
      value,
      unit: pluralize(value, unit),
    })
  );

  const dateString = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateLabel =
    timeDifference < 1000
      ? null
      : date > now
        ? `until ${dateString}`
        : `since ${dateString}`;

  return (
    <div className="container">
      {title && <div className="label">{title}</div>}
      <div className="timer">
        {displayTimeValues.map(({ value, unit }, index) => (
          <div className="time" key={index}>
            <span className="time-value">{value}</span>
            <span className="time-unit">{unit}</span>
          </div>
        ))}
      </div>
      {dateLabel && <div className="label">{dateLabel}</div>}
    </div>
  );
}

export default App;
