(function() {
  const moves = [];
  let pgn = '';
  let popupWin;

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

  const sendMoves = () => {
    pgn = movesToPgn(moves);
    chrome.runtime.sendMessage({ pgn, moves: [...moves] }, () => {
      if (chrome.runtime.lastError) {
        console.warn('sendMessage failed:', chrome.runtime.lastError.message);
      }
    });
  };

  function openPopup() {
    if (!popupWin || popupWin.closed) {
      popupWin = window.open(
        chrome.runtime.getURL('popup.html'),
        'lichessPGN',
        'width=300,height=400'
      );
    }
  }

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
    sendMoves();
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
    openPopup();
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'getPGN') {
      sendResponse({ pgn });
    }
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observe();
  } else {
    document.addEventListener('DOMContentLoaded', observe);
  }
})();
