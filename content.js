(function() {
  const moves = [];
  let pgn = '';

  function movesToPgn(list) {
    let result = '';
    list.forEach((mv, idx) => {
      if (idx % 2 === 0) {
        result += `${Math.floor(idx / 2) + 1}. `;
      }
      result += mv + ' ';
    });
    return result.trim();
  }

  const saveMoves = () => {
    pgn = movesToPgn(moves);
    chrome.storage.local.set({ moves, pgn });
    chrome.runtime.sendMessage({ pgn, moves: [...moves] });
  };

  function getMovesContainer() {
    return document.querySelector('.vertical-move-list') ||
           document.querySelector('.moves') ||
           document.querySelector('rm6 l4x');
  }

  function captureMoves(container) {
    if (!container) return;
    const moveNodes = container.querySelectorAll('move, .move, kwdb');
    const allMoves = Array.from(moveNodes)
      .map(n => n.textContent.trim())
      .filter(Boolean);
    moves.length = 0;
    moves.push(...allMoves);
    saveMoves();
    console.log('Lichess moves:', moves);
  }

  function observe() {
    const container = getMovesContainer();
    if (!container) {
      setTimeout(observe, 1000);
      return;
    }
    captureMoves(container);
    const observer = new MutationObserver(() => captureMoves(container));
    observer.observe(container, { childList: true, subtree: true });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observe();
  } else {
    document.addEventListener('DOMContentLoaded', observe);
  }
})();
