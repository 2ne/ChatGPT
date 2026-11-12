const validRank = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
const formatNumber = value => Math.max(0, Number(value) || 0).toLocaleString('en-GB');

export function createScoreRow(entry, rank, { current = false, table = false } = {}) {
  const row = document.createElement('div');
  row.className = `scores-row${Number(rank) === 1 ? ' top' : ''}${current ? ' is-current' : ''}`;
  row.setAttribute('role', table ? 'row' : 'listitem');
  if (current) {
    row.setAttribute('aria-current', 'true');
    row.setAttribute('aria-label', `Your run${validRank(rank) ? `, rank ${rank}` : ''}, ${entry.name}, score ${formatNumber(entry.score)}, wave ${entry.wave}`);
  }
  for (const [column, value] of [
    ['rank', validRank(rank) ? String(rank) : '—'],
    ['score', formatNumber(entry.score)],
    ['wave', formatNumber(entry.wave)],
    ['name', entry.name],
  ]) {
    const cell = document.createElement('span');
    cell.className = `scores-${column}`;
    if (table) cell.setAttribute('role', 'cell');
    cell.textContent = String(value ?? '');
    row.append(cell);
  }
  return row;
}

// Use the server's run ID and overall rank, never a name match or a guessed rank.
export function renderSubmittedBoard(root, result, fallback) {
  const list = root.querySelector('#deathBoardList');
  const outside = root.querySelector('#deathBoardOutside');
  const scores = Array.isArray(result.scores) ? result.scores.slice(0, 25) : [];
  const entry = result.entry || fallback;
  const matching = entry.id == null ? null
    : scores.find(row => String(row.id) === String(entry.id));
  const rank = validRank(entry.rank) ? Number(entry.rank)
    : validRank(matching?.rank) ? Number(matching.rank) : null;
  list.replaceChildren();
  outside.replaceChildren();
  outside.hidden = true;
  let currentRow = null;
  scores.forEach((score, index) => {
    const current = !!matching && String(score.id) === String(entry.id);
    const row = createScoreRow(score, validRank(score.rank) ? Number(score.rank) : index + 1, { current, table: true });
    list.append(row);
    if (current) currentRow = row;
  });
  if (!currentRow) {
    // Keep this row outside the scroll area so even a low-ranked run stays visible.
    currentRow = createScoreRow(entry, rank, { current: true, table: true });
    outside.append(currentRow);
    outside.hidden = false;
  }
  list.hidden = scores.length === 0;
  list.scrollTop = 0;
  requestAnimationFrame(() => {
    if (list.contains(currentRow)) {
      list.scrollTop = currentRow.offsetTop - list.offsetTop
        - (list.clientHeight - currentRow.offsetHeight) / 2;
    }
  });
  return rank;
}
