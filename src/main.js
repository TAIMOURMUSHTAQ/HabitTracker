import { addHabit, deleteHabit, loadAppState, renameHabit, saveAppState, toggleCompletion } from './storage.js';
import {
  addDays,
  formatAccessibleDate,
  formatDateKey,
  formatDayNumber,
  formatShortWeekday,
  formatWeekRange,
  getStartOfWeek,
  getWeekDates,
  isToday,
  shiftWeek,
} from './date.js';
import { calculateStreak } from './streaks.js';
import { renderApp } from './ui.js';
import './style.css';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('App root not found.');
}

let state = loadAppState();
let weekOffset = 0;
let liveMessage = '';

function getVisibleWeekStart() {
  return shiftWeek(getStartOfWeek(new Date()), weekOffset);
}

function buildViewModel() {
  const today = new Date();
  const weekStart = getVisibleWeekStart();
  const weekEnd = addDays(weekStart, 6);
  const weekDates = getWeekDates(weekStart).map((date) => ({
    dateKey: formatDateKey(date),
    weekday: formatShortWeekday(date),
    dayNumber: formatDayNumber(date),
    ariaLabel: formatAccessibleDate(date),
    isToday: isToday(date),
  }));

  const habits = state.habits.map((habit) => {
    const streak = calculateStreak(habit.id, state.completions, today);

    return {
      ...habit,
      streak,
      cells: weekDates.map((day) => ({
        ...day,
        checked: Boolean(state.completions[`${habit.id}-${day.dateKey}`]),
      })),
    };
  });

  const todayKey = formatDateKey(today);
  const todayCompleted = state.habits.reduce((count, habit) => {
    return count + (state.completions[`${habit.id}-${todayKey}`] ? 1 : 0);
  }, 0);
  const totalHabits = state.habits.length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((habit) => habit.streak)) : 0;
  const progressPercent = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;

  return {
    weekLabel: formatWeekRange(weekStart, weekEnd),
    weekDates,
    habits,
    todayCompleted,
    totalHabits,
    bestStreak,
    progressPercent,
    isCurrentWeek: weekOffset === 0,
    isFutureWeek: weekOffset > 0,
    liveMessage,
  };
}

function updateState(nextState, message = '') {
  state = nextState;
  liveMessage = message;
  saveAppState(state);
  render();
}

function render() {
  app.innerHTML = renderApp(buildViewModel());
}

app.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-add-form]');

  if (!form) {
    return;
  }

  event.preventDefault();

  const input = form.querySelector('[data-add-input]');
  const habitName = input?.value.trim() ?? '';

  if (!habitName) {
    input?.focus();
    return;
  }

  updateState(addHabit(state, habitName), `Added habit "${habitName}".`);
  app.querySelector('[data-add-input]')?.focus();
});

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');

  if (!button || !app.contains(button)) {
    return;
  }

  const action = button.dataset.action;

  if (action === 'previous-week') {
    weekOffset -= 1;
    liveMessage = 'Viewing the previous week.';
    render();
    return;
  }

  if (action === 'next-week') {
    weekOffset += 1;
    liveMessage = 'Viewing the next week.';
    render();
    return;
  }

  if (action === 'back-this-week') {
    weekOffset = 0;
    liveMessage = 'Returned to the current week.';
    render();
    return;
  }

  if (action === 'focus-add') {
    app.querySelector('[data-add-input]')?.focus();
    return;
  }

  if (action === 'prefill-habit') {
    const input = app.querySelector('[data-add-input]');
    if (input) {
      input.value = button.dataset.value ?? 'Read 30 min';
      input.focus();
      input.select();
    }
    return;
  }

  if (action === 'delete-habit') {
    const habitId = button.dataset.habitId;
    const habitName = button.dataset.habitName ?? 'this habit';

    if (!habitId) {
      return;
    }

    const confirmed = window.confirm(`Delete "${habitName}"? This will remove its history too.`);

    if (!confirmed) {
      return;
    }

    updateState(deleteHabit(state, habitId), `Deleted habit "${habitName}".`);
    return;
  }

  if (action === 'toggle') {
    const habitId = button.dataset.habitId;
    const dateKey = button.dataset.dateKey;
    const habitName = button.dataset.habitName ?? 'habit';
    const dayLabel = button.dataset.dayLabel ?? 'the selected day';

    if (!habitId || !dateKey) {
      return;
    }

    updateState(toggleCompletion(state, habitId, dateKey), `${habitName} updated for ${dayLabel}.`);
  }
});

app.addEventListener('keydown', (event) => {
  const input = event.target.closest('.habit-name-input');

  if (!input) {
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    input.blur();
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    input.value = input.dataset.originalName ?? '';
    input.blur();
  }
});

app.addEventListener(
  'focusout',
  (event) => {
    const input = event.target.closest('.habit-name-input');

    if (!input) {
      return;
    }

    const habitId = input.dataset.habitId;
    const originalName = input.dataset.originalName ?? '';
    const nextName = input.value.trim();

    if (!habitId) {
      return;
    }

    if (!nextName) {
      input.value = originalName;
      return;
    }

    if (nextName !== originalName) {
      updateState(renameHabit(state, habitId, nextName), `Renamed habit to "${nextName}".`);
    }
  },
  true,
);

render();