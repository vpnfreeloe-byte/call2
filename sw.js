// (جديد) تم تغيير اسم الكاش إلى v3
const CACHE_NAME = 'fake-call-cache-v3';

// قائمة الملفات التي سيتم تخزينها للعمل بدون إنترنت
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',

  'fontawesome/all.min.css',

  // (جديد) إضافة جميع الخطوط المطلوبة
  'webfonts/fa-solid-900.woff2', 
  'webfonts/fa-brands-400.woff2',
  'webfonts/fa-regular-400.woff2',

  'sams.mp3',
  'hello.mp3',
  'video_sound.mp3',

  'icon-192.png',
  'icon-512.png'
];

// 1. عند "تثبيت" التطبيق
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) 
  );
});

// (جديد) حذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});


// 2. عند طلب أي ملف
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف موجوداً في الـ cache، قم بإرجاعه
        if (response) {
          return response;
        }
        // إذا لم يكن موجوداً، اذهب للإنترنت
        return fetch(event.request);
      }
    )
  );
});
