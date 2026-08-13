/* ============================================================
   Академия ДПО — main.js
   Зависимости (подключены в index.html, deferred):
   GSAP + ScrollTrigger, particles.js, Swiper
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Утилита безопасного запуска после загрузки зависимостей ---------- */
  function whenReady(cb) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb);
    } else {
      cb();
    }
  }

  /* ============================================================
     1. STICKY HEADER (фон при скролле)
     ============================================================ */
  function initHeader() {
    const header = document.querySelector(".header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ============================================================
     2. BURGER MENU
     ============================================================ */
  function initBurger() {
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    if (!burger || !nav) return;

    const toggle = (open) => {
      const isOpen = open ?? !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", isOpen);
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen && window.innerWidth < 1024 ? "hidden" : "";
    };

    burger.addEventListener("click", () => toggle());
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => toggle(false))
    );
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) toggle(false);
    });
  }

  /* ============================================================
     3. PARTICLES.JS (фон hero)
     ============================================================ */
  function initParticles() {
    if (prefersReducedMotion || typeof particlesJS === "undefined") return;
    const el = document.getElementById("particles-js");
    if (!el) return;

    particlesJS("particles-js", {
      particles: {
        number: { value: 38, density: { enable: true, value_area: 900 } },
        color: { value: "#FFD700" },
        shape: { type: "circle" },
        opacity: { value: 0.35, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.1 } },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 130, color: "#FFD700", opacity: 0.12, width: 1 },
        move: { enable: true, speed: 0.7, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true },
        modes: { grab: { distance: 150, line_linked: { opacity: 0.3 } } }
      },
      retina_detect: true
    });
  }

  /* ============================================================
     4. GSAP — scroll-анимации, счётчики, hero-таймлайн
     ============================================================ */

  /* ---------- Fallback: показать .reveal без ScrollTrigger (IntersectionObserver) ---------- */
  function revealOnScrollFallback() {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach((el) => {
      if (el.closest("#hero")) return; // hero уже обработан
      io.observe(el);
    });
  }

  function initGsap() {
    if (typeof gsap === "undefined") {
      // GSAP не загрузился — показываем всё через IntersectionObserver
      revealOnScrollFallback();
      initCounters(true);
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (prefersReducedMotion) {
      // Просто показываем всё, без анимаций
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      initCounters(true);
      return;
    }

    /* 4.1 Hero-таймлайн */
    const heroReveals = document.querySelectorAll("#hero .reveal");
    if (heroReveals.length) {
      const tl = gsap.timeline({ delay: 0.2 });
      heroReveals.forEach((el, i) => {
        tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, i * 0.12);
        el.classList.add("is-visible");
      });
    }

    /* 4.2 Scroll-появление остальных блоков */
    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils.toArray(".reveal").forEach((el) => {
        // Пропускаем hero (анимирован выше)
        if (el.closest("#hero")) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true, onEnter: () => el.classList.add("is-visible") }
          }
        );
      });
    } else {
      // Fallback: ScrollTrigger недоступен — показываем через IntersectionObserver
      revealOnScrollFallback();
    }

    /* 4.3 Stagger для карточек внутри секций */
    if (typeof ScrollTrigger !== "undefined") {
      ["#advantages .features", "#courses .courses"].forEach((sel) => {
        const grid = document.querySelector(sel);
        if (!grid) return;
        const cards = grid.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: grid, start: "top 80%", once: true }
          }
        );
      });
    }

    /* 4.4 Счётчики статистики */
    initCounters(false);
  }

  /* ---------- Анимированные счётчики ---------- */
  function initCounters(instant) {
    const stats = document.querySelectorAll(".stat__value[data-count]");
    if (!stats.length) return;
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (instant) { el.textContent = formatNum(target) + suffix; return; }
      const obj = { val: 0 };
      const tween = (typeof gsap !== "undefined") ? gsap.to(obj, {
        val: target, duration: 1.8, ease: "power2.out",
        onUpdate: () => { el.textContent = formatNum(Math.round(obj.val)) + suffix; }
      }) : null;
      if (!tween) el.textContent = formatNum(target) + suffix;
    };

    stats.forEach((el) => {
      if (instant || typeof ScrollTrigger === "undefined") { animate(el); return; }
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => animate(el)
      });
    });
  }
  function formatNum(n) {
    return n.toLocaleString("ru-RU");
  }

  /* ============================================================
     5. TABS (Направления) — доступный таб-лист
     ============================================================ */
  function initTabs() {
    const buttons = document.querySelectorAll(".tabs__btn");
    const panels = document.querySelectorAll(".tab-panel");
    if (!buttons.length) return;

    const activate = (btn) => {
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => {
        const active = p.id === btn.getAttribute("aria-controls");
        p.classList.toggle("is-active", active);
        p.hidden = !active;
      });
      if (!prefersReducedMotion && typeof gsap !== "undefined") {
        const activePanel = document.querySelector(".tab-panel.is-active");
        if (activePanel) {
          gsap.fromTo(activePanel.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
        }
      }
    };

    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => activate(btn));
      btn.addEventListener("keydown", (e) => {
        let idx = i;
        if (e.key === "ArrowRight") idx = (i + 1) % buttons.length;
        else if (e.key === "ArrowLeft") idx = (i - 1 + buttons.length) % buttons.length;
        else return;
        e.preventDefault();
        buttons[idx].focus();
        activate(buttons[idx]);
      });
    });
  }

  /* ============================================================
     6. ACCORDION FAQ (одно открытое, CSS-анимация высоты)
     ============================================================ */
  function initFaq() {
    const items = document.querySelectorAll(".faq__item");
    items.forEach((item) => {
      const btn = item.querySelector(".faq__question");
      const answer = item.querySelector(".faq__answer");
      if (!btn || !answer) return;
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        // Закрываем все остальные (опционально — оставляем множественное)
        items.forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".faq__question").setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ============================================================
     7. SWIPER — отзывы и партнёры
     ============================================================ */
  function initSwipers() {
    if (typeof Swiper === "undefined") return;

    /* Отзывы */
    const reviewsEl = document.querySelector(".reviews-swiper");
    if (reviewsEl) {
      new Swiper(reviewsEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 600,
        autoplay: prefersReducedMotion ? false : { delay: 5500, disableOnInteraction: false },
        pagination: { el: ".reviews-pagination", clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
    }

    /* Партнёры — бесконечный marquee */
    const partnersEl = document.querySelector(".partners-swiper");
    if (partnersEl) {
      new Swiper(partnersEl, {
        slidesPerView: "auto",
        spaceBetween: 16,
        loop: true,
        speed: 4000,
        allowTouchMove: false,
        autoplay: prefersReducedMotion ? false : { delay: 0, disableOnInteraction: false },
        breakpoints: { 768: { spaceBetween: 20 } }
      });
    }
  }

  /* ============================================================
     8. 3D TILT карточек (только десктоп с мышью)
     ============================================================ */
  function initTilt() {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // тач-устройства
    const cards = document.querySelectorAll("[data-tilt]");
    if (!cards.length) return;

    cards.forEach((card) => {
      const strength = 8;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ============================================================
     9. ВАЛИДАЦИЯ ФОРМЫ
     ============================================================ */
  function initForm() {
    const form = document.getElementById("enroll-form");
    if (!form) return;
    const successMsg = document.getElementById("form-success");

    const phoneRegex = /^\+?\d[\d\s\-()]{9,}\d$/;

    const validators = {
      name: (v) => v.trim().length >= 2 || "Введите имя (минимум 2 символа)",
      phone: (v) => (phoneRegex.test(v.trim()) ? true : "Введите корректный телефон"),
      course: (v) => (v ? true : "Выберите курс"),
      consent: (_, el) => (el.checked ? true : "Необходимо согласие на обработку ПДн")
    };

    const showError = (name, msg) => {
      const errEl = form.querySelector(`[data-error-for="${name}"]`);
      const input = form.querySelector(`[name="${name}"]`);
      if (errEl) errEl.textContent = msg || "";
      if (input && input.type !== "checkbox") input.classList.toggle("is-invalid", !!msg);
    };

    const validateField = (name) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return true;
      const val = el.type === "checkbox" ? "" : el.value;
      const result = validators[name](val, el);
      showError(name, result === true ? "" : result);
      return result === true;
    };

    // Валидация на blur и input (сброс ошибки)
    ["name", "phone", "course", "consent"].forEach((name) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return;
      el.addEventListener("blur", () => validateField(name));
      el.addEventListener("input", () => {
        const errEl = form.querySelector(`[data-error-for="${name}"]`);
        if (errEl && errEl.textContent) validateField(name);
      });
      el.addEventListener("change", () => validateField(name));
    });

    // Маска телефона (простая, для РФ)
    const phone = form.querySelector("#phone");
    if (phone) {
      phone.addEventListener("input", () => {
        let v = phone.value.replace(/\D/g, "");
        if (v.startsWith("8")) v = "7" + v.slice(1);
        if (!v.startsWith("7") && v.length) v = "7" + v;
        v = v.slice(0, 11);
        let out = "+7";
        if (v.length > 1) out += " (" + v.slice(1, 4);
        if (v.length >= 4) out += ") " + v.slice(4, 7);
        if (v.length >= 7) out += "-" + v.slice(7, 9);
        if (v.length >= 9) out += "-" + v.slice(9, 11);
        phone.value = out;
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      ["name", "phone", "course", "consent"].forEach((name) => {
        if (!validateField(name)) valid = false;
      });

      if (!valid) {
        // Фокус на первое невалидное
        const firstInvalid = form.querySelector(".is-invalid, [name='consent']:not(:checked)");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Успешная отправка (демо — без бэкенда)
      form.querySelectorAll("input, select, button").forEach((el) => (el.disabled = true));
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // В реальном проекте здесь fetch() к API
      setTimeout(() => {
        form.reset();
        form.querySelectorAll("input, select, button").forEach((el) => (el.disabled = false));
        if (successMsg) successMsg.hidden = true;
      }, 6000);
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  whenReady(() => {
    initHeader();
    initBurger();
    initParticles();
    initGsap();
    initTabs();
    initFaq();
    initSwipers();
    initTilt();
    initForm();
  });
})();
