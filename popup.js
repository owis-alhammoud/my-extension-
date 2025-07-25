document.addEventListener('DOMContentLoaded', () => {
  const pgnEl = document.getElementById('pgn');
  const fenEl = document.getElementById('fen');

  function render(pgn, fen) {
    pgnEl.textContent = pgn || '';
    if (fenEl) fenEl.textContent = fen || '';
  }

  chrome.runtime.sendMessage('getPGN', (res) => {
    if (res) render(res.pgn, res.fen);
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.pgn || msg.fen) {
      render(msg.pgn, msg.fen);
    }
  });
});
