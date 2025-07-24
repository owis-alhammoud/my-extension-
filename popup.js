import { Chess } from './chess.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const pgnEl = document.getElementById('pgn');
  const analysisEl = document.getElementById('analysis');
  const chess = new Chess();

  async function updateAnalysis(pgn) {
    chess.reset();
    try {
      chess.load_pgn(pgn);
    } catch (e) {
      analysisEl.textContent = 'Invalid PGN';
      return;
    }
    const fen = chess.fen();
    try {
      const res = await fetch(
        `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=5`
      );
      if (!res.ok) {
        analysisEl.textContent = 'API error';
        return;
      }
      const data = await res.json();
      if (data.pvs) {
        const lines = data.pvs.map((pv) => pv.moves.split(' ').slice(0, 5).join(' '));
        analysisEl.textContent = lines.join('\n');
      } else {
        analysisEl.textContent = 'No analysis';
      }
    } catch (err) {
      analysisEl.textContent = 'Error fetching analysis';
    }
  }

  function render(pgn) {
    pgnEl.textContent = pgn;
    if (pgn) updateAnalysis(pgn);
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
