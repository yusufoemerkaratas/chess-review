// Opens the review page in a new tab when the button on a game page is clicked.
chrome.runtime.onMessage.addListener(msg => {
  if (!msg || msg.type !== 'review') return;
  const ok = (msg.site === 'lichess' && /^[A-Za-z0-9]{8}$/.test(msg.id)) || (msg.site === 'chesscom' && /^(live|daily)\/\d+$/.test(msg.id));
  if (ok) chrome.tabs.create({ url: chrome.runtime.getURL(`review.html?site=${msg.site}&id=${encodeURIComponent(msg.id)}`) });
});
