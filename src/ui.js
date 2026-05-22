export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderStatCard(label, value, detail, meterPercent = 0) {
  return `
    <article class="stat-card">
      <span class="stat-label">${escapeHtml(label)}</span>
      <strong class="stat-value">${escapeHtml(value)}</strong>
      <span class="stat-detail">${escapeHtml(detail)}</span>
      <span class="stat-meter" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, meterPercent))}%"></span></span>
    </article>
  `;
}

function renderWeekNav({ weekLabel, isCurrentWeek, isFutureWeek }) {
  return `
    <section class="toolbar card-surface" aria-label="Week navigation">
      <div class="toolbar-copy">
        <span class="toolbar-label">Current view</span>
        <strong>${escapeHtml(weekLabel)}</strong>
      </div>
      <div class="toolbar-actions">
        <button class="button button--ghost" type="button" data-action="previous-week" aria-label="View previous week">
          Prev week
        </button>
        <button class="button button--ghost" type="button" data-action="next-week" aria-label="View next week">
          Next week
        </button>
        <button
          class="button button--secondary"
          type="button"
          data-action="back-this-week"
          ${isCurrentWeek ? 'disabled' : ''}
          aria-disabled="${isCurrentWeek ? 'true' : 'false'}"
        >
          Back to This Week
        </button>
      </div>
      <p class="toolbar-note">Week starts on Monday. ${isFutureWeek ? 'Future weeks are available and begin empty.' : 'Current week is highlighted.'}</p>
    </section>
  `;
}

function renderEmptyState() {
  return `
    <section class="empty-state card-surface" aria-labelledby="empty-state-title">
      <div class="empty-illustration" aria-hidden="true">
        <div class="empty-orbit empty-orbit--one"></div>
        <div class="empty-orbit empty-orbit--two"></div>
        <div class="empty-orbit empty-orbit--three"></div>
        <div class="empty-emoji">🌱</div>
      </div>
      <div class="empty-copy">
        <p class="eyebrow">Nothing tracked yet</p>
        <h2 id="empty-state-title">Start with one small habit.</h2>
        <p>
          Add a habit like <strong>Read 30 min</strong> or <strong>Drink Water</strong> and your weekly grid,
          streaks, and checkmarks will appear here.
        </p>
        <div class="empty-actions">
          <button class="button button--primary" type="button" data-action="focus-add">Create your first habit</button>
          <button class="button button--ghost" type="button" data-action="prefill-habit" data-value="Read 30 min">
            Try "Read 30 min"
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderDayHeader(day) {
  return `
    <th scope="col" class="day-header ${day.isToday ? 'is-today' : ''}">
      <span class="day-name">${escapeHtml(day.weekday)}</span>
      <span class="day-date">${escapeHtml(day.dayNumber)}</span>
      <span class="sr-only">${escapeHtml(day.ariaLabel)}</span>
    </th>
  `;
}

function renderHabitCell(habit, cell) {
  const checkedClass = cell.checked ? 'is-checked' : '';
  const buttonLabel = `${habit.name}, ${cell.ariaLabel}, ${cell.checked ? 'completed' : 'not completed'}`;

  return `
    <td class="day-cell ${cell.isToday ? 'is-today' : ''}">
      <button
        class="check-button ${checkedClass}"
        type="button"
        data-action="toggle"
        data-habit-id="${escapeHtml(habit.id)}"
        data-habit-name="${escapeHtml(habit.name)}"
        data-date-key="${escapeHtml(cell.dateKey)}"
        data-day-label="${escapeHtml(cell.ariaLabel)}"
        aria-label="${escapeHtml(buttonLabel)}"
        aria-pressed="${cell.checked ? 'true' : 'false'}"
      >
        <span class="check-icon" aria-hidden="true">✓</span>
      </button>
    </td>
  `;
}

function renderHabitRow(habit) {
  const streakLabel = habit.streak === 1 ? '1 day streak' : `${habit.streak} day streak`;

  return `
    <tr class="habit-row">
      <th scope="row" class="habit-cell sticky-column">
        <div class="habit-main">
          <input
            class="habit-name-input"
            type="text"
            value="${escapeHtml(habit.name)}"
            data-habit-id="${escapeHtml(habit.id)}"
            data-original-name="${escapeHtml(habit.name)}"
            aria-label="Rename habit ${escapeHtml(habit.name)}"
            maxlength="60"
          />
          <div class="habit-meta">
            <span class="streak-badge" aria-label="${escapeHtml(streakLabel)}">🔥 ${escapeHtml(String(habit.streak))}</span>
            <button
              class="button button--danger button--icon"
              type="button"
              data-action="delete-habit"
              data-habit-id="${escapeHtml(habit.id)}"
              data-habit-name="${escapeHtml(habit.name)}"
              aria-label="Delete habit ${escapeHtml(habit.name)}"
              title="Delete habit"
            >
              ×
            </button>
          </div>
        </div>
      </th>
      ${habit.cells.map((cell) => renderHabitCell(habit, cell)).join('')}
    </tr>
  `;
}

function renderGrid({ weekDates, habits }) {
  return `
    <section class="grid-card card-surface" aria-label="Weekly habit grid">
      <div class="grid-shell">
        <table class="habit-grid">
          <thead>
            <tr>
              <th scope="col" class="corner-header sticky-column">Habit</th>
              ${weekDates.map(renderDayHeader).join('')}
            </tr>
          </thead>
          <tbody>
            ${habits.map(renderHabitRow).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

export function renderApp(viewModel) {
  const statsMarkup = `
    <section class="stats-grid" aria-label="Summary statistics">
      ${renderStatCard('Today', `${viewModel.todayCompleted} / ${viewModel.totalHabits}`, 'Completed habits today', viewModel.progressPercent)}
      ${renderStatCard('Best streak', `🔥 ${viewModel.bestStreak}`, 'Strongest current streak across habits', Math.min(100, viewModel.bestStreak * 10))}
      ${renderStatCard('Week', viewModel.weekLabel, viewModel.isCurrentWeek ? 'You are viewing the current week' : 'Viewing another week')}
    </section>
  `;

  const contentMarkup = viewModel.habits.length > 0 ? renderGrid(viewModel) : renderEmptyState();

  return `
    <div class="app-shell">
      <header class="hero card-surface">
        <div class="hero-copy">
          <p class="eyebrow">Habit Tracker</p>
          <h1>Track habits with a weekly grid that stays calm and clear.</h1>
          <p>
            Add habits, mark them off across the week, and keep a streak counter that resets the moment today is left unchecked.
          </p>
        </div>

        <form class="add-form" data-add-form>
          <label class="sr-only" for="habit-name-input">Habit name</label>
          <input
            id="habit-name-input"
            class="habit-input"
            type="text"
            name="habit-name"
            placeholder="Add a habit, then press Enter"
            autocomplete="off"
            maxlength="60"
            data-add-input
            aria-label="Add a new habit"
          />
          <button class="button button--primary add-button" type="submit">Add habit</button>
        </form>
      </header>

      ${renderWeekNav(viewModel)}
      ${statsMarkup}
      ${contentMarkup}

      <p class="status-line" aria-live="polite">${escapeHtml(viewModel.liveMessage || '')}</p>
    </div>
  `;
}