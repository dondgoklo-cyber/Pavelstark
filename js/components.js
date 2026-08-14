/* ============================================================
   Академия ДПО — components.js
   Общий header и footer + переиспользуемые рендереры блоков.
   Читает контент из window.ACADEMY_CONFIG (js/config.js).

   Подключается ПОСЛЕ config.js, ДО main.js:
     <script src="js/config.js" defer></script>
     <script src="js/components.js" defer></script>
     <script src="js/main.js" defer></script>

   На странице достаточно иметь <div data-header></div> и
   <div data-footer></div> — компоненты подставятся автоматически.
   Если таких нет, header/footer ищутся по .header / .footer.
   ============================================================ */
(function () {
  "use strict";

  const CFG = window.ACADEMY_CONFIG;
  if (!CFG) {
    console.error("[components.js] window.ACADEMY_CONFIG не найден. Подключите js/config.js первым.");
    return;
  }
  const { SITE, NAV_ITEMS, COURSES, ADVANTAGES, REVIEWS, PARTNERS, FAQ_ITEMS, SOCIAL, FOOTER_LINKS, IMAGES } = CFG;

  /* Текущая страница (для подсветки активного пункта меню) */
  function currentPage() {
    const path = location.pathname.split("/").pop() || "index.html";
    return path === "" ? "index.html" : path;
  }

  /* Утилита экранирования (защита от XSS при рендере из конфига) */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Тег курса → CSS-класс */
  function tagClass(tag) {
    return tag ? `course-card__tag course-card__tag--${tag}` : "course-card__tag";
  }

  function formatPrice(p) {
    return p.toLocaleString("ru-RU") + " ₽";
  }

  /* ============================================================
     HEADER (с city selector)
     ============================================================ */
  function buildHeader() {
    const current = currentPage();
    const logoImg = IMAGES.logoMark
      ? `<img src="${esc(IMAGES.logoMark)}" alt="${esc(SITE.name)}" width="44" height="44" />`
      : `<span class="logo__mark" aria-hidden="true">A</span>`;

    const navHtml = NAV_ITEMS.map(
      (item) =>
        `<a href="${esc(item.href)}" class="nav__link${item.href === current ? " is-current" : ""}">${esc(item.label)}</a>`
    ).join("");

    return `
      <header class="header" id="top">
        <div class="container header__inner">
          <a href="index.html" class="logo" aria-label="${esc(SITE.name)} — на главную">
            ${logoImg}
            <span class="logo__text">
              <span class="logo__title">${esc(SITE.name)}</span>
              <span class="logo__tagline">${esc(SITE.tagline)}</span>
            </span>
          </a>

          <div class="header__city" data-city-widget>
            <button class="city-btn" type="button" data-city-toggle aria-haspopup="dialog" aria-expanded="false" aria-label="Выбрать город">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
              <span data-city-label>Москва</span>
            </button>
            <div class="city-dropdown" data-city-dropdown hidden></div>
          </div>

          <nav class="nav" id="nav" aria-label="Основная навигация">
            ${navHtml}
          </nav>

          <div class="header__actions">
            <a href="tel:${esc(SITE.phoneHref)}" class="header__phone">${esc(SITE.phoneDisplay)}</a>
            <a href="contacts.html#enroll" class="btn btn--primary header__cta">Записаться</a>
            <button class="burger" id="burger" aria-label="Меню" aria-expanded="false" aria-controls="nav">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>`;
  }

  /* ============================================================
     FOOTER
     ============================================================ */
  function buildFooter() {
    const directionsHtml = FOOTER_LINKS.directions
      .map((d) => `<li><a href="${esc(d.href)}">${esc(d.label)}</a></li>`)
      .join("");
    const docsHtml = FOOTER_LINKS.docs
      .map((d) => `<li><a href="${esc(d.href)}">${esc(d.label)}</a></li>`)
      .join("");
    const socialHtml = SOCIAL.map(
      (s) =>
        `<a href="${esc(s.href)}" class="footer__social-link" aria-label="${esc(s.label)}">${esc(s.short)}</a>`
    ).join("");

    return `
      <footer class="footer" id="contacts">
        <div class="container footer__inner">
          <div class="footer__col">
            <a href="index.html" class="logo logo--light">
              <span class="logo__mark" aria-hidden="true">A</span>
              <span class="logo__text">
                <span class="logo__title">${esc(SITE.name)}</span>
                <span class="logo__tagline">${esc(SITE.tagline)}</span>
              </span>
            </a>
            <ul class="footer__list footer__list--contact">
              <li><a href="tel:${esc(SITE.phoneHref)}">${esc(SITE.phoneDisplay)}</a></li>
              <li><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>
              <li>${esc(SITE.address)}</li>
              <li>${esc(SITE.workingHours)}</li>
            </ul>
          </div>

          <div class="footer__col">
            <h3 class="footer__title">Направления</h3>
            <ul class="footer__list">${directionsHtml}</ul>
          </div>

          <div class="footer__col">
            <h3 class="footer__title">Документы</h3>
            <ul class="footer__list">${docsHtml}</ul>
          </div>

          <div class="footer__col">
            <h3 class="footer__title">Мы в соцсетях</h3>
            <div class="footer__social">${socialHtml}</div>
          </div>
        </div>

        <div class="container footer__bottom">
          <p>© ${SITE.year} ${esc(SITE.name)}. ${esc(SITE.license)}.</p>
          <p class="footer__legal">${esc(SITE.legalNote)}</p>
        </div>
      </footer>`;
  }

  /* ============================================================
     Рендереры блоков (переиспользуются на всех страницах)
     ============================================================ */

  /* Счётчики статистики hero */
  function renderStats(container) {
    if (!container) return;
    container.innerHTML = CFG.STATS.map(
      (s) => `
        <li class="stat reveal" data-reveal>
          <span class="stat__value" data-count="${s.value}" data-suffix="${esc(s.suffix)}">0</span>
          <span class="stat__label">${esc(s.label)}</span>
        </li>`
    ).join("");
  }

  /* Табы направлений (кнопки + панели) */
  function renderDirections(tabsContainer, panelsContainer) {
    if (!tabsContainer || !panelsContainer) return;
    tabsContainer.innerHTML = CFG.DIRECTIONS.map(
      (d, i) =>
        `<button class="tabs__btn${i === 0 ? " is-active" : ""}" role="tab" aria-selected="${i === 0 ? "true" : "false"}" aria-controls="panel-${d.id}" id="tab-${d.id}">${esc(d.label)}</button>`
    ).join("");
    panelsContainer.innerHTML = CFG.DIRECTIONS.map(
      (d, i) => `
        <ul class="tab-panel${i === 0 ? " is-active" : ""}" id="panel-${d.id}" role="tabpanel" aria-labelledby="tab-${d.id}"${i === 0 ? "" : " hidden"}>
          ${d.professions.map((p) => `<li>${esc(p)}</li>`).join("")}
        </ul>`
    ).join("");
  }

  /* Карточки преимуществ */
  function renderAdvantages(container) {
    if (!container) return;
    container.innerHTML = CFG.ADVANTAGES.map(
      (a) => `
        <article class="feature-card reveal" data-reveal data-tilt>
          <div class="feature-card__icon" aria-hidden="true">${a.icon}</div>
          <h3 class="feature-card__title">${esc(a.title)}</h3>
          <p class="feature-card__text">${esc(a.text)}</p>
        </article>`
    ).join("");
  }

  /* Карточки курсов (на главной — все; на courses.html можно фильтровать) */
  function renderCourses(container, filterFn) {
    if (!container) return;
    const list = typeof filterFn === "function" ? CFG.COURSES.filter(filterFn) : CFG.COURSES;
    container.innerHTML = list
      .map(
        (c) => `
        <article class="course-card reveal" data-reveal data-tilt data-course="${esc(c.id)}">
          ${c.tag ? `<span class="${tagClass(c.tag)}">${esc(c.tagLabel)}</span>` : ""}
          <h3 class="course-card__title">${esc(c.title)}</h3>
          <ul class="course-card__meta">
            <li>${esc(c.format)}</li>
            <li>${c.hours} ак. ч.</li>
          </ul>
          <p class="course-card__desc">${esc(c.description)}</p>
          <div class="course-card__footer">
            <span class="course-card__price">${formatPrice(c.price)}</span>
            <a href="contacts.html#enroll" class="btn btn--primary btn--sm" data-enroll="${esc(c.title)}">Записаться</a>
          </div>
        </article>`
      )
      .join("");
  }

  /* Опции <select> формы (источник — тот же COURSES) */
  function renderCourseOptions(select) {
    if (!select) return;
    select.innerHTML =
      '<option value="" disabled selected>Выберите курс</option>' +
      CFG.COURSES.map((c) => `<option value="${esc(c.title)}">${esc(c.title)}</option>`).join("");
  }

  /* Отзывы (слайды swiper) */
  function renderReviews(container) {
    if (!container) return;
    container.innerHTML = CFG.REVIEWS.map((r) => {
      const stars = "★".repeat(r.stars);
      return `
        <article class="swiper-slide review">
          <div class="review__stars" aria-label="Оценка ${r.stars} из 5">${stars}</div>
          <p class="review__text">«${esc(r.text)}»</p>
          <div class="review__author">
            <span class="review__avatar" aria-hidden="true">${esc(r.initials)}</span>
            <span><strong>${esc(r.author)}</strong><br>${esc(r.role)}</span>
          </div>
        </article>`;
    }).join("");
  }

  /* Партнёры (marquee) */
  function renderPartners(container) {
    if (!container) return;
    container.innerHTML = CFG.PARTNERS.map((p) => `<div class="swiper-slide partner">${esc(p)}</div>`).join("");
  }

  /* FAQ-аккордеон */
  function renderFaq(container) {
    if (!container) return;
    container.innerHTML = CFG.FAQ_ITEMS.map(
      (f) => `
        <div class="faq__item">
          <button class="faq__question" aria-expanded="false">
            <span>${esc(f.q)}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </button>
          <div class="faq__answer"><p>${esc(f.a)}</p></div>
        </div>`
    ).join("");
  }

  /* ============================================================
     City selector (читает из window.ACADEMY_GEO)
     ============================================================ */
  function initCitySelector() {
    const widget = document.querySelector("[data-city-widget]");
    if (!widget) return;
    const toggle = widget.querySelector("[data-city-toggle]");
    const dropdown = widget.querySelector("[data-city-dropdown]");
    const label = widget.querySelector("[data-city-label]");
    if (!toggle || !dropdown || !label) return;

    const GEO = window.ACADEMY_GEO;
    if (!GEO || !GEO.cities || !GEO.cities.length) {
      /* Гео-данные не подключены — селектор остаётся, но без списка */
      return;
    }

    const STORAGE_KEY = "academy-city";
    let currentSlug = localStorage.getItem(STORAGE_KEY) || GEO.defaultSlug || GEO.cities[0].slug;
    const current = GEO.findCity(currentSlug) || GEO.cities[0];
    label.textContent = current.name;

    /* Список городов */
    dropdown.innerHTML = GEO.cities
      .map(
        (c) =>
          `<a href="city.html?city=${encodeURIComponent(c.slug)}" class="city-dropdown__item${c.slug === currentSlug ? " is-current" : ""}" data-city="${esc(c.slug)}">${esc(c.name)}</a>`
      )
      .join("");

    const open = (state) => {
      const isOpen = state ?? dropdown.hidden;
      dropdown.hidden = !isOpen;
      toggle.setAttribute("aria-expanded", String(isOpen));
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      open(dropdown.hidden);
    });
    document.addEventListener("click", (e) => {
      if (!widget.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") open(false);
    });

    /* Запоминаем выбор при клике */
    dropdown.addEventListener("click", (e) => {
      const item = e.target.closest("[data-city]");
      if (!item) return;
      localStorage.setItem(STORAGE_KEY, item.dataset.city);
    });
  }

  /* ============================================================
     Монтаж header/footer на страницу
     ============================================================ */
  function mountLayout() {
    const headerSlot = document.querySelector("[data-header]") || document.querySelector(".header");
    const footerSlot = document.querySelector("[data-footer]") || document.querySelector(".footer");

    /* header: заменяем плейсхолдер, но НЕ перетираем существующий сложный header */
    if (headerSlot && headerSlot.hasAttribute("data-header")) {
      headerSlot.outerHTML = buildHeader();
    }
    if (footerSlot && footerSlot.hasAttribute("data-footer")) {
      footerSlot.outerHTML = buildFooter();
    }

    /* Авто-рендер блоков по data-атрибутам */
    renderStats(document.querySelector("[data-render-stats]"));
    renderDirections(document.querySelector("[data-render-directions-tabs]"), document.querySelector("[data-render-directions-panels]"));
    renderAdvantages(document.querySelector("[data-render-advantages]"));
    renderCourses(document.querySelector("[data-render-courses]"));
    renderCourseOptions(document.querySelector("[data-render-course-options]"));
    renderReviews(document.querySelector("[data-render-reviews]"));
    renderPartners(document.querySelector("[data-render-partners]"));
    renderFaq(document.querySelector("[data-render-faq]"));
  }

  /* Запуск */
  function whenReady(cb) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  }

  whenReady(() => {
    mountLayout();
    initCitySelector();
    /* Сигнал для main.js: компоненты смонтированы */
    document.dispatchEvent(new CustomEvent("academy:components-ready"));
  });

  /* Экспорт рендереров для ручного вызова (напр. на courses.html после фильтрации) */
  window.ACADEMY_COMPONENTS = {
    buildHeader,
    buildFooter,
    renderCourses,
    renderCourseOptions,
    renderReviews,
    renderPartners,
    renderFaq,
    renderAdvantages,
    renderDirections,
    renderStats,
    initCitySelector,
    esc,
    formatPrice,
    currentPage
  };
})();
