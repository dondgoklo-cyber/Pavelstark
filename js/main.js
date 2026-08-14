/* ============================================================
   Академия ДПО — main.js v2 (расширенный)
   Новое: preloader, custom cursor, magnetic, parallax, split-text,
   calculator, scroll progress
   ============================================================ */
(function () {
  "use strict";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  function whenReady(cb) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  }

  /* ============================================================
     1. PRELOADER
     ============================================================ */
  /* ============================================================
     0. FAST CLICK — мгновенный отклик на тач-устройствах (без 300ms задержки)
     ============================================================ */
  function initFastClick() {
    if (!isTouch) return;
    document.addEventListener("touchend", (e) => {
      // Обрабатываем только кликабельные элементы
      const target = e.target.closest("a, button, .btn, .tabs__btn, .faq__question");
      if (!target) return;
      // Предотвращаем синтетический click с задержкой
      if (target.dataset.fastClickHandled) {
        e.preventDefault();
        e.stopPropagation();
        delete target.dataset.fastClickHandled;
        return;
      }
      target.dataset.fastClickHandled = "1";
      // Сбрасываем флаг через короткое время, чтобы повторный тап работал
      setTimeout(() => { delete target.dataset.fastClickHandled; }, 500);
    }, { passive: false, capture: true });
  }

  /* ============================================================
     0b. PREVENT DOUBLE-TAP ZOOM на кнопках (мобильные)
     ============================================================ */
  function initPreventDoubleTap() {
    if (!isTouch) return;
    let lastTouch = 0;
    document.querySelectorAll(".btn, .tabs__btn, .faq__question, .footer__social-link").forEach((el) => {
      el.addEventListener("touchend", (e) => {
        const now = Date.now();
        if (now - lastTouch <= 300) { e.preventDefault(); }
        lastTouch = now;
      }, { passive: false });
    });
  }

  function initPreloader() {
    const pl = document.getElementById("preloader");
    if (!pl) return;
    const hide = () => { pl.classList.add("is-hidden"); setTimeout(() => pl.remove(), 600); };
    if (prefersReducedMotion) { hide(); return; }
    window.addEventListener("load", () => setTimeout(hide, 600));
    setTimeout(hide, 2500); // запасной выход
  }

  /* ============================================================
     2. SCROLL PROGRESS BAR
     ============================================================ */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ============================================================
     3. CUSTOM CURSOR (desktop)
     ============================================================ */
  function initCursor() {
    if (isTouch || prefersReducedMotion) return;
    const cursor = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");
    if (!cursor || !dot) return;
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      dot.style.opacity = "1";
      cursor.style.opacity = "1";
    });
    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll("a, button, .magnetic, input, select, label").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });
    document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; dot.style.opacity = "0"; });
  }

  /* ============================================================
     4. MAGNETIC BUTTONS (desktop)
     ============================================================ */
  function initMagnetic() {
    if (isTouch || prefersReducedMotion) return;
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.35;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
        el.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ============================================================
     5. STICKY HEADER
     ============================================================ */
  function initHeader() {
    const header = document.querySelector(".header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ============================================================
     6. BURGER MENU
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
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggle(false)));
    window.addEventListener("resize", () => { if (window.innerWidth >= 1024) toggle(false); });
  }

  /* ============================================================
     7. PARTICLES.JS
     ============================================================ */
  function initParticles() {
    if (prefersReducedMotion || typeof particlesJS === "undefined") return;
    const el = document.getElementById("particles-js");
    if (!el) return;
    particlesJS("particles-js", {
      particles: {
        number: { value: 42, density: { enable: true, value_area: 900 } },
        color: { value: "#FFD700" },
        shape: { type: "circle" },
        opacity: { value: 0.35, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.1 } },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 130, color: "#FFD700", opacity: 0.12, width: 1 },
        move: { enable: true, speed: 0.7, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true }, modes: { grab: { distance: 150, line_linked: { opacity: 0.3 } } } },
      retina_detect: true
    });
  }

  /* ============================================================
     8. SPLIT TEXT (разбивка заголовков на буквы)
     ============================================================ */
  function initSplitText() {
    document.querySelectorAll("[data-split]").forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char === " " ? "\u00A0" : char;
        el.appendChild(span);
      });
    });
  }

  /* ============================================================
     9. GSAP — animations, counters, parallax
     ============================================================ */
  function revealOnScrollFallback() {
    const els = document.querySelectorAll(".reveal:not(.is-visible), [data-split]:not(.is-visible)");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    els.forEach((el) => { if (el.closest("#hero")) return; io.observe(el); });
  }

  function initGsap() {
    if (typeof gsap === "undefined") {
      revealOnScrollFallback();
      document.querySelectorAll(".reveal, [data-split]").forEach((el) => el.classList.add("is-visible"));
      initCounters(true);
      return;
    }
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal, [data-split]").forEach((el) => el.classList.add("is-visible"));
      initCounters(true);
      return;
    }

    // Hero: split-text анимация
    const heroSplit = document.querySelectorAll("#hero [data-split]");
    heroSplit.forEach((el) => {
      const chars = el.querySelectorAll(".char");
      if (chars.length) {
        gsap.fromTo(chars, { opacity: 0, y: 20, rotateX: -90 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.5, ease: "power2.out", stagger: 0.02, delay: 0.3 });
        el.classList.add("is-visible");
      }
    });
    const heroReveals = document.querySelectorAll("#hero .reveal");
    heroReveals.forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.5 + i * 0.12 });
      el.classList.add("is-visible");
    });

    // Scroll reveal для остальных блоков
    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils.toArray(".reveal, [data-split]").forEach((el) => {
        if (el.closest("#hero")) return;
        gsap.fromTo(el, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true, onEnter: () => el.classList.add("is-visible") }
        });
      });

      // Stagger для сеток
      ["#advantages .features", "#courses .courses", "#teachers .teachers"].forEach((sel) => {
        const grid = document.querySelector(sel);
        if (!grid) return;
        gsap.fromTo(grid.children, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: grid, start: "top 80%", once: true }
        });
      });

      // Timeline stagger
      const tl = document.querySelector(".timeline");
      if (tl) {
        gsap.fromTo(tl.children, { opacity: 0, x: -30 }, {
          opacity: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: tl, start: "top 80%", once: true }
        });
      }

      // Parallax
      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        gsap.to(el, {
          y: () => speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 }
        });
      });
    } else {
      revealOnScrollFallback();
    }

    initCounters(false);
  }

  function initCounters(instant) {
    const stats = document.querySelectorAll(".stat__value[data-count]");
    if (!stats.length) return;
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (instant) { el.textContent = formatNum(target) + suffix; return; }
      const obj = { val: 0 };
      if (typeof gsap !== "undefined") {
        gsap.to(obj, { val: target, duration: 1.8, ease: "power2.out", onUpdate: () => { el.textContent = formatNum(Math.round(obj.val)) + suffix; } });
      } else { el.textContent = formatNum(target) + suffix; }
    };
    stats.forEach((el) => {
      if (instant || typeof ScrollTrigger === "undefined") { animate(el); return; }
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => animate(el) });
    });
  }
  function formatNum(n) { return n.toLocaleString("ru-RU"); }

  /* ============================================================
     10. TABS
     ============================================================ */
  function initTabs() {
    const buttons = document.querySelectorAll(".tabs__btn");
    const panels = document.querySelectorAll(".tab-panel");
    if (!buttons.length) return;
    const activate = (btn) => {
      buttons.forEach((b) => { const a = b === btn; b.classList.toggle("is-active", a); b.setAttribute("aria-selected", String(a)); });
      panels.forEach((p) => { const a = p.id === btn.getAttribute("aria-controls"); p.classList.toggle("is-active", a); p.hidden = !a; });
      if (!prefersReducedMotion && typeof gsap !== "undefined") {
        const active = document.querySelector(".tab-panel.is-active");
        if (active) gsap.fromTo(active.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
      }
    };
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => activate(btn));
      btn.addEventListener("keydown", (e) => {
        let idx = i;
        if (e.key === "ArrowRight") idx = (i + 1) % buttons.length;
        else if (e.key === "ArrowLeft") idx = (i - 1 + buttons.length) % buttons.length;
        else return;
        e.preventDefault(); buttons[idx].focus(); activate(buttons[idx]);
      });
    });
  }

  /* ============================================================
     11. FAQ ACCORDION
     ============================================================ */
  function initFaq() {
    const items = document.querySelectorAll(".faq__item");
    items.forEach((item) => {
      const btn = item.querySelector(".faq__question");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach((o) => { if (o !== item) { o.classList.remove("is-open"); o.querySelector(".faq__question").setAttribute("aria-expanded", "false"); } });
        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ============================================================
     12. SWIPER
     ============================================================ */
  function initSwipers() {
    if (typeof Swiper === "undefined") return;
    const reviewsEl = document.querySelector(".reviews-swiper");
    if (reviewsEl) {
      new Swiper(reviewsEl, {
        slidesPerView: 1, spaceBetween: 20, loop: true, speed: 600,
        autoplay: prefersReducedMotion ? false : { delay: 5500, disableOnInteraction: false },
        pagination: { el: ".reviews-pagination", clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
      });
    }
  }

  /* ============================================================
     13. 3D TILT (desktop)
     ============================================================ */
  function initTilt() {
    if (prefersReducedMotion || isTouch) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const strength = 8;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ============================================================
     14. CALCULATOR
     ============================================================ */
  function initCalculator() {
    const courseSel = document.getElementById("calc-course");
    const range = document.getElementById("calc-students");
    const countVal = document.getElementById("calc-count-val");
    const total = document.getElementById("calc-total");
    const discount = document.getElementById("calc-discount");
    if (!courseSel || !range || !total) return;

    const calc = () => {
      const price = parseInt(courseSel.value, 10) || 0;
      const count = parseInt(range.value, 10) || 1;
      countVal.textContent = count;
      let sum = price * count;
      let disc = 0;
      if (count >= 10) { disc = 0.30; }
      else if (count >= 7) { disc = 0.20; }
      else if (count >= 5) { disc = 0.15; }
      else if (count >= 3) { disc = 0.10; }
      const final = Math.round(sum * (1 - disc));
      total.textContent = formatNum(final) + " ₽";
      if (disc > 0) {
        discount.textContent = `Скидка ${disc * 100}% (вместо ${formatNum(sum)} ₽)`;
        discount.hidden = false;
      } else { discount.hidden = true; }
    };
    courseSel.addEventListener("change", calc);
    range.addEventListener("input", calc);
    calc();
  }

  /* ============================================================
     15. FORM VALIDATION
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
    ["name", "phone", "course", "consent"].forEach((name) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return;
      el.addEventListener("blur", () => validateField(name));
      el.addEventListener("input", () => { const e = form.querySelector(`[data-error-for="${name}"]`); if (e && e.textContent) validateField(name); });
      el.addEventListener("change", () => validateField(name));
    });
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
      ["name", "phone", "course", "consent"].forEach((n) => { if (!validateField(n)) valid = false; });
      if (!valid) { const first = form.querySelector(".is-invalid, [name='consent']:not(:checked)"); if (first) first.focus(); return; }
      form.querySelectorAll("input, select, button").forEach((el) => (el.disabled = true));
      if (successMsg) { successMsg.hidden = false; successMsg.scrollIntoView({ behavior: "smooth", block: "center" }); }
      setTimeout(() => { form.reset(); form.querySelectorAll("input, select, button").forEach((el) => (el.disabled = false)); if (successMsg) successMsg.hidden = true; }, 6000);
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  whenReady(() => {
    initPreloader();
    initScrollProgress();
    initCursor();
    initSplitText();
    initHeader();
    initBurger();
    initParticles();
    initGsap();
    initTabs();
    initFaq();
    initSwipers();
    initTilt();
    initCalculator();
    initForm();
    initMagnetic();
    initFastClick();
    initPreventDoubleTap();
  });
})();
