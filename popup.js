document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('moves');
  chrome.storage.local.get('moves', data => {
    const moves = data.moves || [];
    moves.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      list.appendChild(li);
    });
  });
});
