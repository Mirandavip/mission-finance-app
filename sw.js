const CACHE_NAME = 'admira-system-v5'; // Atualizado para v5 (Força limpeza de cache)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './financeiro.html', // Garante que o financeiro seja salvo
  './manifest.json',
  './rocket_logo.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

// Instalação: Baixa os arquivos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o novo Service Worker a assumir imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache v4 aberto');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Ativação: Limpa caches antigos (v1, v2, v3...)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Controla a página imediatamente
});

// Interceptação: Serve os arquivos cacheados quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});


