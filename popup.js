document.addEventListener('DOMContentLoaded', () => {
  const pgnEl = document.getElementById('pgn');

  function render(pgn) {
    pgnEl.textContent = pgn;
  }

  chrome.runtime.sendMessage('getPGN', (res) => {
    if (res && res.pgn) render(res.pgn);
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.pgn) {
      render(msg.pgn);
    }
  });
});
