import React, { useEffect, useState } from "react";
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

function calculateTimeValues(ms) {
  const units = {
    year: 1000 * 60 * 60 * 24 * 365,
    month: 1000 * 60 * 60 * 24 * 30,
    week: 1000 * 60 * 60 * 24 * 7,
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000,
  };

  const result = {};
  for (const [unit, value] of Object.entries(units)) {
    result[unit] = Math.floor(ms / value);
    ms %= value;
  }

  return result;
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
  const timeValues = calculateTimeValues(timeDifference);

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
