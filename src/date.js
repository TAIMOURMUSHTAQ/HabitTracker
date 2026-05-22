const SHORT_WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const LONG_WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const SHORT_MONTH_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const SHORT_MONTH_DAY_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function toStartOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function addDays(date, amount) {
  const value = toStartOfDay(date);
  value.setDate(value.getDate() + amount);
  return value;
}

export function getStartOfWeek(date = new Date()) {
  const value = toStartOfDay(date);
  const mondayOffset = (value.getDay() + 6) % 7;
  value.setDate(value.getDate() - mondayOffset);
  return value;
}

export function shiftWeek(date, weekOffset) {
  return addDays(date, weekOffset * 7);
}

export function getWeekDates(startDate) {
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(date) {
  return formatDateKey(date) === formatDateKey(new Date());
}

export function formatShortWeekday(date) {
  return SHORT_WEEKDAY.format(date);
}

export function formatLongWeekday(date) {
  return LONG_WEEKDAY.format(date);
}

export function formatDayNumber(date) {
  return String(date.getDate());
}

export function formatAccessibleDate(date) {
  return `${formatLongWeekday(date)}, ${SHORT_MONTH_DAY_YEAR.format(date)}`;
}

export function formatWeekRange(startDate, endDate) {
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${SHORT_MONTH_DAY.format(startDate)} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  if (sameYear) {
    return `${SHORT_MONTH_DAY.format(startDate)} - ${SHORT_MONTH_DAY.format(endDate)}, ${endDate.getFullYear()}`;
  }

  return `${SHORT_MONTH_DAY_YEAR.format(startDate)} - ${SHORT_MONTH_DAY_YEAR.format(endDate)}`;
}