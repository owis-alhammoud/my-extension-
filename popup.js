import { Chess } from './vendor/chess.js';

document.addEventListener('DOMContentLoaded', () => {
  const pgnEl = document.getElementById('pgn');
  const movesEl = document.getElementById('moves');

  function render(pgn) {
    pgnEl.textContent = pgn;
    const chess = new Chess();
    movesEl.innerHTML = '';
    try {
      chess.loadPgn(pgn);
      const moves = chess.moves();
      moves.slice(0, 5).forEach(m => {
        const li = document.createElement('li');
        li.textContent = m;
        movesEl.appendChild(li);
      });
    } catch (e) {
      const li = document.createElement('li');
      li.textContent = 'Error parsing PGN';
      movesEl.appendChild(li);
    }
  }

  chrome.runtime.sendMessage('getPGN', (res) => {
    if (chrome.runtime.lastError) {
      console.warn('getPGN failed:', chrome.runtime.lastError.message);
      return;
    }
    if (res && res.pgn) render(res.pgn);
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.pgn) {
      render(msg.pgn);
    }
  });
});
