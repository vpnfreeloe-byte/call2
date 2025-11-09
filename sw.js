// اسم ذاكرة التخزين المؤقت
const CACHE_NAME = 'fake-call-cache-v1';

// قائمة الملفات التي سيتم تخزينها للعمل بدون إنترنت
const urlsToCache = [
  '.', // الصفحة الرئيسية
  'index.html', // ملف HTML (افترض أن اسمه index.html)
  'manifest.json', // الملف الذي أنشأناه
  
  // ملفات Font Awesome المحلية
  'fontawesome/all.min.css',
  'fontawesome/webfonts/fa-solid-900.woff2',
  
  // ملفات الصوت الافتراضية
  'sams.mp3',
  'hello.mp3',
  'video_sound.mp3',
  
  // الأيقونات
  'icon-192.png',
  'icon-512.png'
];

// 1. عند "تثبيت" التطبيق (أول مرة)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. عند طلب أي ملف (مثل فتح التطبيق)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف موجوداً في الـ cache، قم بإرجاعه
        if (response) {
          return response;
        }
        // إذا لم يكن موجوداً، اذهب للإنترنت (للحالات النادرة)
        return fetch(event.request);
      }
    )
  );
});