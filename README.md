# Satranç Oyun İnceleme

chess.com'daki oyun incelemesine benzer, tamamen tarayıcıda çalışan bir analiz ekranı.
PGN'i yapıştır; Stockfish 17.1 her hamleyi senin bilgisayarında analiz eder, sunucuya hiçbir şey gönderilmez.

- Hamle sınıfları (Muhteşem, Harika, En İyi, Teorik … Büyük Hata), daha iyi hamle ve "bu hamle neye sebep oldu" açıklamaları
- Tahtada oklar, varyant oynatma, taş sürükleyerek kendi hamleni deneme + canlı motor
- "Tekrar dene": hata yaptığın pozisyonda doğru hamleyi kendin bul
- Saat bilgisi olan PGN'lerde düşünme süresi analizi
- lichess formülüyle isabet, gerçek açılış kitabı (lichess chess-openings)
- Analizler tarayıcıda saklanır; ilk açılıştan sonra internetsiz de çalışır

## Çalıştırma

Statik dosyalardan ibaret; herhangi bir web sunucusu yeter (Web Worker'lar `file://` ile çalışmaz):

```sh
python3 -m http.server 8000   # sonra http://localhost:8000
```

Ev sunucusuna Docker ile kurulum (nginx, `restart: unless-stopped`, port 8088):

```sh
deploy/deploy.sh                # varsayılan: yusuf@100.122.73.118
```

## Dosyalar

| Dosya | Ne |
|---|---|
| `index.html` | Uygulamanın tamamı |
| `sw.js`, `manifest.webmanifest`, `icon.svg` | Çevrimdışı çalışma ve "uygulama olarak yükle" |
| `stockfish-17.1-lite-single-*.js/.wasm` | Ana motor |
| `stockfish.js` | Yedek motor (Stockfish 10, WebAssembly'nin engellendiği ortamlar için) |
| `openings.json` | Açılış kitabı (pozisyon özetleri) |
| `vendor/chess.min.js` | Hamle kuralları (chess.js 0.10.3) |
| `fonts/` | Inter, Space Grotesk, JetBrains Mono |

Üçüncü taraf lisansları için `LICENSES.md`.
