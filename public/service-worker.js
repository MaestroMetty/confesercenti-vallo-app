// Service Worker for PWA functionality with offline page

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('offline-assets-v1').then((cache) => {
      return cache.add('/fidelity_card_render.png');
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Handle card image requests
  if (event.request.url.includes('/fidelity_card_render.png')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open('offline-assets-v1').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Only handle navigation requests (page loads)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, serve the offline page HTML
        return new Response(`
          <!DOCTYPE html>
          <html lang="it-IT">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Offline - Energy Team</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f3f4f6;
                min-height: 100vh;
                padding-bottom: 80px;
              }
              .container {
                max-width: 448px;
                margin: 0 auto;
                background: #fafaf9;
                min-height: 100vh;
              }
              .header {
                background: #15803d;
                position: relative;
                overflow: hidden;
                padding: 32px 16px;
              }
              .header::before {
                content: '';
                position: absolute;
                top: -80px;
                left: -80px;
                width: 320px;
                height: 320px;
                background: white;
                opacity: 0.1;
                border-radius: 50%;
              }
              .header::after {
                content: '';
                position: absolute;
                top: -40px;
                right: -40px;
                width: 240px;
                height: 240px;
                background: white;
                opacity: 0.05;
                border-radius: 50%;
              }
              h1 {
                position: relative;
                z-index: 10;
                color: white;
                font-size: 30px;
                font-weight: bold;
                margin-bottom: 24px;
              }
              .content {
                padding: 24px 16px;
              }
              .card-section {
                text-align: center;
                margin-bottom: 32px;
              }
              .card-img {
                width: 100%;
                max-width: 400px;
                height: auto;
                margin: 0 auto 24px;
              }
              .instructions {
                background: white;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                padding: 24px;
                margin-bottom: 24px;
                text-align: center;
              }
              .instructions h2 {
                color: #1f2937;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 16px;
              }
              .instructions p {
                color: #15803d;
                font-size: 18px;
                line-height: 1.6;
              }
              .offline-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 24px;
              }
              .offline-icon {
                width: 24px;
                height: 24px;
                margin-right: 8px;
                color: #eab308;
              }
              .offline-text {
                color: #4b5563;
                font-weight: bold;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>La mia Card</h1>
              </div>
              <div class="content">
                <div class="card-section">
                  <img src="/fidelity_card_render.png" alt="Fidelity Card" class="card-img">
                </div>
                <div class="instructions">
                  <h2>Come utilizzare la tua card</h2>
                  <p>Mostra questa schermata nei negozi per ottenere gli sconti riservati ai soci!</p>
                </div>
                <div class="offline-indicator">
                  <svg class="offline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
                  </svg>
                  <span class="offline-text">Sei Offline<br>Torna online per utilizzare le altre funzionalità</span>
                </div>
              </div>
            </div>
          </body>
          </html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })
    );
  }
});
