(function() {
  const moves = [];
  let fen = '';
  let popupWin;

  const sendData = () => {
    chrome.runtime.sendMessage({ fen, moves: [...moves] });
  };

  function openPopup() {
    if (!popupWin || popupWin.closed) {
      popupWin = window.open(
        chrome.runtime.getURL('popup.html'),
        'lichessFEN',
        'width=300,height=400'
      );
    }
  }

  function getMovesContainer() {
    return document.querySelector('.vertical-move-list') ||
           document.querySelector('.moves') ||
           document.querySelector('rm6 l4x');
  }

  function updateFEN() {
    const board = document.querySelector('cg-board');
    if (board) {
      fen = board.getAttribute('data-fen') || '';
    }
  }

  function captureMoves(container) {
    if (!container) return;
    const moveNodes = container.querySelectorAll('move, .move, kwdb');
    const allMoves = Array.from(moveNodes)
      .map(n => n.textContent.trim())
      .filter(Boolean);
    moves.length = 0;
    moves.push(...allMoves);
    updateFEN();
    sendData();
    console.log('Lichess moves:', moves, 'FEN:', fen);
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
    const board = document.querySelector('cg-board');
    if (board) {
      const boardObserver = new MutationObserver(() => {
        updateFEN();
        sendData();
      });
      boardObserver.observe(board, { attributes: true, attributeFilter: ['data-fen'] });
    }
    openPopup();
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'getFEN') {
      sendResponse({ fen });
    }
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observe();
  } else {
    document.addEventListener('DOMContentLoaded', observe);
  }
})();
