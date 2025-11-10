// (جديد) تم تغيير اسم الكاش إلى v2
const CACHE_NAME = 'fake-call-cache-v2';

// قائمة الملفات التي سيتم تخزينها للعمل بدون إنترنت
const urlsToCache = [
  '.', // الصفحة الرئيسية
  'index.html', // ملف HTML
  'manifest.json', // الملف الذي أنشأناه

  // ملفات Font Awesome المحلية
  'fontawesome/all.min.css',

  // (تم تعديل هذا المسار)
  'webfonts/fa-solid-900.woff2', 

  // ملفات الصوت الافتراضية
  'sams.mp3',
  'hello.mp3',
  'video_sound.mp3',

  // الأيقونات
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
      .then(() => self.skipWaiting()) // (جديد) يجبر على التحديث
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
