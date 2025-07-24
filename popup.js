document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('moves');
  const pgnEl = document.getElementById('pgn');

  function render(moves, pgn) {
    list.innerHTML = '';
    moves.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      list.appendChild(li);
    });
    pgnEl.textContent = pgn;
  }

  chrome.storage.local.get(['moves', 'pgn'], data => {
    render(data.moves || [], data.pgn || '');
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.pgn) {
      render(msg.moves || [], msg.pgn);
    }
  });
});
