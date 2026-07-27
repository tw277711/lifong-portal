const CACHE_NAME = 'lifeng-portal-v2'; // 升級版本號以刷新快取
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-192-dark.png',
  'icon-512-dark.png'
];

// 1. 安裝 Service Worker 並預快取所有靜態資源
self.addEventListener('install', (e) => {
  self.skipWaiting(); // 讓新版 Service Worker 立即生效
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. 清除舊版本快取 (避免舊快取干擾新圖示)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 攔截請求：優先從快取讀取，若無則連線獲取
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
