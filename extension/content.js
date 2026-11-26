// Shows a "Review" button on finished lichess / chess.com games. Nothing is shown while a game is in progress.
(() => {
  const BTN_ID = 'chess-review-btn';
  let current = null, timer = null, lastHref = '';

  function gameRef() {
    const { hostname, pathname } = location;
    if (hostname === 'lichess.org') {
      const m = pathname.match(/^\/([A-Za-z0-9]{8})(?:[A-Za-z0-9]{4})?(?:\/(?:white|black))?\/?$/);
      return m && { site: 'lichess', id: m[1] };
    }
    if (hostname === 'www.chess.com') {
      const m = pathname.match(/\/game\/(live|daily)\/(\d+)/) || pathname.match(/\/(live|daily)\/game\/(\d+)/);
      return m && { site: 'chesscom', id: `${m[1]}/${m[2]}` };
    }
    return null;
  }

  // 'finished', 'playing', or 'none' (not a game, or the site did not answer).
  async function gameState(ref) {
    if (ref.site === 'lichess') {
      const r = await fetch(`https://lichess.org/game/export/${ref.id}?moves=false`);
      if (!r.ok) return 'none';
      const res = (await r.text()).match(/^\[Result "([^"]*)"\]/m);
      return !res ? 'none' : res[1] === '*' ? 'playing' : 'finished';
    }
    const [kind, num] = ref.id.split('/');
    const r = await fetch(`https://www.chess.com/callback/${kind}/game/${num}`);
    if (!r.ok) return 'none';
    const d = await r.json();
    return !d.game ? 'none' : d.game.isFinished ? 'finished' : 'playing';
  }

  function removeButton() { const b = document.getElementById(BTN_ID); if (b) b.remove(); }
  function showButton(ref) {
    removeButton();
    const b = document.createElement('button');
    b.id = BTN_ID; b.type = 'button'; b.textContent = '♞ Review';
    b.title = 'Open this game in Chess Game Review';
    Object.assign(b.style, {
      position: 'fixed', right: '20px', bottom: '20px', zIndex: '2147483647', padding: '10px 16px', border: '0', borderRadius: '10px',
      background: '#46703a', color: '#fff', font: '600 14px system-ui, sans-serif', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.3)',
    });
    b.onclick = () => chrome.runtime.sendMessage({ type: 'review', site: ref.site, id: ref.id });
    document.body.appendChild(b);
  }

  async function update() {
    clearTimeout(timer); removeButton();
    const ref = gameRef(), key = ref ? ref.site + ':' + ref.id : null;
    current = key;
    if (!ref) return;
    let state = 'none';
    try { state = await gameState(ref); } catch (e) { }
    if (current !== key) return;
    if (state === 'finished') showButton(ref);
    // A game in progress is checked again later, so the button appears once it ends.
    else if (state === 'playing') timer = setTimeout(update, 30000);
  }

  // Both sites change pages without a reload, so watch the address.
  setInterval(() => { if (location.href !== lastHref) { lastHref = location.href; update(); } }, 1000);
})();
