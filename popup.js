document.addEventListener('DOMContentLoaded', () => {
  const fenEl = document.getElementById('fen');

  function render(fen) {
    fenEl.textContent = fen;
  }

  chrome.runtime.sendMessage('getFEN', (res) => {
    if (res && res.fen) render(res.fen);
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.fen) {
      render(msg.fen);
    }
  });
});
