const STORAGE_KEY = 'habit-tracker-data-v1';

function createId(prefix = 'habit') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeHabit(habit) {
  return {
    id: String(habit.id ?? createId()),
    name: String(habit.name ?? '').trim(),
    createdAt: String(habit.createdAt ?? new Date().toISOString()),
  };
}

function normalizeCompletions(completions) {
  if (!completions || typeof completions !== 'object') {
    return {};
  }

  return Object.entries(completions).reduce((accumulator, [key, value]) => {
    if (value) {
      accumulator[key] = true;
    }

    return accumulator;
  }, {});
}

export function createHabit(name) {
  return {
    id: createId(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function loadAppState() {
  if (typeof window === 'undefined') {
    return { habits: [], completions: {} };
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return { habits: [], completions: {} };
    }

    const parsedState = JSON.parse(rawState);
    const habits = Array.isArray(parsedState.habits) ? parsedState.habits.map(normalizeHabit).filter((habit) => habit.name) : [];
    const completions = normalizeCompletions(parsedState.completions);

    return { habits, completions };
  } catch {
    return { habits: [], completions: {} };
  }
}

export function saveAppState(state) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload = {
      habits: state.habits,
      completions: state.completions,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage can be unavailable in restrictive browser modes.
  }
}

export function addHabit(state, name) {
  return {
    ...state,
    habits: [...state.habits, createHabit(name)],
  };
}

export function renameHabit(state, habitId, name) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return state;
  }

  return {
    ...state,
    habits: state.habits.map((habit) => (habit.id === habitId ? { ...habit, name: trimmedName } : habit)),
  };
}

export function deleteHabit(state, habitId) {
  const completions = Object.entries(state.completions).reduce((accumulator, [key, value]) => {
    if (!key.startsWith(`${habitId}-`) && value) {
      accumulator[key] = true;
    }

    return accumulator;
  }, {});

  return {
    habits: state.habits.filter((habit) => habit.id !== habitId),
    completions,
  };
}

export function toggleCompletion(state, habitId, dateKey) {
  const completionKey = `${habitId}-${dateKey}`;
  const completions = { ...state.completions };

  if (completions[completionKey]) {
    delete completions[completionKey];
  } else {
    completions[completionKey] = true;
  }

  return {
    ...state,
    completions,
  };
}