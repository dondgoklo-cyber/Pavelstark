/* ============================================================
   Академия ДПО — Service Worker
   Кэширует ядро сайта (HTML, CSS, JS, data/) при первом визите,
   обеспечивает оффлайн-доступ к каталогу программ.
   Стратегия:
     - HTML/навигация: network-first (свежая версия, fallback в кэш)
     - data/*.json, css/js/img: cache-first (быстро, обновление при install)
   ============================================================ */
var CACHE_VERSION = "dpo-cache-v18";
var CORE_ASSETS = [
  "./",
  "index.html",
  "marketplace.html",
  "program.html",
  "courses.html",
  "about.html",
  "contacts.html",
  "faq.html",
  "404.html",
  "css/styles.min.css?v=18",
  "js/components.min.js?v=18",
  "js/cart.min.js?v=18",
  "js/marketplace.min.js?v=18",
  "js/program.min.js?v=18",
  "js/main.min.js?v=18",
  "data/index.json?v=1.0-790",
  "data/programs.json?v=1.0-790",
  "img/favicon.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // Добавляем по одному, чтобы один сбой не завалил весь install
      return Promise.all(
        CORE_ASSETS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn("sw: не удалось закэшировать", url, err);
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);

  // Только same-origin — пропускаем CDN (шрифты, GSAP, Swiper)
  if (url.origin !== self.location.origin) return;

  // Навигация (HTML): network-first с fallback в кэш
  if (req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") !== -1) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match("index.html");
        });
      })
    );
    return;
  }

  // data/*.json, css/js/img: cache-first, затем сеть (с кэшированием ответа)
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // оффлайн и нет в кэше — ничего не поделаешь
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
