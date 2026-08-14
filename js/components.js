/* ============================================================
   Академия ДПО — components.js
   Общие компоненты (header, footer) для всех страниц сайта.
   Внедряется через JS, чтобы избежать дублирования HTML.
   ============================================================ */
(function () {
  "use strict";

  const NAV_ITEMS = [
    { label: "Главная", href: "index.html" },
    { label: "О нас", href: "about.html" },
    { label: "Каталог программ", href: "marketplace.html", accent: true },
    { label: "Преподаватели", href: "teachers.html" },
    { label: "Отзывы", href: "reviews.html" },
    { label: "Корпоративам", href: "b2b.html" },
    { label: "Блог", href: "blog.html" },
    { label: "FAQ", href: "faq.html" },
    { label: "Контакты", href: "contacts.html" }
  ];

  function getCurrentPage() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    return path;
  }

  function buildHeader() {
    const current = getCurrentPage();
    const navLinks = NAV_ITEMS.map((item) => {
      const active = item.href === current ? ' aria-current="page"' : "";
      let cls = item.href === current ? "nav__link is-active" : "nav__link";
      if (item.accent) cls += " nav__link--accent";
      return `        <a href="${item.href}" class="${cls}"${active}>${item.label}</a>`;
    }).join("\n");

    return `
    <header class="header" id="top">
      <div class="container header__inner">
        <a href="index.html" class="logo" aria-label="Академия ДПО — на главную">
          <span class="logo__mark" aria-hidden="true">A</span>
          <span class="logo__text">
            <span class="logo__title">Академия ДПО</span>
            <span class="logo__tagline">Премиальное образование</span>
          </span>
        </a>
        <nav class="nav" id="nav" aria-label="Основная навигация">
${navLinks}
        </nav>
        <div class="header__actions">
          <a href="tel:+78000000000" class="header__phone">8 800 000-00-00</a>
          <button type="button" class="cart-trigger" data-cart-open aria-label="Открыть корзину">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="9" cy="21" r="1.6" />
              <circle cx="18" cy="21" r="1.6" />
            </svg>
            <span class="cart-trigger__badge" data-cart-count hidden>0</span>
          </button>
          <a href="marketplace.html" class="btn btn--primary header__cta magnetic" data-magnetic>Каталог программ</a>
          <button class="burger" id="burger" aria-label="Меню" aria-expanded="false" aria-controls="nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
    <footer class="footer" id="contacts">
      <div class="container footer__inner">
        <div class="footer__col">
          <a href="index.html" class="logo logo--light">
            <span class="logo__mark" aria-hidden="true">A</span>
            <span class="logo__text"><span class="logo__title">Академия ДПО</span><span class="logo__tagline">Премиальное образование</span></span>
          </a>
          <ul class="footer__list footer__list--contact">
            <li><a href="tel:+78000000000">8 800 000-00-00</a></li>
            <li><a href="mailto:info@academy-dpo.ru">info@academy-dpo.ru</a></li>
            <li>г. Москва, ул. Образования, 1</li>
            <li>Пн–Пт 9:00–20:00</li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Образование</h3>
          <ul class="footer__list">
            <li><a href="courses.html">Все курсы</a></li>
            <li><a href="courses.html?cat=working">Рабочие профессии</a></li>
            <li><a href="courses.html?cat=qualification">Повышение квалификации</a></li>
            <li><a href="courses.html?cat=retraining">Профпереподготовка</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Компания</h3>
          <ul class="footer__list">
            <li><a href="about.html">О компании</a></li>
            <li><a href="teachers.html">Преподаватели</a></li>
            <li><a href="reviews.html">Отзывы</a></li>
            <li><a href="b2b.html">Корпоративным клиентам</a></li>
            <li><a href="blog.html">Блог</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h3 class="footer__title">Информация</h3>
          <ul class="footer__list">
            <li><a href="faq.html">Частые вопросы</a></li>
            <li><a href="contacts.html">Контакты</a></li>
            <li><a href="policy.html">Политика конфиденциальности</a></li>
            <li>Лицензия № 0000-00</li>
          </ul>
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Telegram">TG</a>
            <a href="#" class="footer__social-link" aria-label="ВКонтакте">VK</a>
            <a href="#" class="footer__social-link" aria-label="WhatsApp">WA</a>
            <a href="#" class="footer__social-link" aria-label="YouTube">YT</a>
          </div>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>© ${year} Академия ДПО. Лицензия на образовательную деятельность № 0000-00.</p>
        <p class="footer__legal">Все контактные данные являются демонстрационными.</p>
      </div>
    </footer>`;
  }

  function buildScrollProgress() {
    return '<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>';
  }

  function buildPreloader() {
    return `
    <div class="preloader" id="preloader" aria-hidden="true">
      <div class="preloader__logo">A</div>
      <div class="preloader__bar"><span></span></div>
      <p class="preloader__text">Академия ДПО</p>
    </div>`;
  }

  function buildCursor() {
    return '<div class="cursor" id="cursor" aria-hidden="true"></div><div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>';
  }

  // Внедряем компоненты в DOM
  function injectComponents() {
    // Preloader — в начало body
    document.body.insertAdjacentHTML("afterbegin", buildPreloader() + buildScrollProgress() + buildCursor());

    // Header — перед <main> или в начало body если main нет
    const main = document.querySelector("main");
    if (main) {
      main.insertAdjacentHTML("beforebegin", buildHeader());
    } else {
      document.body.insertAdjacentHTML("afterbegin", buildHeader());
    }

    // Footer — в конец body
    document.body.insertAdjacentHTML("beforeend", buildFooter());
  }

  // Запускаем после загрузки DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectComponents);
  } else {
    injectComponents();
  }

  // Экспортируем для использования в main.js (инициализация бургера, header scroll и т.д.)
  window.__componentsReady = true;
})();
