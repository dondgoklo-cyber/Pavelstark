/* ============================================================
   Академия ДПО — geo-data.js
   Географические данные: 30 городов присутствия.

   Каждый город содержит:
     slug        — идентификатор для URL (city.html?city=moscow)
     name        — название для отображения
     region      — субъект/регион
     phone       — локальный телефон
     address     — адрес филиала/представительства
     metro       — ближайшая станция (опц.)
     coords      — {lat, lon} для карты
     schedule    — расписание работы
     courseSlugs — массив id курсов из config.COURSES, доступных в городе
     timezone    — часовой пояс

   Читается js/components.js (city selector) и city.html (рендер страницы).
   Подключается ПОСЛЕ config.js, ДО components.js:
     <script src="js/config.js" defer></script>
     <script src="js/geo-data.js" defer></script>
     <script src="js/components.js" defer></script>
   ============================================================ */
(function () {
  "use strict";

  /* Короткая ссылка на список курсов из конфига (для валидации) */
  const ALL_COURSE_IDS = (window.ACADEMY_CONFIG && window.ACADEMY_CONFIG.COURSES
    ? window.ACADEMY_CONFIG.COURSES
    : []
  ).map((c) => c.id);

  const CITIES = [
    { slug: "moscow", name: "Москва", region: "Московская область", phone: "+7 (495) 000-00-01", address: "г. Москва, ул. Образования, 1", metro: "м. Лубянка", coords: { lat: 55.7558, lon: 37.6173 }, schedule: "Пн–Пт 9:00–20:00, Сб 10:00–17:00", courseSlugs: ALL_COURSE_IDS, timezone: "MSK (UTC+3)" },
    { slug: "spb", name: "Санкт-Петербург", region: "Ленинградская область", phone: "+7 (812) 000-00-02", address: "г. Санкт-Петербург, Невский пр., 100", metro: "м. пл. Восстания", coords: { lat: 59.9343, lon: 30.3351 }, schedule: "Пн–Пт 9:00–20:00, Сб 10:00–17:00", courseSlugs: ALL_COURSE_IDS, timezone: "MSK (UTC+3)" },
    { slug: "novosibirsk", name: "Новосибирск", region: "Новосибирская область", phone: "+7 (383) 000-00-03", address: "г. Новосибирск, Красный пр., 50", metro: "м. пл. Ленина", coords: { lat: 55.0084, lon: 82.9357 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 5), timezone: "MSK+4 (UTC+7)" },
    { slug: "ekaterinburg", name: "Екатеринбург", region: "Свердловская область", phone: "+7 (343) 000-00-04", address: "г. Екатеринбург, ул. Ленина, 25", metro: "м. пл. 1905 года", coords: { lat: 56.8389, lon: 60.6057 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 5), timezone: "MSK+2 (UTC+5)" },
    { slug: "kazan", name: "Казань", region: "Республика Татарстан", phone: "+7 (843) 000-00-05", address: "г. Казань, ул. Баумана, 40", metro: "м. Кремлёвская", coords: { lat: 55.8304, lon: 49.0661 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK (UTC+3)" },
    { slug: "nnovgorod", name: "Нижний Новгород", region: "Нижегородская область", phone: "+7 (831) 000-00-06", address: "г. Нижний Новгород, ул. Большая Покровская, 30", metro: "м. Горьковская", coords: { lat: 56.2965, lon: 43.9361 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK (UTC+3)" },
    { slug: "chelyabinsk", name: "Челябинск", region: "Челябинская область", phone: "+7 (351) 000-00-07", address: "г. Челябинск, пр. Ленина, 21", metro: null, coords: { lat: 55.1644, lon: 61.4368 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK+2 (UTC+5)" },
    { slug: "samara", name: "Самара", region: "Самарская область", phone: "+7 (846) 000-00-08", address: "г. Самара, ул. Куйбышева, 90", metro: null, coords: { lat: 53.2415, lon: 50.2212 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK+1 (UTC+4)" },
    { slug: "omsk", name: "Омск", region: "Омская область", phone: "+7 (381) 000-00-09", address: "г. Омск, ул. Ленина, 20", metro: null, coords: { lat: 54.9885, lon: 73.3242 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK+3 (UTC+6)" },
    { slug: "rostov", name: "Ростов-на-Дону", region: "Ростовская область", phone: "+7 (863) 000-00-10", address: "г. Ростов-на-Дону, ул. Большая Садовая, 50", metro: null, coords: { lat: 47.2357, lon: 39.7015 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 5), timezone: "MSK (UTC+3)" },
    { slug: "ufa", name: "Уфа", region: "Республика Башкортостан", phone: "+7 (347) 000-00-11", address: "г. Уфа, ул. Карла Маркса, 32", metro: null, coords: { lat: 54.7388, lon: 55.9721 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK+2 (UTC+5)" },
    { slug: "krasnoyarsk", name: "Красноярск", region: "Красноярский край", phone: "+7 (391) 000-00-12", address: "г. Красноярск, пр. Мира, 90", metro: null, coords: { lat: 56.0153, lon: 92.8932 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK+4 (UTC+7)" },
    { slug: "voronezh", name: "Воронеж", region: "Воронежская область", phone: "+7 (473) 000-00-13", address: "г. Воронеж, ул. Революции 1905 года, 35", metro: null, coords: { lat: 51.6608, lon: 39.2003 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK (UTC+3)" },
    { slug: "perm", name: "Пермь", region: "Пермский край", phone: "+7 (342) 000-00-14", address: "г. Пермь, ул. Ленина, 64", metro: null, coords: { lat: 58.0105, lon: 56.2502 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK+2 (UTC+5)" },
    { slug: "volgograd", name: "Волгоград", region: "Волгоградская область", phone: "+7 (844) 000-00-15", address: "г. Волгоград, пр. Ленина, 50", metro: null, coords: { lat: 48.708, lon: 44.5133 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "krasnodar", name: "Краснодар", region: "Краснодарский край", phone: "+7 (861) 000-00-16", address: "г. Краснодар, ул. Красная, 120", metro: null, coords: { lat: 45.0355, lon: 38.9753 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 5), timezone: "MSK (UTC+3)" },
    { slug: "saransk", name: "Саранск", region: "Республика Мордовия", phone: "+7 (834) 000-00-17", address: "г. Саранск, ул. Большевистская, 55", metro: null, coords: { lat: 54.1838, lon: 45.1749 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "tyumen", name: "Тюмень", region: "Тюменская область", phone: "+7 (345) 000-00-18", address: "г. Тюмень, ул. Республики, 140", metro: null, coords: { lat: 57.1522, lon: 65.5272 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK+2 (UTC+5)" },
    { slug: "yaroslavl", name: "Ярославль", region: "Ярославская область", phone: "+7 (485) 000-00-19", address: "г. Ярославль, ул. Кирова, 10", metro: null, coords: { lat: 57.6261, lon: 39.8845 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "ryazan", name: "Рязань", region: "Рязанская область", phone: "+7 (491) 000-00-20", address: "г. Рязань, ул. Ленина, 30", metro: null, coords: { lat: 54.6265, lon: 39.7339 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "tula", name: "Тула", region: "Тульская область", phone: "+7 (487) 000-00-21", address: "г. Тула, пр. Ленина, 80", metro: null, coords: { lat: 54.1931, lon: 37.6175 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "lipetsk", name: "Липецк", region: "Липецкая область", phone: "+7 (474) 000-00-22", address: "г. Липецк, ул. Советская, 65", metro: null, coords: { lat: 52.6031, lon: 39.5708 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "tver", name: "Тверь", region: "Тверская область", phone: "+7 (482) 000-00-23", address: "г. Тверь, ул. Советская, 23", metro: null, coords: { lat: 56.8587, lon: 35.9006 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "vladivostok", name: "Владивосток", region: "Приморский край", phone: "+7 (423) 000-00-24", address: "г. Владивосток, ул. Светланская, 30", metro: null, coords: { lat: 43.1198, lon: 131.8869 }, schedule: "Пн–Пт 9:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 4), timezone: "MSK+7 (UTC+10)" },
    { slug: "irkutsk", name: "Иркутск", region: "Иркутская область", phone: "+7 (395) 000-00-25", address: "г. Иркутск, ул. Ленина, 11", metro: null, coords: { lat: 52.2869, lon: 104.2824 }, schedule: "Пн–Пт 9:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK+5 (UTC+8)" },
    { slug: "habarovsk", name: "Хабаровск", region: "Хабаровский край", phone: "+7 (421) 000-00-26", address: "г. Хабаровск, ул. Карла Маркса, 60", metro: null, coords: { lat: 48.4726, lon: 135.0589 }, schedule: "Пн–Пт 9:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK+7 (UTC+10)" },
    { slug: "barnaul", name: "Барнаул", region: "Алтайский край", phone: "+7 (385) 000-00-27", address: "г. Барнаул, пр. Ленина, 40", metro: null, coords: { lat: 53.3468, lon: 83.7768 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK+4 (UTC+7)" },
    { slug: "tomsk", name: "Томск", region: "Томская область", phone: "+7 (382) 000-00-28", address: "г. Томск, пр. Ленина, 30", metro: null, coords: { lat: 56.4846, lon: 84.9476 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK+4 (UTC+7)" },
    { slug: "smolensk", name: "Смоленск", region: "Смоленская область", phone: "+7 (481) 000-00-29", address: "г. Смоленск, ул. Большая Советская, 12", metro: null, coords: { lat: 54.7825, lon: 32.0403 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" },
    { slug: "penza", name: "Пенза", region: "Пензенская область", phone: "+7 (841) 000-00-30", address: "г. Пенза, ул. Московская, 30", metro: null, coords: { lat: 53.1959, lon: 45.0208 }, schedule: "Пн–Пт 8:00–19:00", courseSlugs: ALL_COURSE_IDS.slice(0, 3), timezone: "MSK (UTC+3)" }
  ];

  /* ---------- API для работы с городами ---------- */
  const API = {
    cities: CITIES,
    defaultSlug: "moscow",

    findCity(slug) {
      return CITIES.find((c) => c.slug === slug) || null;
    },

    getCityFromUrl() {
      const params = new URLSearchParams(location.search);
      const slug = params.get("city");
      return slug ? this.findCity(slug) : null;
    },

    coursesForCity(city) {
      if (!city || !window.ACADEMY_CONFIG) return [];
      return city.courseSlugs
        .map((id) => window.ACADEMY_CONFIG.COURSES.find((c) => c.id === id))
        .filter(Boolean);
    },

    cityCount() {
      return CITIES.length;
    }
  };

  /* Экспорт */
  window.ACADEMY_GEO = API;
})();
