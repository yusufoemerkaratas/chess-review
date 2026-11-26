# Chess Game Review

A game review screen similar to chess.com's, running entirely in the browser.
Paste a PGN; Stockfish 17.1 analyzes every move on your own computer, nothing is sent to a server.

- Move classes (Brilliant, Great, Best, Book … Blunder), the better move and "what this move led to" explanations
- Arrows on the board, playing through variations, dragging pieces to try your own moves + live engine
- "Try again": find the right move yourself in the positions where you went wrong
- Thinking-time analysis for PGNs with clock data
- Accuracy with the lichess formula, a real opening book (lichess chess-openings)
- English and Turkish interface (EN/TR switch in the header)
- Analyses are stored in the browser; after the first visit it also works offline

## Running

Static files only; any web server will do (Web Workers do not run from `file://`):

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Install on a home server with Docker (nginx, `restart: unless-stopped`, port 8088):

```sh
deploy/deploy.sh                # default: yusuf@100.122.73.118
```

## Browser extension

The `extension/` folder turns the app into an extension for Chrome-family browsers (Chrome, Edge, Brave, Opera) and Firefox.
On a **finished** lichess.org or chess.com game it shows a "Review" button that opens the game in a new tab.
No button is shown while a game is in progress, and the review page refuses unfinished games.

```sh
extension/build.sh              # writes extension/dist/
```

- Chrome family: open `chrome://extensions`, turn on Developer mode, "Load unpacked", choose `extension/dist`.
- Firefox: open `about:debugging#/runtime/this-firefox`, "Load Temporary Add-on", choose `extension/dist/manifest.json`
  (temporary add-ons are removed when Firefox closes). If the button does not appear, allow the extension to access
  lichess.org and chess.com in its permissions in `about:addons`.

The PGN comes from lichess's game export and from chess.com's public games archive.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app, including the EN/TR texts |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Offline use and "install as app" |
| `stockfish-17.1-lite-single-*.js/.wasm` | Main engine |
| `stockfish.js` | Fallback engine (Stockfish 10, for environments that block WebAssembly) |
| `openings.json` | Opening book (position digests) |
| `vendor/chess.min.js` | Move rules (chess.js 0.10.3) |
| `fonts/` | Inter, Space Grotesk, JetBrains Mono |
| `extension/` | Browser extension (manifest, content/background/review scripts, icons, build script) |

See `LICENSES.md` for third-party licenses.
