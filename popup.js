import { Chess } from './node_modules/chess.js/dist/esm/chess.js';

document.addEventListener('DOMContentLoaded', () => {
  const pgnEl = document.getElementById('pgn');
  const suggEl = document.getElementById('suggestions');

  async function render(pgn) {
    pgnEl.textContent = pgn;
    suggEl.innerHTML = '';

    if (!pgn) return;

    const chess = new Chess();
    try {
      chess.load_pgn(pgn);
    } catch (err) {
      return;
    }
    const fen = chess.fen();

    try {
      const res = await fetch(
        `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=5`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) throw new Error('net');
      const data = await res.json();
      if (Array.isArray(data.pvs)) {
        data.pvs.slice(0, 5).forEach(pv => {
          const li = document.createElement('li');
          li.textContent = pv.moves.split(' ')[0];
          suggEl.appendChild(li);
        });
      }
    } catch (e) {
      const li = document.createElement('li');
      li.textContent = 'Failed to fetch suggestions';
      suggEl.appendChild(li);
    }
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
