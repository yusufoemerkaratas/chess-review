/* Extension only: loads the game named in the address (?site=lichess|chesscom&id=...) into the review app.
   Games that are still in progress are refused. */
(async () => {
  const q = new URLSearchParams(location.search), site = q.get('site'), id = q.get('id') || '';
  if (!site) return;
  const say = (en, tr) => LANG === 'tr' ? tr : en;
  const fail = msg => { openLoader(); showErr(msg); };

  async function lichessPgn() {
    if (!/^[A-Za-z0-9]{8}$/.test(id)) throw new Error('bad game id');
    const r = await fetch(`https://lichess.org/game/export/${id}?clocks=true&evals=false&literate=false`);
    if (!r.ok) throw new Error('lichess HTTP ' + r.status);
    return r.text();
  }
  // chess.com: the game endpoint says whether it is over and who played; the public archive has the PGN.
  async function chesscomPgn() {
    const m = id.match(/^(live|daily)\/(\d+)$/);
    if (!m) throw new Error('bad game id');
    const r = await fetch(`https://www.chess.com/callback/${m[1]}/game/${m[2]}`);
    if (!r.ok) throw new Error('chess.com HTTP ' + r.status);
    const g = (await r.json()).game;
    if (!g || !g.isFinished) return null;
    const end = new Date(g.endTime * 1000), month = String(end.getUTCMonth() + 1).padStart(2, '0');
    const user = encodeURIComponent(String(g.pgnHeaders.White).toLowerCase());
    const a = await fetch(`https://api.chess.com/pub/player/${user}/games/${end.getUTCFullYear()}/${month}`);
    if (!a.ok) throw new Error('chess.com archive HTTP ' + a.status);
    const hit = ((await a.json()).games || []).find(x => x.url && x.url.endsWith('/' + m[2]));
    if (!hit) throw new Error(say('the game is not in the public archive yet, try again in a minute', 'oyun henüz herkese açık arşivde değil, bir dakika sonra tekrar dene'));
    if (hit.rules !== 'chess') throw new Error(say('only standard chess is supported', 'sadece standart satranç destekleniyor'));
    return hit.pgn;
  }

  try {
    const pgn = site === 'lichess' ? await lichessPgn() : site === 'chesscom' ? await chesscomPgn() : null;
    if (!pgn || !/^\[Result "(1-0|0-1|1\/2-1\/2)"\]/m.test(pgn)) {
      fail(say('This game is still in progress. Reviews are only available for finished games.', 'Bu oyun hâlâ devam ediyor. İnceleme sadece bitmiş oyunlar için açılır.'));
      return;
    }
    const v = pgn.match(/^\[Variant "([^"]*)"\]/m);
    if (v && !/^(Standard|From Position)$/.test(v[1])) { fail(say('Only standard chess is supported.', 'Sadece standart satranç destekleniyor.')); return; }
    loadGame(pgn, 'normal');
  } catch (e) {
    fail(say('Could not load the game: ', 'Oyun yüklenemedi: ') + e.message);
  }
})();
