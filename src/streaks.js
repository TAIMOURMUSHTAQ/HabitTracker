import { addDays, formatDateKey } from './date.js';

export function calculateStreak(habitId, completions, today = new Date()) {
  let streak = 0;
  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  while (completions[`${habitId}-${formatDateKey(cursor)}`]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}